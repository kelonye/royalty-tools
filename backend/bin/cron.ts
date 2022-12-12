import './utils/dotenv';
import cron from 'node-cron';
import Debug from 'debug';
import sync from '../src/sync';

const debug = Debug('backend:cron');

// every 10 minutes
cron.schedule('*/10 * * * *', async function () {
  debug('running at', new Date());
  sync(true);
});
