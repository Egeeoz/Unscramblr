import { sendError, sendResponse } from '../../responses/index.js';
import { ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';
import { db } from '../../services/db.js';

export const handler = async (event) => {
  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return sendError(400, 'Email or Password missing');
  }

  try {
    const scanParams = {
      TableName: 'Users',
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    };

    const scanCommand = new ScanCommand(scanParams);
    const result = await db.send(scanCommand);

    if (!result.Items.length) {
      return sendError(404, 'Invalid email adress');
    }

    const user = result.Items[0];
    const hashedPassword = user.password;

    const checkPassword = await bcrypt.compare(password, hashedPassword);

    if (!checkPassword) {
      return sendError(401, 'Invalid password');
    }

    return sendResponse(user);
  } catch (error) {
    console.error(error);
    return sendError(500, 'Internal server error');
  }
};
