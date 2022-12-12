import express from 'express';
import * as db from '../utils/db';
import { COLLECTIONS, ROYALTY_RATE } from '../config';
import moment from 'moment';
import { orderBy } from 'lodash';

const MAX_PAGE_COUNT = 100;

export default function () {
  const app = express.Router();

  app.get('/collections', async (req, res) => {
    res.json(Array.from(COLLECTIONS.keys()));
  });

  app.get('/sales/:collectionSymbol', async (req, res) => {
    const {
      params: { collectionSymbol },
    } = req;

    const pageArg = parseNumberQueryParam(req.query.page as string, 0);
    const countArg = parseNumberQueryParam(
      req.query.count as string,
      MAX_PAGE_COUNT
    );
    const count = countArg > MAX_PAGE_COUNT ? MAX_PAGE_COUNT : countArg;
    const frm = pageArg * count;

    const query = getQueryParams(collectionSymbol, req.query);

    const c = await db.collection();
    const [totalCount, sales] = await Promise.all([
      c.count(query),
      c.find(query).sort('time', -1).skip(frm).limit(count),
    ]);

    res.json({
      totalCount,
      data: await sales.toArray(),
    });
  });

  app.get('/chart/:collectionSymbol', async (req, res) => {
    const c = await db.collection();

    const {
      params: { collectionSymbol },
    } = req;
    const query = getCollectionQueryParams(collectionSymbol);

    const [markets, daySales] = await Promise.all([
      c
        .aggregate([
          {
            $match: query,
          },
          {
            $group: {
              _id: '$marketplace',
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),
      c
        .aggregate([
          {
            $match: {
              ...query,
              time: { $gte: moment.utc().subtract(1, 'week').toISOString() },
            },
          },
          {
            $project: {
              date: {
                $dateFromString: {
                  dateString: '$time',
                },
              },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%m-%d',
                  date: '$date',
                },
              },
              count: { $count: {} },
            },
          },
        ])
        .toArray(),
    ]);

    const sortedDaySales = orderBy(daySales, '_id', 'asc');

    res.json({
      sales: {
        labels: sortedDaySales.map((day) => day._id),
        series: [sortedDaySales.map((day) => day.count)],
      },
      markets: {
        labels: markets.map((market) => market._id),
        series: markets.map((market) => market.count),
      },
    });
  });

  app.get('/summary/:collectionSymbol', async (req, res) => {
    const c = await db.collection();

    const {
      params: { collectionSymbol },
    } = req;
    const query = getCollectionQueryParams(collectionSymbol);

    const [totalSales, totalUnPaidSales, totalMarketFee, totalPrice] =
      await Promise.all([
        c.count(query),
        c.count({ ...query, royalty_fee: 0 }),
        c
          .aggregate([
            {
              $match: { ...query },
            },
            { $group: { _id: null, totalMarketFee: { $sum: '$market_fee' } } },
          ])
          .toArray(),
        c
          .aggregate([
            {
              $match: { ...query },
            },
            { $group: { _id: null, totalPrice: { $sum: '$price' } } },
          ])
          .toArray(),
      ]);

    res.json({
      totalSales,
      totalPaidSales: totalSales - totalUnPaidSales,
      totalRoyaltyPaid: totalMarketFee[0]?.totalMarketFee ?? 0,
      totalPotentialRoyalty:
        ((totalPrice[0]?.totalPrice ?? 0) * ROYALTY_RATE) / 100,
    });
  });

  return app;
}

function parseNumberQueryParam(s: string, defaultVal: number): number {
  if (s === undefined || s === null) return defaultVal;
  const val = parseInt(s);
  if (isNaN(val)) return defaultVal;
  return val;
}

function getQueryParams(collectionSymbol: string, query: any) {
  const timeFrom = query.from as string;
  const timeTo = query.to as string;
  const paidSales = (query.paid as string) === 'true';

  return {
    collection_symbol: collectionSymbol,
    ...(timeFrom && timeTo
      ? {
          time: {
            $gte: timeFrom,
            $lte: timeTo,
          },
        }
      : timeFrom
      ? { time: { $gte: timeFrom } }
      : timeTo
      ? { time: { $lte: timeTo } }
      : null),
    ...(paidSales
      ? {
          royalty_fee: {
            $gt: 0,
          },
        }
      : null),
  };
}

function getCollectionQueryParams(collectionSymbol: string) {
  return {
    collection_symbol: collectionSymbol,
  };
}
