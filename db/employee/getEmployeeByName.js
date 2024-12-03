import { getDBConnection } from '../dbConnector.js';

/**
 * Function to get employees by name from the database
 * @param {string} query the name query to search for employees.
 * @param {number} page  the page number for pagination.
 * @param {number} pageSize  the number of employees to return per page.
 * @returns {Promise<Array>} an array of employee objects
 */
export async function getEmployeeByName(query, page, pageSize) {
  console.log('[DB] getEmployeeByName', query);
  const { client, db } = await getDBConnection();
  const collection = db.collection('Employee');

  try {
    const regexQuery = new RegExp(`^${query}`, 'i'); // case-insensitive search
    const employees = await collection
      .find({ $or: [{ first_name: regexQuery }, { last_name: regexQuery }] })
      .sort({ _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return employees;
  } catch (error) {
    console.error('Error fetching employees by name:', error);
    throw error;
  } finally {
    await client.close();
  }
}
