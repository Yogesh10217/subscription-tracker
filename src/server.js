import cron from 'node-cron';
import app from './app.js';
import { PORT, NODE_ENV } from './config/env.js';
import connectToDatabase from './config/database.js';
import NotificationSchedulerService from '#notifications/jobs/notification-scheduler.service.js';
import logger from './utils/logger.js';

const server = app.listen(PORT, async () => {
  logger.info(`🚀 Subscription Tracker server listening on http://localhost:${PORT}`);
  await connectToDatabase();

  if (NODE_ENV !== 'test') {
    // Schedule in-process daily notification evaluation at 09:00 AM
    cron.schedule('0 9 * * *', async () => {
      logger.info('⏰ Executing daily background notification scheduler...');
      try {
        const result = await NotificationSchedulerService.runScheduler();
        logger.info('✅ Scheduled notifications processed successfully', result);
      } catch (cronErr) {
        logger.error('❌ Error in background notification scheduler', { error: cronErr.message });
      }
    });

    logger.info('📅 In-Process node-cron Scheduler initialized (Daily at 09:00 AM)');
  }
});

export default server;
