import { MongoClient } from 'mongodb';
import { createClient } from 'redis';

const MONGO_URL = 'mongodb://localhost:27017';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const client = new MongoClient(MONGO_URL);
const dbName = 'crm';

async function getDBConnection() {
  try {
    await client.connect();
    const db = client.db(dbName);
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to the CRM database:', error);
    throw error;
  }
}

// Function to reset cache in Redis
async function cleanCache() {
  const client = await createClient()
    .on('error', (err) => console.log('Redis Client Error', err))
    .connect();

  const exists = await client.flushAll();
  console.log('🚿 Cache cleaned', exists);

  await client.quit();
}

// Function to get opportunities of a customer from Redis.
// Return five recently added or viewed opportunities.
async function getOpptyFromCache(customer_id) {}

// Function to save opportunity of a customer to Redis
async function saveOpptyToCache(customer_id) {}

// Function to delete opportunities of a customer from Redis
async function deleteOpptyFromCache(customer_id) {}

// Function to add an opportunity for a customer
async function addOpptyToMongo(customer_id) {}

// Function to view an oppty
async function getOpptyFromMongo(oppty_id) {}

// Function to update an oppty
async function updateOpptyFromMongo(oppty_id) {}

// Function to delete an oppty
async function deleteOpptyFromMongo(oppty_id) {}

async function main() {
  await cleanCache();
}

main();
