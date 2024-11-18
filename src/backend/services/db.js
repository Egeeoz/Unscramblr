const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

if (!process.env.AWS_REGION) {
  throw new Error('AWS_REGION environment variable is not set.');
}

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const db = DynamoDBDocumentClient.from(dynamoDBClient);

module.exports = { db };
