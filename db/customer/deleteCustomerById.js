import { getDBConnection } from '../dbConnector.js';

/**
 * Function to delete customer by id from the database
 * @param {number} customer_id id of the customer to delete
 * @returns {Promise<Object>} the result of the delete operation
 */
export async function deleteCustomerById(customer_id) {
  console.log('[DB] deleteCustomerById', customer_id);
  const { client, db } = await getDBConnection();
  const collection = db.collection('Customer');

  try {
    const result = await collection.deleteOne({ customer_id });
    return result;
  } catch (error) {
    console.error('Error deleting customer by id:', error);
    throw error;
  } finally {
    await client.close();
  }
}
