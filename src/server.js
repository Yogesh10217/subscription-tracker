import app from './app.js';
import { PORT } from './config/env.js';
import connectToDatabase from './config/database.js';
import logger from './utils/logger.js';

const server = app.listen(PORT, async () => {
  logger.info(`🚀 Subscription Tracker server listening on http://localhost:${PORT}`);
  await connectToDatabase();
});

export default server;
