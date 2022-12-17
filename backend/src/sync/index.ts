import Debug from 'debug';
import * as qs from 'querystring';
import fetch from 'cross-fetch';

import { COLLECTIONS } from '../config';
import { Sale } from '../types';
import { sleep } from '../utils/promise';
import * as db from '../utils/db';

const debug = Debug('backend:stats');
const LIMIT = 500;
const TIMEOUT = 1000 * 60 * 3; // 3 minutes

export default sync;

async function sync(fromNow?: boolean) {
  try {
    await Promise.allSettled(
      Array.from(COLLECTIONS.entries()).map(
        ([collectionSymbol, updateAuthority]) =>
          syncCollection(collectionSymbol, updateAuthority, fromNow)
      )
    );
  } catch (e) {
    console.warn(e);
  }
  await db.teardown();
  debug('done');
}

async function syncCollection(
  collectionSymbol: string,
  updateAuthority: string,
  fromNow?: boolean
) {
  const c = db.collection();
  const noOfSales = fromNow
    ? 0
    : await c.count({
        collection_symbol: collectionSymbol,
      });
  debug('%s: syncing, no of sales(%d)', collectionSymbol, noOfSales);

  if (!noOfSales || noOfSales > LIMIT) {
    const oldestSale = fromNow
      ? null
      : await c.findOne(
          {
            collection_symbol: collectionSymbol,
          },
          {
            sort: {
              time: 1,
            },
          }
        );

    debug(
      '%s: querying sales before %s',
      collectionSymbol,
      oldestSale ? oldestSale.time : 'now'
    );

    const url =
      'https://api.coralcube.cc/0dec5037-f67d-4da8-9eb6-97e2a09ffe9a/inspector/getMintActivities?' +
      qs.stringify({
        update_authority: updateAuthority,
        collection_symbol: collectionSymbol,
        limit: LIMIT,
        ...(!oldestSale ? null : { time: oldestSale.time }),
      });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const sales: Sale[] = await (
      await fetch(url, {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        },
        signal: controller.signal,
      })
    ).json();

    clearTimeout(timeoutId);

    if (sales.length) {
      const bulkWriteOpts = sales.map((sale) => ({
        updateMany: {
          filter: { signature: sale.signature },
          update: {
            $set: { ...sale, collection_symbol: collectionSymbol },
          },
          upsert: true,
        },
      }));

      await c.bulkWrite(bulkWriteOpts);

      if (sales.length === LIMIT) {
        await sleep(1000);
        await syncCollection(collectionSymbol, updateAuthority);
      }
    }
  }

  debug('%s: complete', collectionSymbol);
}
