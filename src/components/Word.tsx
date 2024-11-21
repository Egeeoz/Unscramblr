import { useState, useEffect } from 'react';

const Word = () => {
  const [words, setWords] = useState<string[]>(() => {
    const storedWords = localStorage.getItem('englishWords');
    return storedWords ? JSON.parse(storedWords) : [];
  });
  const [randomWord, setRandomWord] = useState<string>(() => {
    const storedRandomWord = localStorage.getItem('randomWord');
    return storedRandomWord || '';
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
  };

  return (
    <section>
      <p>{randomWord || 'Click to get random word'}</p>
      <button onClick={pickRandomWord}>Get random word</button>
    </section>
  );
};

export default Word;
