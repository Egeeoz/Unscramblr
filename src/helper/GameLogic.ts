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
