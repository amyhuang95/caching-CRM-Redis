import { getDBConnection } from '../dbConnector.js';

/**
 * Function to get a list of customers by owner id
 * @param {int} owner_id the owner id of the customer
 * @returns {Promise<Array>} a list of customers
 */
export async function getCustomerByOwnerId(owner_id) {
  const { client, db } = await getDBConnection();
  const collection = db.collection('Customer');

  try {
    const result = await collection
      .find({ 'owner.owner_id': owner_id })
      .toArray();
    return result;
  } catch (error) {
    console.error('Error fetching customer by employee id:', error);
    throw error;
  } finally {
    await client.close();
  }
}
