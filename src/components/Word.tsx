import { useState, useEffect } from 'react';
import '../styling/components/Word.css';
import {
  pickRandomWord,
  scrambleWord,
  getDailyWord,
  validateGuess,
} from '../helper/GameLogic';

const Word = () => {
  const [words, setWords] = useState<string[]>(() => {
    const storedWords = localStorage.getItem('englishWords');
    return storedWords ? JSON.parse(storedWords) : [];
  });

  const [randomWord, setRandomWord] = useState<string>(() => {
    return localStorage.getItem('dailyWord') || '';
  });

  const [scrambledWord, setScrambledWord] = useState<string>(() => {
    return localStorage.getItem('scrambledWord') || '';
  });
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<boolean>(true);
  // const [mode, SetMode] = useState<'Daily' | 'Unlimited'>('Daily');

  useEffect(() => {
    if (words.length > 0) return;

    const fetchWords = async () => {
      {
        try {
          const response = await fetch('/words.txt');
          const text = await response.text();
          const fetchedWords = text
            .split('\n') // Split the file content into lines.
            .map((word: string) => word.trim()) // Remove whitespace around each word.
            .filter((word: string) => word && !word.includes('-')); // Exclude empty lines and words with '-'.

          setWords(fetchedWords);
          localStorage.setItem('englishWords', JSON.stringify(fetchedWords));
        } catch (error) {
          console.error('Failed to fetch words:', error);
        }
      }
    };

    fetchWords();
  }, [words.length]);

  useEffect(() => {
    if (words.length === 0 || randomWord) return;

    const dailyWord = getDailyWord(words);
    setRandomWord(dailyWord);
    const scrambled = scrambleWord(dailyWord);
    setScrambledWord(scrambled);

    localStorage.setItem('dailyWord', dailyWord);
    localStorage.setItem('scrambledWord', scrambled);
  }, [words]);

  const handleGuess = () => {
    if (!gameStatus) return;
    const input = document.querySelector('.guess-input') as HTMLInputElement;
    const value = input.value.trim();
    if (!value) return;

    if (guesses.length >= 5) {
      alert('Sorry, You have lost');
      setGameStatus(false);
      return;
    }

    const isCorrect = validateGuess(value, randomWord);

    if (isCorrect) {
      alert('You guessed right! Congratulations!');
      setGameStatus(false);
    } else if (guesses.length === 4) {
      alert(
        `You have used all your guesses. The correct word was: ${randomWord}`
      );
      setScrambledWord(randomWord);
      setGameStatus(false);
    }

    const updatedGuesses = [...guesses, value];
    setGuesses(updatedGuesses);
    localStorage.setItem('guessedWords', JSON.stringify(updatedGuesses));

    input.value = '';
  };

  return (
    <>
      <section className="scrambled-container">
        <p className="scrambled-word">
          {scrambledWord || 'Click to get random word'}
        </p>
      </section>
      <section className="guess-input-section">
        <input type="text" className="guess-input" />
        <button className="guess-button" onClick={handleGuess}>
          Guess
        </button>
      </section>
      <section className="guesses-section">
        <h3>Guesses</h3>
        <ul>
          {guesses.map((guess, index) => (
            <li key={index}>{guess}</li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Word;
