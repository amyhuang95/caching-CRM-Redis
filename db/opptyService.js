import { connectToMongo } from './dbConnector.js';
import { CustomerService } from './customerService.js';
import { connectToRedis } from './dbConnector.js';

// Function to reset cache in Redis
async function cleanCache() {
  const client = await connectToRedis();

  const exists = await client.flushAll();
  console.log('🚿 Cache cleaned', exists);

  await client.quit();
}

// Function to get opportunities of a customer from Redis.
// Return five recently added or viewed opportunities.
async function getOpptyFromCache(customer_id) {}

// Function to save opportunity of a customer to Redis
async function saveOpptyToCache(customer_id, oppty_id) {}

// Function to delete opportunities of a customer from Redis
async function deleteOpptyFromCache(customer_id) {}

// Function to add an opportunity for a customer
async function addOpptyToMongo(oppty) {
  console.log('[Mongo] addOpptyToMongo');
  const { client, db } = await connectToMongo();
  const collection = db.collection('Opportunity');

  // Helper function for getting auto-increment oppty id from last added oppty
  async function generateOpptyId() {
    const prevOppty = await collection
      .find({}, { opportunity_id: 1 })
      .sort({ customer_id: -1 })
      .limit(1)
      .toArray();
    const prev_oppty_id = prevOppty.length > 0 ? prevOppty[0].customer_id : 0;
    return prev_oppty_id + 1;
  }

  try {
    // Set auto-increment oppty id
    oppty.opportunity_id = generateOpptyId();

    // Insert the oppty to DB
    const result = await collection.insertOne(oppty);

    // Save the oppty id to cache for the customer
    await saveOpptyToCache(oppty.customer_id, oppty.opportunity_id);

    return result;
  } catch (err) {
    console.log('Error adding opportunity: ', err);
  } finally {
    await client.close();
  }
}

// Function to view an oppty
async function getOpptyFromMongo(oppty_id) {
  console.log('[Mongo] getOpptyFromMongo', oppty_id);
  const { client, db } = await connectToMongo();
  const collection = db.collection('Opportunity');

  try {
    const oppty = await collection.findOne({ oppty_id });

    // Save the oppty id to cache for the customer
    await saveOpptyToCache(oppty.customer_id, oppty.opportunity_id);

    return oppty;
  } catch (error) {
    console.error('Error fetching customer by id:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Function to update an oppty
async function updateOpptyFromMongo(oppty) {
  console.log('[Mongo] updateOpptyFromMongo', oppty.opportunity_id);
  const { client, db } = await connectToMongo();
  const collection = db.collection('Opportunity');

  try {
    const result = await collection.updateOne(
      { customer_id: customer_id },
      { $set: customer }
    );
    return result;
  } catch (error) {
    console.error('Error updating customer by id:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Function to delete an oppty
async function deleteOpptyFromMongo(oppty_id) {
  console.log('[Mongo] deleteOpptyFromMongo', oppty_id);
  const { client, db } = await connectToMongo();
  const collection = db.collection('Opportunity');

  try {
    const customer = await collection.findOne(oppty_id).toArray();
    const customer_id = customer[0].customer_id;
    const result = await collection.deleteOne({ oppty_id });

    // Delete the oppty id from cache
    await deleteOpptyFromCache(customer_id, oppty_id);
    return result;
  } catch (error) {
    console.error('Error deleting customer by id:', error);
    throw error;
  } finally {
    await client.close();
  }
}

async function main() {
  await cleanCache();

  const customerService = new CustomerService();

  // Customer Ids: 67892, 67894, 67890, 67891, 67893
  const customer_ids = customerService.getCustomerIds();
  for (let id in customer_ids) {
    console.log(id);
  }

  // Create 6 opptys for each customer
  // View some oppty
  // Get most recent oppty of some customers
  // Delete an oppty of a customer
  // Get most recent oppty of that customer
}

main();
