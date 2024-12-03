import { getDBConnection } from '../dbConnector.js';

/**
 * Function to get the count of customers by name from the database
 * @param {string} query the name query to search for customers.
 * @returns {Promise<number>} number of customers
 */
export async function getCustomerCount(query) {
  console.log('[DB] getCustomerCount', query);
  const { client, db } = await getDBConnection();
  const collection = db.collection('Customer');

  try {
    const regexQuery = new RegExp(`^${query}`, 'i'); // case-insensitive search
    const customers = await collection.countDocuments({
      legal_entity_name: regexQuery,
    });

    return customers;
  } catch (error) {
    console.error('Error fetching customer count:', error);
    throw error;
  } finally {
    await client.close();
  }
}
