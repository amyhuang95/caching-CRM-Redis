import { getDBConnection } from '../dbConnector.js';

/**
 * Function to get employee by id from the database
 * @param {number} employee_id the employee id to search for.
 * @returns {Promise<Object>} an employee object
 */
export async function getEmployeeById(employee_id) {
  console.log('[DB] getEmployeeById', employee_id);
  const { client, db } = await getDBConnection();
  const collection = db.collection('Employee');

  try {
    const emp = await collection.findOne({ employee_id });
    return emp;
  } catch (error) {
    console.error('Error fetching employee by id:', error);
    throw error;
  } finally {
    await client.close();
  }
}
