import { useState, useEffect } from 'react';
import '../styling/components/Word.css';

const Word = () => {
  const [words, setWords] = useState<string[]>(() => {
    const storedWords = localStorage.getItem('englishWords');
    return storedWords ? JSON.parse(storedWords) : [];
  });
  const [randomWord, setRandomWord] = useState<string>(() => {
    const storedRandomWord = localStorage.getItem('randomWord');
    return storedRandomWord || '';
  });

  const [scrambledWord, setScrambledWord] = useState<string>(() => {
    const storedScrambledWord = localStorage.getItem('scrambledWord');
    return storedScrambledWord || '';
  });

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

  const pickRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomPickedWord = words[randomIndex];
    setRandomWord(randomPickedWord);
    localStorage.setItem('randomWord', randomPickedWord);

    scrambleWord(randomPickedWord);
  };

  const scrambleWord = (word: string) => {
    const chars = word.split('');
    const currentScrambledWord = chars
      .sort(() => 0.5 - Math.random())
      .join('')
      .toLocaleLowerCase();
    setScrambledWord(currentScrambledWord);
    localStorage.setItem('scrambledWord', currentScrambledWord);
  };

  return (
    <>
      <p className="scrambled-word">
        {scrambledWord || 'Click to get random word'}
      </p>
      <button className="word-button" onClick={pickRandomWord}>
        Get a Scrambled word
      </button>
    </>
  );
};

export default Word;
