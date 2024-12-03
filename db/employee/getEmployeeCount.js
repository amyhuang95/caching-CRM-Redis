import { getDBConnection } from '../dbConnector.js';

/**
 * Function to get the count of employees by name from the database
 * @param {string} query the name query to search for employees.
 * @returns {Promise<number>} number of employees
 */
export async function getEmployeeCount(query) {
  console.log('[DB] getEmployeeCount', query);
  const { client, db } = await getDBConnection();
  const collection = db.collection('Employee');

  try {
    const regexQuery = new RegExp(`^${query}`, 'i'); // case-insensitive search
    const employees = await collection.countDocuments({
      $or: [{ first_name: regexQuery }, { last_name: regexQuery }],
    });

    return employees;
  } catch (error) {
    console.error('Error fetching employees by name:', error);
    throw error;
  } finally {
    await client.close();
  }
}
