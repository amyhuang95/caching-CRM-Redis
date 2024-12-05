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
async function getOpptyFromCache(customer_id) {
  console.log('[Redis] getOpptyFromCache', customer_id);
  const client = await connectToRedis();
  const key = 'recentOppty:' + customer_id;

  try {
    opptys = await client.zRange(key, 0, 4, { REV: true });
    return opptys;
  } catch {
    console.log('Error getting oppty from Redis', customer_id);
  } finally {
    await client.quit();
  }
}

// Function to save opportunity of a customer to Redis
async function saveOpptyToCache(customer_id, oppty_id) {
  console.log('[Redis] saveOpptyToCache', customer_id, oppty_id);
  const client = await connectToRedis();
  const key = 'recentOppty:' + customer_id;

  try {
    await client.zAdd(key, [{ value: oppty_id, score: Date.now() }]);
    await client.zRemRangeByRank(key, 0, -6);
    return;
  } catch {
    console.log('Error saving oppty to Redis', oppty_id);
  } finally {
    await client.quit();
  }
}

// Function to delete opportunities of a customer from Redis
async function deleteOpptyFromCache(customer_id, oppty_id) {
  console.log('[Redis] deleteOpptyFromCache', customer_id, oppty_id);
  const client = await connectToRedis();
  const key = 'recentOppty:' + customer_id;

  try {
    await client.zRem(key, oppty_id);
    return;
  } catch {
    console.log('Error saving oppty to Redis', oppty_id);
  } finally {
    await client.quit();
  }
}

// Function to add an opportunity for a customer
async function addOpptyToMongo(oppty) {
  console.log('[Mongo] addOpptyToMongo');
  const { client, db } = await connectToMongo();
  const collection = db.collection('Opportunity');

  try {
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
    const customer = await collection.findOne(oppty_id);
    const customer_id = customer.customer_id;
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

  // Create 6 more opptys for each customer in the database, and add to Mongo
  const customer_ids = customerService.getCustomerIds(); // ids: 67892, 67894, 67890, 67891, 67893
  for (let id in customer_ids) {
    console.log('Add oppty for customer ', id);
    for (let i = 0; i < 6; i++) {
      const oppty = await customerService.generateRandomOppty(id);
      await addOpptyToMongo(oppty);
    }
  }

  // Get recent oppty of the second customer
  const result1 = await getOpptyFromCache(customer_ids[1]);
  console.log(`Recent opptys of customer ${customer_ids[1]}: ${result1}`);

  // View first two opptys of the second customer
  console.log(`View first two opptys of customer ${customer_ids[1]}`);
  const opptyIds = await customerService.getOpptyIds(customer_ids[1]);
  await getOpptyFromMongo(opptyIds[0]);
  await getOpptyFromCache(opptyIds[1]);
  console.log(`Recent opptys of customer ${customer_ids[1]}: ${result1}`);

  // Delete opptys of the second customer
  await deleteOpptyFromMongo(opptyIds[0]);
  await deleteOpptyFromCache(opptyIds[1]);
  console.log(`Recent opptys of customer ${customer_ids[1]}: ${result1}`);
}

main();
