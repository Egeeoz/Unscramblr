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
  const [guesses, setGuesses] = useState<string[]>(() => {
    const storedGuesses = localStorage.getItem('guessedWords');
    return storedGuesses ? JSON.parse(storedGuesses) : [];
  });
  const [gameStatus, setGameStatus] = useState<boolean>(false);

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

    const { word, gameStatus: newGameStatus } = getDailyWord(words);

    setGameStatus(newGameStatus);

    setRandomWord(word);
    const scrambled = scrambleWord(word);
    setScrambledWord(scrambled);

    localStorage.setItem('dailyWord', word);
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
      setScrambledWord(randomWord);
      localStorage.setItem('scrambledWord', randomWord);
    } else if (guesses.length === 4) {
      alert(
        `You have used all your guesses. The correct word was: ${randomWord}`
      );
      setGameStatus(false);
      setScrambledWord(randomWord);
      localStorage.setItem('scrambledWord', randomWord);
    }

    const updatedGuesses = [...guesses, value];
    setGuesses(updatedGuesses);
    localStorage.setItem('guessedWords', JSON.stringify(updatedGuesses));

    input.value = '';
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGuess();
    }
  };

  return (
    <>
      <section className="scrambled-container">
        <p className="scrambled-word">
          {scrambledWord || 'Click to get random word'}
        </p>
      </section>
      <section className="guess-input-section">
        <input type="text" className="guess-input" onKeyDown={handleKeyDown} />
        <button className="guess-button" onClick={handleGuess}>
          Guess
        </button>
      </section>
      <section className="guesses-section">
        <h2 className="guesses-title">Guesses</h2>
        <ul className="guesses-list">
          {guesses.map((guess, index) => (
            <li key={index}>{guess}</li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Word;
