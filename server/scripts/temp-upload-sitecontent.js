import 'dotenv/config';
import mongoose from 'mongoose';
import defaultSiteContent from '../src/config/siteContent.js';
import { getDb } from '../src/db/connection.js';

function maskMongoUri(uri = '') {
  return String(uri).replace(/\/\/[^@]+@/, '//***:***@');
}

async function run() {
  await getDb();
  const collection = mongoose.connection.collection('sitecontents');

  const deleteResult = await collection.deleteMany({});
  const insertResult = await collection.insertOne({
    key: 'default',
    content: defaultSiteContent,
    updatedAt: new Date()
  });
  const total = await collection.countDocuments();

  console.log(
    JSON.stringify(
      {
        ok: true,
        message: 'Site content replaced successfully.',
        target: {
          dbName: mongoose.connection.db?.databaseName || null,
          host: mongoose.connection.host || null,
          uri: maskMongoUri(process.env.MONGODB_URI || '')
        },
        deletedOldDocuments: deleteResult.deletedCount,
        insertedId: String(insertResult.insertedId),
        totalDocumentsNow: total
      },
      null,
      2
    )
  );
}

run()
  .catch((error) => {
    console.error(
      JSON.stringify(
        {
          ok: false,
          message: 'Failed to upload site content.',
          error: error?.message || 'unknown_error'
        },
        null,
        2
      )
    );
    process.exit(1);
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
    } catch {
      // ignore disconnect errors
    }
  });

