import { getDBConnection } from '../dbConnector.js';

/**
 * Function to get customers except by id from the database
 * @param {number} customer_id the customer id to exclude
 * @returns {Promise<Array>} array of customers id and legal_entity_name
 */
export async function getCustomerExceptById(customer_id) {
  console.log('[DB] getCustomerExceptById', customer_id);
  const { client, db } = await getDBConnection();
  const collection = db.collection('Customer');

  try {
    const customers = await collection
      .find(
        { customer_id: { $ne: customer_id } },
        { projection: { customer_id: 1, legal_entity_name: 1 } }
      )
      .toArray();
    return customers;
  } catch (error) {
    console.error('Error fetching customers except by id:', error);
    throw error;
  } finally {
    await client.close();
  }
}
