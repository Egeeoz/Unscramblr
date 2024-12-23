import { Dispatch, SetStateAction } from 'react';

export const scrambleWord = (word: string): string => {
  const scrambledWord = word
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
    .toLowerCase();
  if (scrambledWord == word) {
    return scrambleWord(word);
  }
  return scrambledWord;
};

export const validateGuess = (guess: string, correctWord: string): boolean => {
  return guess.toLowerCase() === correctWord.toLowerCase();
};

export const handleGuess = (
  value: string,
  randomWord: string,
  guesses: string[],
  setGameStatus: Dispatch<SetStateAction<boolean>>,
  setScrambledWord: Dispatch<SetStateAction<string>>,
  setGuesses: Dispatch<SetStateAction<string[]>>,
  setWinOrLose: Dispatch<SetStateAction<string>>,
  toastAlert: (message: string) => void
) => {
  const storedGameStatus = localStorage.getItem('gameStatus');
  if (storedGameStatus === 'false') {
    return;
  }
  if (!value) return;

  const userGuess = value.trim();

  if (userGuess.length != randomWord.length) {
    toastAlert(`Guess must be ${randomWord.length} letters long`);
    return;
  }

  if (guesses.length >= 5) {
    toastAlert('Sorry, You have lost');
    setGameStatus(false);
    return;
  }

  const isCorrect = validateGuess(userGuess, randomWord);

  if (isCorrect) {
    toastAlert('You guessed right! Congratulations!');
    setGameStatus(false);
    localStorage.setItem('gameStatus', 'false');
    setScrambledWord(randomWord);
    setWinOrLose('You win!');
    localStorage.setItem('winOrLose', 'You win!');
    localStorage.setItem('scrambledWord', randomWord);
  } else if (guesses.length === 4) {
    toastAlert(
      `You have used all your guesses. The correct word was: ${randomWord}`
    );
    setGameStatus(false);
    localStorage.setItem('gameStatus', 'false');
    setScrambledWord(randomWord);
    setWinOrLose('You lose!');
    localStorage.setItem('winOrLose', 'You lose!');
    localStorage.setItem('scrambledWord', randomWord);
  }

  const updatedGuesses = [...guesses, userGuess];
  setGuesses(updatedGuesses);
  localStorage.setItem('guessedWords', JSON.stringify(updatedGuesses));
};
