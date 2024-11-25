import { useState, useEffect } from 'react';
import '../styling/components/Word.css';
import { scrambleWord, validateGuess } from '../helper/GameLogic';

const Word = () => {
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
    const fetchDailWord = async () => {
      const today = new Date().toISOString().split('T')[0];
      const storedDate = localStorage.getItem('dailyWordDate');

      if (storedDate === today) {
        const storedWord = localStorage.getItem('dailyWord') || '';
        setRandomWord(storedWord);

        const storedScrambledWord = localStorage.getItem('scrambledWord') || '';
        setScrambledWord(storedScrambledWord);

        setGameStatus(true);
        return;
      }

      try {
        const response = await fetch(
          'https://agwyz0r4jg.execute-api.eu-north-1.amazonaws.com/dailyword'
        );
        if (!response.ok) throw new Error('Failed to fetch daily word');

        const data = await response.json();
        const dailyWord = data.word;
        setRandomWord(dailyWord);
        const scrambledDailyWord = scrambleWord(dailyWord);
        setScrambledWord(scrambledDailyWord);

        localStorage.setItem('dailyWord', data.word);
        localStorage.setItem('scrambledWord', scrambledDailyWord);
        localStorage.setItem('dailyWordDate', today);

        setGameStatus(true);
      } catch (error) {
        console.error('Error fetching daily word:', error);
      }
    };

    fetchDailWord();
  }, []);

  const handleGuess = () => {
    if (!gameStatus) return;
    const input = document.querySelector('.guess-input') as HTMLInputElement;
    const value = input.value.trim();
    if (!value) return;

    if (value.length != randomWord.length) {
      alert(`Guess must be ${randomWord.length} letters long`);
      return;
    }

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

  const renderGuess = (guess: string) => {
    return guess.split('').map((letter, index) => {
      const isCorrect = randomWord[index] === letter;
      return (
        <span
          key={index}
          style={{
            color: isCorrect ? 'green' : 'darkred', // Green if correct, otherwise black
            fontWeight: isCorrect ? 'bold' : 'normal',
          }}
        >
          {letter}
        </span>
      );
    });
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
            <li key={index}>{renderGuess(guess)}</li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Word;
