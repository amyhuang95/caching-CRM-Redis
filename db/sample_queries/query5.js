import { getDBConnection } from '../dbConnector.js';

/**
 * Get all active employees in Sales department
 */
async function main() {
  const { client, db } = await getDBConnection();
  const collection = db.collection('Employee');
  const query = {
    department: 'Sales',
    status: 'Active',
  };
  try {
    const result = await collection.find(query).toArray();
    for (const employee of result) {
      console.log(employee);
    }
  } catch (error) {
    console.log('Error finding active employees in Sales', error);
  } finally {
    client.close();
  }
}

main();
