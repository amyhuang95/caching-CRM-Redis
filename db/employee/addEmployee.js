import { getDBConnection } from '../dbConnector.js';

/**
 * Function to add an employee to the database
 * @param {object} emp employee object to add to the database
 * @returns {Promise<Object>} the result of the insert operation
 */
export async function addEmployee(emp) {
  console.log('[DB] addEmployee', emp);
  const { client, db } = await getDBConnection();
  const collection = db.collection('Employee');

  try {
    // Set up auto-increment employee id
    const prevEmp = await collection
      .find({}, { employee_id: 1 })
      .sort({ employee_id: -1 })
      .limit(1)
      .toArray();
    const prevEmpId = prevEmp.length > 0 ? prevEmp[0].employee_id : 0;
    emp.employee_id = prevEmpId + 1;

    const result = await collection.insertOne(emp);
    return result;
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  } finally {
    client.close();
  }
}
