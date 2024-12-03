import { getDBConnection } from '../dbConnector.js';

/**
 * Function to add an customer to the database
 * @param {object} customer customer object to add to the database
 * @returns {Promise<Object>} the result of the insert operation
 */
export async function addCustomer(customer) {
  console.log('[DB] addCustomer', customer);
  const { client, db } = await getDBConnection();
  const collection = db.collection('Customer');

  try {
    // Auto increment customer and contact id from last added customer
    const prevCustomer = await collection
      .find({}, { customer_id: 1, contact_id: 1 })
      .sort({ customer_id: -1 })
      .limit(1)
      .toArray();

    // Get ids of previous customer and contact
    const prevCustId =
      prevCustomer.length > 0 ? prevCustomer[0].customer_id : 0;
    const prevContId =
      prevCustomer.length > 0 ? prevCustomer[0].contact.contact_id : 0;

    // increment the ids
    customer.customer_id = prevCustId + 1;
    customer.contact.contact_id = prevContId + 1;

    const result = await collection.insertOne(customer);
    return result;
  } catch (err) {
    console.log('Error adding customer: ', err);
  } finally {
    await client.close();
  }
}
