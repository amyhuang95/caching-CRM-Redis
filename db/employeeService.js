import { getDBConnection } from '../dbConnector.js';

export class EmployeeService {
  /**
   * Function to add an employee to the database
   * @param {object} emp employee object to add to the database
   * @returns {Promise<Object>} the result of the insert operation
   */
  async addEmployee(emp) {
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

  /**
   * Function to delete employee by id from the database
   * @param {number} employee_id id of the employee to delete
   * @returns {Promise<Object>} the result of the delete operation
   */
  async deleteEmployeeById(employee_id) {
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

  /**
   * Function to get employee by id from the database
   * @param {number} employee_id the employee id to search for.
   * @returns {Promise<Object>} an employee object
   */
  async getEmployeeById(employee_id) {
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

  /**
   * Function to get employees by name from the database
   * @param {string} query the name query to search for employees.
   * @param {number} page  the page number for pagination.
   * @param {number} pageSize  the number of employees to return per page.
   * @returns {Promise<Array>} an array of employee objects
   */
  async getEmployeeByName(query, page, pageSize) {
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

  /**
   * Function to get the count of employees by name from the database
   * @param {string} query the name query to search for employees.
   * @returns {Promise<number>} number of employees
   */
  async getEmployeeCount(query) {
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

  /**
   * Function to get sales employees from the database
   * @returns {Promise<Array<Object>>} an array of sales employees' id and name
   */
  async getSalesEmployee() {
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

  /**
   * Function to update an employee by id in the database
   * @param {number} employee_id id of the employee to update
   * @param {Object} employee employee object containing updated details
   * @returns {Promise<Object>} updated employee object
   */
  async updateEmployeeById(employee_id, employee) {
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
}
