import bcrypt from 'bcryptjs';
import { ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { sendResponse, sendError } from '../../responses/index.js';
import { db } from '../../services/db.js';

export const handler = async (event) => {
  const { username, email, password } = JSON.parse(event.body);

  if (!username || !email || !password) {
    return sendError(400, 'Missing username, email or password');
  }

  try {
    const scanParams = {
      TableName: 'Users',
      FilterExpression: '#email = :email',
      ExpressionAttributeNames: {
        '#email': 'email',
      },
      ExpressionAttributeValues: {
        ':email': email,
      },
    };

    const scanCommand = new ScanCommand(scanParams);
    const result = await db.send(scanCommand);

    if (result.Items && result.Items.length > 0) {
      return sendError(400, 'Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const putParams = {
      TableName: 'Users',
      Item: {
        id: userId,
        email: email,
        username: username,
        password: hashedPassword,
      },
    };

    const putCommand = new PutCommand(putParams);
    await db.send(putCommand);

    return sendResponse('User successfully created');
  } catch (error) {
    console.error(error);
    return sendError(500, 'Internal server error');
  }
};
