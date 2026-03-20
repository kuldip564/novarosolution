import 'dotenv/config';
import cluster from 'node:cluster';
import os from 'node:os';
import { ENABLE_CLUSTER, CLUSTER_WORKERS, NODE_ENV } from './src/config/env.js';
import { startServer } from './src/server.js';

const shouldCluster = ENABLE_CLUSTER && NODE_ENV === 'production';

if (shouldCluster && cluster.isPrimary) {
  const workerCount = CLUSTER_WORKERS > 0 ? CLUSTER_WORKERS : os.cpus().length;
  for (let i = 0; i < workerCount; i += 1) cluster.fork();

  cluster.on('exit', () => {
    cluster.fork();
  });
} else {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
