import { MongoClient } from 'mongodb';

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

// Function to get opportunities of a customer from Redis.
// Return five recently added or viewed opportunities.
async function getOpptyFromCache(customer_id) {}

// Function to save opportunity of a customer to Redis
async function saveOpptyToCache(customer_id) {}

// Function to delete opportunities of a customer from Redis
async function deleteOpptyFromCache(customer_id) {}
