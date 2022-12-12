import './utils/dotenv';
import sync from '../src/sync';
import * as db from '../src/utils/db';

sync()
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    db.teardown().finally(() => {
      process.exit(0);
    });
  });
