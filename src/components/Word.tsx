import { useState } from 'react';
import '../styling/components/Word.css';
import { useGame } from '../components/GameProvider';

const Word = () => {
  const { randomWord, scrambledWord, guesses, handleGuess, winOrLose } =
    useGame();

  const [inputValue, setInputValue] = useState<string>('');

  const handleOnClick = () => {
    handleGuess(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGuess(inputValue);
      setInputValue('');
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
          {scrambledWord || 'Loading daily word....'}
        </p>
      </section>
      <section className="guess-input-section">
        <input
          type="text"
          className="guess-input"
          onKeyDown={handleKeyDown}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="guess-button" onClick={handleOnClick}>
          Guess
        </button>
      </section>
      <p>{winOrLose}</p>
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
