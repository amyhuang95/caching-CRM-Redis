import { connectToMongo } from './dbConnector.js';
/**
 * Class to interact with customers data
 */
export class Utils {
  // Load sample customers to MongoDB
  async loadSampleCustomers() {
    console.log('[Mongo] loadSampleCustomers');
    const { client, db } = await connectToMongo();
    const collection = db.collection('Customer');

    try {
      const customers = [
        {
          customer_id: 12358,
          legal_entity_name: 'Gen AI Tech',
          industry: 'AI',
          type: 'Direct Customer',
          status: 'Pending Review',
          date_created: {
            $date: '2024-10-27T00:00:00.000Z',
          },
          address: [
            {
              type: 'Headquarters',
              line_1: '456 St',
              line_2: '',
              city: 'Oakland',
              state: 'CA',
              country: 'United States',
            },
          ],
          contact: {
            contact_id: 2,
            first_name: 'Jess',
            last_name: 'Lam',
            phone: '12345678',
            email: 'jess.l@example.com',
            title: 'Project Manager',
          },
          parent: {
            parent_id: 12349,
            name: 'Epsilon Tech',
            country: 'USA',
            type: 'Direct Customer',
          },
          owner: {
            owner_id: 2,
            first_name: 'Bob',
            last_name: 'Johnson',
            business_unit: 'AI',
            title: 'Sales Director',
          },
        },
        {
          customer_id: 12359,
          legal_entity_name: 'G Doc Innovation',
          industry: 'AI',
          type: 'Ecosystem Partner',
          status: 'Pending Review',
          date_created: {
            $date: '2024-10-30T00:00:00.000Z',
          },
          address: [
            {
              type: 'Headquarters',
              line_1: '987 St',
              line_2: '',
              city: 'Redwood City',
              state: 'CA',
              country: 'USA',
            },
          ],
          contact: {
            contact_id: 3,
            first_name: 'Sam',
            last_name: 'White',
            phone: '345678123',
            email: 'sam.w@example.com',
            title: 'Manager',
          },
          owner: {
            owner_id: 1,
            first_name: 'Alice',
            last_name: 'Smith',
            business_unit: 'Cloud',
            title: 'Sales Manager',
          },
        },
      ];
      // Get customer ids and turn into array
      await collection.insertMany(customers);
    } catch (err) {
      console.log('Error generating sample customers', err);
    } finally {
      await client.close();
    }
  }

  // Get a list of customer Ids
  async getCustomerIds() {
    console.log('[Mongo] getCustomerIds');
    const { client, db } = await connectToMongo();
    const collection = db.collection('Customer');

    try {
      // Get customer ids and turn into array
      const customers = await collection
        .find({}, { customer_id: 1, _id: 0 })
        .sort({ customer_id: -1 })
        .toArray();
      const customerIds = customers.map((customer) => customer.customer_id);
      return customerIds;
    } catch (err) {
      console.log('Error getting customer ids: ', err);
    } finally {
      await client.close();
    }
  }

  // Get a list of oppty ids of a customer
  async getOpptyIds(customer_id) {
    console.log('[Mongo] getOpptyIds', customer_id);
    const { client, db } = await connectToMongo();
    const collection = db.collection('Opportunity');

    try {
      // Get customer ids and turn into array
      const opportunities = await collection
        .find({ customer_id }, { opportunity_id: 1 })
        .sort({ opportunity_id: 1 })
        .toArray();

      const opptyIds = opportunities.map((oppty) => oppty.opportunity_id);
      return opptyIds;
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
        .sort({ opportunity_id: -1 })
        .limit(1)
        .toArray();
      const prev_oppty_id =
        prevOppty.length > 0 ? prevOppty[0].opportunity_id : 0;
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
}
