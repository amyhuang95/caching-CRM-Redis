import { getDBConnection } from '../dbConnector.js';

/**
 * Function to update an customer by id in the database
 * @param {number} customer_id id of the customer to update
 * @param {Object} customer customer object containing updated details
 * @returns {Promise<Object>} updated customer object
 */
export async function updateCustomerById(customer_id, customer) {
  console.log('[DB] updateCustomerById', customer_id, customer);
  const { client, db } = await getDBConnection();
  const collection = db.collection('Customer');

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
