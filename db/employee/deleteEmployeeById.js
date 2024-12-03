import { getDBConnection } from '../dbConnector.js';

/**
 * Function to delete employee by id from the database
 * @param {number} employee_id id of the employee to delete
 * @returns {Promise<Object>} the result of the delete operation
 */
export async function deleteEmployeeById(employee_id) {
  console.log('[DB] deleteEmployeeById', employee_id);
  const { client, db } = await getDBConnection();
  const collection = db.collection('Employee');

  try {
    const result = collection.deleteOne({ employee_id });
    return result;
  } catch (error) {
    console.error('Error deleting employee by id:', error);
    throw error;
  } finally {
    client.close();
  }
}
