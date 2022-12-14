import { MongoClient } from 'mongodb';

export const client = new MongoClient(process.env.MONGO_URL!);

export async function connect() {
  await client.connect();
}

export function collection() {
  return client.db('iroyalty').collection('sales');
}

export async function teardown() {
  await client.close(true);
}
