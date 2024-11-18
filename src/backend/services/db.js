import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

if (!process.env.AWS_REGION) {
  throw new Error('AWS_REGION environment variable is not set.');
}

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

export const db = DynamoDBDocumentClient.from(dynamoDBClient);
