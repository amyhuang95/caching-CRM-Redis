import { getDBConnection } from '../dbConnector.js';

/**
 * Function to get customers by name from the database
 * @param {string} query the name query to search for customers.
 * @param {number} page  the page number for pagination.
 * @param {number} pageSize  the number of customers to return per page.
 * @returns {Promise<Array>} an array of customer objects
 */
export async function getCustomerByName(query, page, pageSize) {
  console.log('[DB] getCustomerByName', query);
  const { client, db } = await getDBConnection();
  const collection = db.collection('Customer');

  try {
    const regexQuery = new RegExp(`^${query}`, 'i'); // case-insensitive search
    const customers = await collection
      .find({ legal_entity_name: regexQuery })
      .sort({ _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return customers;
  } catch (error) {
    console.error('Error fetching customers by name:', error);
    throw error;
  } finally {
    await client.close();
  }
}
