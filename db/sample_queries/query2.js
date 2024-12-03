import { getDBConnection } from '../dbConnector.js';

/**
 * Find active customers whose parent company is in the database.
 */
async function main() {
  const { client, db } = await getDBConnection();
  const collection = db.collection('Customer');
  const query = {
    $and: [
      {
        parent: {
          $exists: true,
        },
      },
      {
        status: 'Active',
      },
    ],
  };
  const option = {
    projection: {
      customer: '$legal_entity_name',
      type: 1,
      status: 1,
      parent_company: '$parent.name',
      _id: 0,
    },
  };

  try {
    const result = await collection.find(query, option).toArray();
    console.log('Active customers with parent company:');
    for (const doc of result) {
      console.log(doc);
    }
  } catch (error) {
    console.error('Error finding active customers with parent company:', error);
  } finally {
    client.close();
  }
}

main();
