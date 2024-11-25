import { sendError, sendResponse } from '../../responses/index.js';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../services/db.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORDS_FILE = path.resolve(__dirname, '../../../../public/words.txt');

export const handler = async (event) => {
  const today = new Date().toISOString().split('T')[0];

  try {
    const getParams = {
      TableName: 'DailyWord',
      Key: { date: today },
    };

    const getCommand = new GetCommand(getParams);
    const result = await db.send(getCommand);

    if (result.Item) {
      return sendResponse({ word: result.Item.word });
    }
  } catch (error) {
    console.error('Error checking for daily word in DynamoDB:', error);
    sendError(500, 'Internal server error');
  }

  let words;
  try {
    const fileContens = fs.readFileSync(WORDS_FILE, 'utf-8');
    words = fileContens
      .split('\n')
      .map((word) => word.trim())
      .filter(
        (word) =>
          /^[a-zA-Z]+$/.test(word) && word.length >= 4 && word.length <= 7
      );
  } catch (error) {
    console.error('Error reading or processing words file:', error);
    return sendError(500, 'Internal server error (read and filter words)');
  }

  const randomWord = words[Math.floor(Math.random() * words.length)];

  try {
    const putParams = {
      TableName: 'DailyWord',
      Item: { date: today, word: randomWord },
    };

    const putCommand = new PutCommand(putParams);
    await db.send(putCommand);
  } catch (error) {
    console.error('Error storing daily word in DynamoDB:', error);
    return sendError(500, 'Internal server error (Store word in db)');
  }

  return sendResponse({ word: randomWord });
};
