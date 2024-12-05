import { connectToMongo } from './dbConnector.js';
import { connectToRedis } from './dbConnector.js';
import { Utils } from './utils.js';

// Function to get opportunities of a customer from Redis.
// Return five recently added or viewed opportunities.
async function getOpptyFromCache(customer_id) {
  console.log('[Redis] getOpptyFromCache', customer_id);
  const client = await connectToRedis();
  const key = 'recentOppty:' + customer_id;

  try {
    const opptys = await client.zRange(key, 0, 4, { REV: true });
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
    await client.zAdd(key, [{ value: oppty_id.toString(), score: Date.now() }]);
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
    await client.zRem(key, oppty_id.toString());
    return;
  } catch {
    console.log('Error deleting oppty from Redis', oppty_id);
  } finally {
    await client.quit();
  }
}

// Function to reset cache in Redis
async function cleanCache() {
  const client = await connectToRedis();

  const exists = await client.flushAll();
  console.log('🚿 Cache cleaned', exists);

  await client.quit();
}

// Function to add an opportunity for a customer
async function addOpptyToMongo(oppty) {
  console.log('[Mongo] addOpptyToMongo', oppty.opportunity_id);
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
    const oppty = await collection.findOne({ opportunity_id: oppty_id });

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
      { opportunity_id: oppty.opportunity_id },
      { $set: oppty }
    );

    // Save to cache
    await saveOpptyToCache(oppty.customer_id, oppty.opportunity_id);

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
    const oppty = await collection.findOne({
      opportunity_id: oppty_id,
    });
    const customer_id = oppty.customer_id;
    const result = await collection.deleteOne({
      opportunity_id: oppty_id.toString(),
    });

    // Delete the oppty id from cache
    await deleteOpptyFromCache(customer_id, oppty_id);
    return result;
  } catch (error) {
    console.error('Error deleting opportunity by id:', error);
    throw error;
  } finally {
    await client.close();
  }
}

async function main() {
  await cleanCache();
  const util = new Utils();
  await util.loadSampleCustomers();

  // Create 6 more opptys for each customer in the database, and add to Mongo
  console.log('\n🔅 Generate 6 opportunities for each customer.');
  const customer_ids = await util.getCustomerIds();
  for (const id of customer_ids) {
    console.log('\nAdd oppty for customer ', id);
    for (let i = 0; i < 6; i++) {
      const oppty = await util.generateRandomOppty(id);
      await addOpptyToMongo(oppty);
    }
  }

  // Get recent oppty of the second customer
  const result1_1 = await getOpptyFromCache(customer_ids[0]);
  const result1_2 = await getOpptyFromCache(customer_ids[1]);
  console.log(`➡️ Recent opptys of customer ${customer_ids[0]}: ${result1_1}`);
  console.log(`➡️ Recent opptys of customer ${customer_ids[1]}: ${result1_2}`);

  // View first two opptys of the second customer
  console.log(`\n🔅 View first two opptys of customer: ${customer_ids[1]}`);
  const opptyIds = await util.getOpptyIds(customer_ids[1]);
  const oppty1 = await getOpptyFromMongo(opptyIds[0]);
  const oppty2 = await getOpptyFromMongo(opptyIds[1]);
  const result2 = await getOpptyFromCache(customer_ids[1]);
  console.log(`➡️ Recent opptys of customer ${customer_ids[1]}: ${result2}`);

  // Update the first oppty of the second customer
  console.log(`\n🔅 Modified first oppty for customer: ${customer_ids[1]}`);
  oppty1.stage = 'NA';
  await updateOpptyFromMongo(oppty1);
  const result3 = await getOpptyFromCache(customer_ids[1]);
  console.log(`➡️ Recent opptys of customer ${customer_ids[1]}: ${result3}\n`);

  // Delete opptys of the second customer
  console.log(`\n🔅 Delete 2 opptys for customer: ${customer_ids[1]}`);
  await deleteOpptyFromMongo(opptyIds[0]);
  await deleteOpptyFromMongo(opptyIds[1]);
  const result4 = await getOpptyFromCache(customer_ids[1]);
  console.log(`➡️ Recent opptys of customer ${customer_ids[1]}: ${result4}\n`);
}

main();
