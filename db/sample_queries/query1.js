import { getDBConnection } from '../dbConnector.js';

/**
 * Find the total revenue of open opportunities (stage is in either Create,
 * Develop, or Propose) by the owner's business unit
 */
async function main() {
  const { client, db } = await getDBConnection();
  const collection = db.collection('Opportunity');
  const pipeline = [
    // Find open opportunities
    {
      $match: {
        stage: {
          $in: ['Create', 'Develop', 'Propose'],
        },
      },
    },
    // Group by owner's business unit
    {
      $group: {
        _id: '$owner.business_unit',
        total_est_revenue: {
          $sum: '$est_revenue',
        },
      },
    },
    // Display only business unit and total estimated revenue
    {
      $project: {
        business_unit: '$_id',
        total_est_revenue: 1,
        _id: 0,
      },
    },
  ];
  try {
    const result = await collection.aggregate(pipeline).toArray();
    console.log(
      "Total revenue of open opportunities by owner's business unit:"
    );
    for (const doc of result) {
      console.log(
        'Business Unit:',
        doc.business_unit,
        'Total Est. Revenue:',
        doc.total_est_revenue
      );
    }
  } catch (error) {
    console.log('Error finding total revenue of open opportunities:', error);
  } finally {
    client.close();
  }
}

main();
