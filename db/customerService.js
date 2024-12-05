import { connectToMongo } from './dbConnector.js';
import { CustomerService } from './customerService.js';
import { connectToRedis } from './dbConnector.js';
/**
 * Class to interact with customers data
 */
export class CustomerService {
  // Get a list of customer Ids
  async getCustomerIds() {
    console.log('[Mongo] getCustomerIds');
    const { client, db } = await getDBConnection();
    const collection = db.collection('Customer');

    try {
      // Get customer ids and turn into array
      const customers = await collection
        .find({}, { customer_id: 1, _id: 0 })
        .sort({ customer_id: -1 })
        .toArray();

      return customers;
    } catch (err) {
      console.log('Error getting customer ids: ', err);
    } finally {
      await client.close();
    }
  }

  // Get a list of oppty ids of a customer
  async getOpptyIds(customer_id) {
    console.log('[Mongo] getOpptyIds', customer_id);
    const { client, db } = await getDBConnection();
    const collection = db.collection('Opportunity');

    try {
      // Get customer ids and turn into array
      const opportunities = await collection
        .find({ customer_id }, { opportunity_id: 1 })
        .sort({ opportunity_id: 1 })
        .toArray();

      return opportunities;
    } catch (err) {
      console.log('Error getting opportunity ids: ', err);
    } finally {
      await client.close();
    }
  }

  // Generate random oppty for a customer
  async generateRandomOppty(customer_id) {
    const { client, db } = await connectToMongo();
    const collection = db.collection('Opportunity');

    // Helper function to generate a random project name
    function getRandomName() {
      const name_list = [
        'Quantum Leap',
        'Horizon Initiative',
        'Phoenix Rising',
        'Nexus Venture',
        'Titan Project',
        'Aurora Mission',
        'Odyssey Quest',
        'Zenith Enterprise',
        'Eclipse Strategy',
        'Vanguard Operation',
        'Polaris Initiative',
        'Atlas Program',
        'Helix Development',
        'Infinity Loop',
        'Nebula Project',
        'Genesis Plan',
        'Equinox Strategy',
        'Horizon Quest',
        'Apex Mission',
        'Catalyst Venture',
      ];

      return name_list[Math.floor(Math.random() * name_list.length)];
    }

    // Helper function to generate a random stage
    function getRandomStage() {
      const stage_list = [
        'Create',
        'Develop',
        'Propose',
        'Close-Won',
        'Close-Lost',
      ];
      return stage_list[Math.floor(Math.random() * stage_list.length)];
    }

    // Helper function to generate a random date
    function getRandomDate() {
      let start = new Date('2000-01-01');
      let end = new Date('2023-12-31');
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
    }

    // Helper function for getting auto-increment oppty id from last added oppty
    async function generateOpptyId() {
      const prevOppty = await collection
        .find({}, { opportunity_id: 1 })
        .sort({ customer_id: -1 })
        .limit(1)
        .toArray();
      const prev_oppty_id = prevOppty.length > 0 ? prevOppty[0].customer_id : 0;
      return prev_oppty_id + 1;
    }

    try {
      const oppty_id = await generateOpptyId();
      const opportunity = {
        opportunity_id: oppty_id,
        customer_id: customer_id,
        name: getRandomName(),
        start_date: getRandomDate(),
        close_date: getRandomDate(),
        stage: getRandomStage(),
        est_revenue: Math.floor(Math.random() * 10001),
        date_created: getRandomDate(),
        owner: {
          owner_id: 54321,
          first_name: 'Sam',
          last_name: 'Seo',
          business_unit: 'Cloud',
          title: 'Sales Manager',
        },
        quotes: [],
      };
      return opportunity;
    } catch {
      console.log('Error generating auto-increment oppty id');
    } finally {
      await client.close();
    }
  }

  /**
   * Function to add an customer to the database
   * @param {object} customer customer object to add to the database
   * @returns {Promise<Object>} the result of the insert operation
   */
  async addCustomer(customer) {
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

  /**
   * Function to delete customer by id from the database
   * @param {number} customer_id id of the customer to delete
   * @returns {Promise<Object>} the result of the delete operation
   */
  async deleteCustomerById(customer_id) {
    console.log('[DB] deleteCustomerById', customer_id);
    const { client, db } = await getDBConnection();
    const collection = db.collection('Customer');

    try {
      const result = await collection.deleteOne({ customer_id });
      return result;
    } catch (error) {
      console.error('Error deleting customer by id:', error);
      throw error;
    } finally {
      await client.close();
    }
  }

  /**
   * Function to get customer by id from the database
   * @param {number} customer_id the customer id to search for.
   * @returns {Promise<Object>} an customer object
   */
  async getCustomerById(customer_id) {
    console.log('[DB] getCustomerById', customer_id);
    const { client, db } = await getDBConnection();
    const collection = db.collection('Customer');
    try {
      const result = await collection.findOne({ customer_id });
      return result;
    } catch (error) {
      console.error('Error fetching customer by id:', error);
      throw error;
    } finally {
      await client.close();
    }
  }
}
