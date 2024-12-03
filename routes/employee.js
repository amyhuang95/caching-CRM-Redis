import express from 'express';
import * as db from '../db/index.js';

const router = express.Router();

/**
 * GET all employees page based on query
 */
router.get('/employees', async (req, res, next) => {
  const query = req.query.q || '';
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 12;
  const msg = req.query.msg || null;

  try {
    const total = await db.getEmployeeCount(query);
    const employees = await db.getEmployeeByName(query, page, pageSize);
    res.render('./pages/employee/index', {
      employees,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET single employee based on employee id
 */
router.get('/employees/:employee_id/edit', async (req, res, next) => {
  const employee_id = parseInt(req.params.employee_id);
  const msg = req.query.msg || null;
  try {
    let emp = await db.getEmployeeById(employee_id);
    let customers = await db.getCustomerByOwnerId(employee_id);

    console.log('employee ', {
      emp,
      customers,
      msg,
    });

    res.render('./pages/employee/edit', {
      emp,
      customers,
      msg,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST request to add an employee
 */
router.post('/addEmployee', async (req, res, next) => {
  const body = req.body;

  const emp = {
    first_name: body['first_name'],
    last_name: body['last_name'],
    phone: body['phone'],
    email: body['email'],
    title: body['title'],
    department: body['department'],
    business_unit: body['business_unit'],
    date_hired: new Date(), // default to today
    status: 'Active', // default status at creation
  };

  try {
    const addEmp = await db.addEmployee(emp);

    console.log('Added', addEmp);
    res.redirect(`/employees/?msg=Added ${emp.first_name} ${emp.last_name}`);
  } catch (err) {
    console.log('Error adding employee', err);
    next(err);
  }
});

/**
 * POST to update an employee by id
 */
router.post('/employees/:employee_id/edit', async (req, res, next) => {
  const employee_id = parseInt(req.params.employee_id);
  const body = req.body;
  const emp = {
    first_name: body['first_name'],
    last_name: body['last_name'],
    phone: body['phone'],
    email: body['email'],
    title: body['title'],
    department: body['department'],
    business_unit: body['business_unit'],
    date_hired: new Date(body['date_hired']),
    status: body['status'],
  };

  try {
    const updateResult = await db.updateEmployeeById(employee_id, emp);
    console.log('update', updateResult);

    if (updateResult['acknowledged']) {
      res.redirect(
        `/employees/?msg=Updated ${emp.first_name} ${emp.last_name}`
      );
    } else {
      res.redirect('/employees/?msg=Error Updating');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * GET request to delete an employee by id
 */
router.get('/employees/:employee_id/delete', async (req, res, next) => {
  const employee_id = parseInt(req.params.employee_id);

  try {
    // If the emplyee manages customers, update the owner_id to 0 for all its customers
    const customers = await db.getCustomerByOwnerId(employee_id);
    const placeholderEmp = await db.getEmployeeById(0);
    if (customers.length !== 0) {
      for (let customer of customers) {
        let updateCustomer = {};
        updateCustomer.owner = {
          owner_id: placeholderEmp.employee_id,
          first_name: placeholderEmp.first_name,
          last_name: placeholderEmp.last_name,
          business_unit: placeholderEmp.business_unit,
          title: placeholderEmp.title,
        };

        await db.updateCustomerById(customer.customer_id, updateCustomer);
        console.log(
          'Updated owner_id to 0 for customers:',
          customer.customer_id
        );
      }
    }

    const deleteResult = await db.deleteEmployeeById(employee_id);
    console.log('delete', deleteResult);

    if (deleteResult['acknowledged']) {
      res.redirect(`/employees/?msg=Deleted employee ID ${employee_id}`);
    } else {
      res.redirect('/employees/?msg=Error Deleting');
    }
  } catch (err) {
    next(err);
  }
});

export { router as employeeRouter };
