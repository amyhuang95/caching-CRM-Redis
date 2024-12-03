import { getDBConnection } from '../dbConnector.js';

/**
 * Function to update an employee by id in the database
 * @param {number} employee_id id of the employee to update
 * @param {Object} employee employee object containing updated details
 * @returns {Promise<Object>} updated employee object
 */
export async function updateEmployeeById(employee_id, employee) {
  console.log('[DB] updateEmployeeById', employee_id, employee);

  const { client, db } = await getDBConnection();
  const collection = db.collection('Employee');

  try {
    const result = await collection.updateOne(
      { employee_id: employee_id },
      { $set: employee }
    );
    return result;
  } catch (error) {
    console.error('Error updating employee by id:', error);
    throw error;
  } finally {
    await client.close();
  }
}
