import { MongoClient } from 'mongodb';
import { createClient } from 'redis';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'crm';

export async function connectToMongo() {
  try {
    await client.connect();
    const db = client.db(dbName);
    return { client, db };
  } catch (error) {
    console.error('Mongo connection error:', error);
    throw error;
  }
}

export async function connectToRedis() {
  const client = createClient();
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
  return client;
}
