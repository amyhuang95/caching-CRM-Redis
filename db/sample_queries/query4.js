import { getDBConnection } from '../dbConnector.js';

/**
 * Update lead status to 'Qualified' for leads whose probability is no less than 80%.
 */
async function main() {
  const { db, client } = await getDBConnection();
  const collection = db.collection('Lead');
  const query = { probability: { $gte: 0.8 } };
  const update = { $set: { status: 'Qualified' } };
  const options = { multi: true };
  try {
    const result = await collection.updateMany(query, update, options);
    console.log(result.modifiedCount, 'documents updated');
  } catch (error) {
    console.log('Error updating documents:', error);
  } finally {
    client.close();
  }
}

main();
