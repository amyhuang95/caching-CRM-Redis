import { getDBConnection } from '../dbConnector.js';

/**
 * Function to get customer by id from the database
 * @param {number} customer_id the customer id to search for.
 * @returns {Promise<Object>} an customer object
 */
export async function getCustomerById(customer_id) {
  console.log('[DB] getCustomerById', customer_id);
  const { client, db } = await getDBConnection();
  const collection = db.collection('Customer');
  try {
    const result = await collection.findOne({ customer_id });
    return result;
  } catch (error) {
    console.error('Error fetching customer by id:', error);
    throw error;
  } finally {
    await client.close();
  }
}
