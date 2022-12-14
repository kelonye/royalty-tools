import './utils/dotenv';
import Debug from 'debug';

const debug = Debug('backend:web');
import * as db from '../src/utils/db';
import app from '../src/web';

const PORT = process.env.PORT;

db.connect().then(() => {
  app.listen(PORT, () => {
    debug(`listening on port ${PORT}`);
  });
});
