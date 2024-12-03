import { getDBConnection } from '../dbConnector.js';

/**
 * Find the number of screening records with Finance issue.
 */
async function main() {
  const { client, db } = await getDBConnection();
  const collection = db.collection('Screening_Record');
  const query = { issue_type: 'Finance' };
  try {
    const result = await collection.countDocuments(query);
    console.log('Number of screening records with Finance issue:', result);
  } catch (error) {
    console.error(
      'Error finding number of screening records with Finance issue',
      error
    );
  } finally {
    client.close();
  }
}

main();
