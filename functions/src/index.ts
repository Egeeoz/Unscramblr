import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import words from 'an-array-of-english-words';

admin.initializeApp();
const db = admin.firestore();

export const dailyWord = functions.https.onRequest(async (req, res) => {
  // Enable CORS for all origins
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  try {
    const today = new Date();
    today.setHours(today.getHours() + 1); // Keep your timezone logic
    const todayFormatted = today.toISOString().substring(0, 10);

    // Get total word count
    const dailyWordsSnapshot = await db.collection('dailyWords').get();
    const totalWords = dailyWordsSnapshot.size;

    // Check if today's word exists
    const todayWordDoc = await db
      .collection('dailyWords')
      .doc(todayFormatted)
      .get();

    if (todayWordDoc.exists) {
      const data = todayWordDoc.data();
      res.status(200).json({
        word: data?.word,
        totalWords,
      });
      return;
    }

    // Generate new word (same logic as before)
    const filteredWords = words.filter(
      (word: string) =>
        /^[a-zA-Z]+$/.test(word) && word.length >= 4 && word.length <= 7
    );

    const randomWord =
      filteredWords[Math.floor(Math.random() * filteredWords.length)];

    // Save new word
    await db.collection('dailyWords').doc(todayFormatted).set({
      word: randomWord,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      word: randomWord,
      totalWords: totalWords + 1,
    });
  } catch (error) {
    console.error('Daily word error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
