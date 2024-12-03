import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
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

export { getDBConnection };
