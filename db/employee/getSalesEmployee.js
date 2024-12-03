import { getDBConnection } from '../dbConnector.js';

/**
 * Function to get sales employees from the database
 * @returns {Promise<Array<Object>>} an array of sales employees' id and name
 */
export async function getSalesEmployee() {
  console.log('[DB] getSalesEmployee');
  const { client, db } = await getDBConnection();
  const collection = db.collection('Employee');

  try {
    const regexQuery = new RegExp(`^sales`, 'i'); // case-insensitive search
    const projection = { first_name: 1, last_name: 1, employee_id: 1 };
    const employees = await collection
      .find(
        {
          $or: [{ department: regexQuery }, { title: regexQuery }],
          employee_id: { $ne: 0 },
        },
        projection
      )
      .toArray();
    return employees;
  } catch (error) {
    console.error('Error fetching Sales employees:', error);
    throw error;
  } finally {
    await client.close();
  }
}
