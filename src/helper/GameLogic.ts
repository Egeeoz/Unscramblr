import { Dispatch, SetStateAction } from 'react';
// This function is to scramble the word
export const scrambleWord = (word: string): string => {
  return word
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
    .toLocaleLowerCase();
};

export const validateGuess = (guess: string, correctWord: string): boolean => {
  return guess.toLocaleLowerCase() === correctWord.toLocaleLowerCase();
};

export const handleGuess = (
  value: string,
  randomWord: string,
  guesses: string[],
  gameStatus: boolean,
  setGameStatus: Dispatch<SetStateAction<boolean>>,
  setScrambledWord: Dispatch<SetStateAction<string>>,
  setGuesses: Dispatch<SetStateAction<string[]>>
) => {
  if (!gameStatus) return;
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
};
