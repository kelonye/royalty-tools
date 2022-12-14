import './utils/dotenv';
import cron from 'node-cron';
import Debug from 'debug';
import * as db from '../src/utils/db';
import sync from '../src/sync';

const debug = Debug('backend:cron');

db.connect().then(() => {
  // every 10 minutes
  cron.schedule('*/10 * * * *', async function () {
    debug('running at', new Date());
    sync(true);
  });
});
