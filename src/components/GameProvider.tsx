import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { handleGuess, scrambleWord } from '../helper/GameLogic';

interface GameContextType {
  randomWord: string;
  scrambledWord: string;
  guesses: string[];
  gameStatus: boolean;
  handleGuess: (guess: string) => void;
}

interface GameProviderProps {
  children: ReactNode;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProdiver: React.FC<GameProviderProps> = ({ children }) => {
  const [randomWord, setRandomWord] = useState<string>('');

  const [scrambledWord, setScrambledWord] = useState<string>('');

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

  const guessHandler = (value: string) => {
    handleGuess(
      value,
      randomWord,
      guesses,
      gameStatus,
      setGameStatus,
      setScrambledWord,
      setGuesses
    );
  };

  return (
    <GameContext.Provider
      value={{
        randomWord,
        scrambledWord,
        guesses,
        gameStatus,
        handleGuess: guessHandler,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
