import 'dotenv/config';
import dns from 'node:dns';
import mongoose from 'mongoose';

const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/novarosolution';
let dnsMapApplied = false;

function applyDnsHostMap() {
  if (dnsMapApplied) return;

  const raw = String(process.env.MIGRATION_DNS_HOST_MAP || '').trim();
  if (!raw) return;

  const map = new Map();
  for (const pair of raw.split(',')) {
    const [host, ip] = pair.split('=').map((v) => String(v || '').trim());
    if (host && ip) map.set(host.toLowerCase(), ip);
  }
  if (map.size === 0) return;

  const originalLookup = dns.lookup.bind(dns);
  dns.lookup = function patchedLookup(hostname, options, callback) {
    const key = String(hostname || '').toLowerCase();
    const ip = map.get(key);

    if (!ip) return originalLookup(hostname, options, callback);

    if (typeof options === 'function') {
      return options(null, ip, 4);
    }
    if (typeof callback === 'function') {
      const all = options && typeof options === 'object' && options.all;
      if (all) return callback(null, [{ address: ip, family: 4 }]);
      return callback(null, ip, 4);
    }
    return originalLookup(hostname, options, callback);
  };

  dnsMapApplied = true;
  console.log(`[migrate] DNS host-map enabled for ${map.size} host(s).`);
}

async function connect(uri) {
  applyDnsHostMap();
  const conn = await mongoose.createConnection(uri, {
    serverSelectionTimeoutMS: 15000,
  }).asPromise();
  return conn;
}

function buildBulkOps(docs) {
  return docs.map((doc) => {
    if (doc && doc._id) {
      return {
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: doc },
          upsert: true,
        },
      };
    }
    return { insertOne: { document: doc } };
  });
}

async function migrate() {
  const sourceUri = process.env.MIGRATION_SOURCE_URI || process.env.MONGODB_URI_FALLBACK || DEFAULT_LOCAL_URI;
  const targetUri = process.env.MIGRATION_TARGET_URI || process.env.MONGODB_URI;
  const onlyCollections = String(process.env.MIGRATION_COLLECTIONS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (!targetUri) {
    throw new Error('MONGODB_URI (Atlas target) is required.');
  }
  if (sourceUri === targetUri) {
    throw new Error('Source and target DB URIs are identical. Set MIGRATION_SOURCE_URI to localhost URI.');
  }

  const source = await connect(sourceUri);
  const target = await connect(targetUri);

  try {
    const collections = await source.db.listCollections({}, { nameOnly: true }).toArray();
    let names = collections
      .map((item) => item.name)
      .filter((name) => name && !name.startsWith('system.'));

    if (onlyCollections.length > 0) {
      const set = new Set(onlyCollections);
      names = names.filter((name) => set.has(name));
    }

    if (names.length === 0) {
      console.log('[migrate] No collections found in source DB.');
      return;
    }

    for (const name of names) {
      const sourceCol = source.db.collection(name);
      const targetCol = target.db.collection(name);
      const docs = await sourceCol.find({}).toArray();

      if (docs.length === 0) {
        console.log(`[migrate] ${name}: 0 docs (skipped)`);
        continue;
      }

      const operations = buildBulkOps(docs);
      let migrated = 0;

      for (let i = 0; i < operations.length; i += 500) {
        const chunk = operations.slice(i, i + 500);
        await targetCol.bulkWrite(chunk, { ordered: false });
        migrated += chunk.length;
      }

      console.log(`[migrate] ${name}: ${migrated} docs migrated`);
    }

    console.log('[migrate] Localhost -> Atlas migration completed.');
  } finally {
    await source.close();
    await target.close();
  }
}

migrate().catch((error) => {
  console.error('[migrate] Migration failed:', error.message);
  process.exit(1);
});
