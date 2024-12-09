import { sendError, sendResponse } from '../../responses/index.js';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../services/db.js';
import words from 'an-array-of-english-words' assert { type: 'json' };

export const handler = async () => {
  const todayFormatted = new Date(Date.now() + 3600000)
    .toISOString()
    .substring(0, 10);

  try {
    const getParams = {
      TableName: 'DailyWord',
      Key: { date: todayFormatted },
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

  const filteredWords = words.filter(
    (word) => /^[a-zA-Z]+$/.test(word) && word.length >= 4 && word.length <= 7
  );

  const randomWord =
    filteredWords[Math.floor(Math.random() * filteredWords.length)];

  try {
    const putParams = {
      TableName: 'DailyWord',
      Item: { date: todayFormatted, word: randomWord },
    };

    const putCommand = new PutCommand(putParams);
    await db.send(putCommand);
  } catch (error) {
    console.error('Error storing daily word in DynamoDB:', error);
    return sendError(500, 'Internal server error (Store word in db)');
  }

  return sendResponse({ word: randomWord });
};
