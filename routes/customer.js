import express from 'express';
import * as db from '../db/index.js';

const router = express.Router();

/**
 * GET all customers based on query
 */
router.get('/customers', async (req, res, next) => {
  const query = req.query.q || '';
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 12;
  const msg = req.query.msg || null;

  try {
    const total = await db.getCustomerCount(query);
    const customers = await db.getCustomerByName(query, page, pageSize);
    const accountManagers = await db.getSalesEmployee();
    const parentAccounts = await db.getCustomerExceptById(0);

    res.render('./pages/customer/index', {
      customers,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total / pageSize),
      accountManagers,
      parentAccounts,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET single customer based on customer id
 */
router.get('/customers/:customer_id/edit', async (req, res, next) => {
  const customer_id = parseInt(req.params.customer_id);
  const msg = req.query.msg || null;
  try {
    const customer = await db.getCustomerById(customer_id);
    const accountManagers = await db.getSalesEmployee();
    const parentAccounts = await db.getCustomerExceptById(customer_id);
    // let customers = await db.getCustomerByOwnerId(employee_id); // get all opptys for this customer

    console.log('customer ', {
      customer,
      // opptys,
      msg,
    });

    res.render('./pages/customer/edit', {
      customer,
      accountManagers,
      parentAccounts,
      // opptys,
      msg,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST request to add a new customer
 */
router.post('/addCustomer', async (req, res, next) => {
  const body = req.body;
  const customer = {
    legal_entity_name: body['legal_entity_name'],
    industry: body['industry'],
    type: body['type'],
    status: 'Pending Review', // default to Pending Review
    date_created: new Date(), // default to today
    address: [
      // only one address section in the page to add new customer
      {
        type: body['addresses[0][type]'],
        line_1: body['addresses[0][line_1]'],
        line_2: body['addresses[0][line_2]'],
        city: body['addresses[0][city]'],
        state: body['addresses[0][state]'],
        country: body['addresses[0][country]'],
      },
    ],
    contact: {
      first_name: body['contact[first_name]'],
      last_name: body['contact[last_name]'],
      phone: body['contact[phone]'],
      email: body['contact[email]'],
      title: body['contact[title]'],
    },
  };

  try {
    // Find relevant parent data
    const parent = await db.getCustomerById(parseInt(body['parent_id']));

    // Add parent sub-document if parent is supplied
    if (parent) {
      customer['parent'] = {
        parent_id: parent.customer_id,
        name: parent.legal_entity_name,
        country: parent.address[0].country,
        type: parent.type,
      };
    }

    // Find relevant owner data
    const owner = await db.getEmployeeById(parseInt(body['owner_id']));

    // Add owner subdocument
    customer['owner'] = {
      owner_id: parseInt(body['owner_id']),
      first_name: owner.first_name,
      last_name: owner.last_name,
      business_unit: owner.business_unit,
      title: owner.title,
    };

    // Add customer to DB
    const addCustomer = await db.addCustomer(customer);
    console.log('Added', addCustomer);
    res.redirect('/customers/?msg=Customer Added');
  } catch (err) {
    console.log('Error adding customer', err);
    next(err);
  }
});

/**
 * POST to update a customer by id
 */
router.post('/customers/:customer_id/edit', async (req, res, next) => {
  const customer_id = parseInt(req.params.customer_id);
  const body = req.body;

  const customer = {
    legal_entity_name: body['legal_entity_name'],
    industry: body['industry'],
    type: body['type'],
    status: body['status'],
    date_created: new Date(body['date_created']),
    address: [
      {
        type: body['addresses[0][type]'],
        line_1: body['addresses[0][line_1]'],
        line_2: body['addresses[0][line_2]'],
        city: body['addresses[0][city]'],
        state: body['addresses[0][state]'],
        country: body['addresses[0][country]'],
      },
      {
        type: body['addresses[1][type]'],
        line_1: body['addresses[1][line_1]'],
        line_2: body['addresses[1][line_2]'],
        city: body['addresses[1][city]'],
        state: body['addresses[1][state]'],
        country: body['addresses[1][country]'],
      },
    ].filter(
      (address) =>
        address.type ||
        address.line_1 !== '' ||
        address.city !== '' ||
        address.state !== '' ||
        address.country !== ''
    ), // Add second address if supplied
    contact: {
      contact_id: parseInt(body['contact[contact_id]']),
      first_name: body['contact[first_name]'],
      last_name: body['contact[last_name]'],
      phone: body['contact[phone]'],
      email: body['contact[email]'],
      title: body['contact[title]'],
    },
  };

  try {
    // Find relevant parent data, then add to customer object
    const parent = await db.getCustomerById(parseInt(body['parent_id']));
    if (parent) {
      customer['parent'] = {
        parent_id: parent.customer_id,
        name: parent.legal_entity_name,
        country: parent.address[0].country,
        type: parent.type,
      };
    }

    // Find relevant owner data, then add to customer object
    const owner = await db.getEmployeeById(parseInt(body['owner_id']));
    customer['owner'] = {
      owner_id: owner.employee_id,
      first_name: owner.first_name,
      last_name: owner.last_name,
      business_unit: owner.business_unit,
      title: owner.title,
    };

    const updateResult = await db.updateCustomerById(customer_id, customer);
    console.log('update', updateResult);

    if (updateResult['acknowledged']) {
      res.redirect('/customers/?msg=Updated');
    } else {
      res.redirect('/customers/?msg=Error Updating');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * GET request to delete a customer by id
 */
router.get('/customers/:customer_id/delete', async (req, res, next) => {
  const customer_id = parseInt(req.params.customer_id);

  try {
    const deleteResult = await db.deleteCustomerById(customer_id);
    console.log('delete', deleteResult);

    if (deleteResult['acknowledged']) {
      res.redirect('/customers/?msg=Deleted');
    } else {
      res.redirect('/customers/?msg=Error Deleting');
    }
  } catch (err) {
    next(err);
  }
});

export { router as customerRouter };
