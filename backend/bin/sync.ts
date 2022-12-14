import './utils/dotenv';
import * as db from '../src/utils/db';
import sync from '../src/sync';

db.connect()
  .then(() => sync())
  .finally(db.teardown);
