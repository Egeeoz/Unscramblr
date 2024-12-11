import { useState } from 'react';
import '../styling/components/Word.css';
import { useGame } from '../components/GameProvider';
import Button from './Button';
import { CheckCircle2, XCircle } from 'lucide-react';

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
    const isWordCorrect = guess.toLowerCase() == randomWord.toLowerCase();
    return (
      <div className="guess-item">
        {isWordCorrect ? (
          <CheckCircle2
            className="guess-icon correct"
            size={20}
            color="#4ade80"
          />
        ) : (
          <XCircle className="guess-icon incorrect" size={20} color="#f87171" />
        )}
        {guess.split('').map((letter, index) => {
          const isCorrect =
            randomWord[index]?.toLowerCase() === letter.toLowerCase();
          return (
            <span
              key={index}
              style={{
                color: isCorrect ? '#4ade80' : '#f87171',
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>
    );
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
          placeholder="Enter guess"
        />
        <Button onClick={handleOnClick} text="Guess" />
      </section>
      <p
        className="result-message"
        style={{
          color: winOrLose == 'You win!' ? '#4ade80' : '#f87171',
        }}
      >
        {winOrLose}
      </p>
      <section className="guesses-section">
        <h2 className="guesses-title">Guesses</h2>
        <ul className="guesses-list">
          {guesses.map((guess, index) => (
            <li
              key={index}
              data-correct={guess.toLowerCase() === randomWord.toLowerCase()}
            >
              {renderGuess(guess)}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Word;
