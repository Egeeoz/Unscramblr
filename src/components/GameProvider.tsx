import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import { handleGuess, scrambleWord } from '../helper/GameLogic';
import { toast } from 'react-toastify';

interface GameContextType {
  randomWord: string;
  scrambledWord: string;
  guesses: string[];
  gameStatus: boolean;
  handleGuess: (guess: string) => void;
  winOrLose: string;
  setWinOrLose: Dispatch<SetStateAction<string>>;
  toastAlert: (message: string) => void;
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

  const [gameStatus, setGameStatus] = useState<boolean>(() => {
    const storedGameStatus = localStorage.getItem('gameStatus');
    return storedGameStatus === 'true';
  });

  const [winOrLose, setWinOrLose] = useState<string>(() => {
    const storedWinOrLose = localStorage.getItem('winOrLose');
    return storedWinOrLose || '';
  });

  const toastAlert = (message: string) =>
    toast(message, {
      theme: 'dark',
      autoClose: 3000,
      position: 'top-center',
    });

  useEffect(() => {
    const fetchDailyWord = async () => {
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
        setGuesses([]);
        localStorage.setItem('guessedWords', JSON.stringify([]));
        localStorage.setItem('dailyWord', data.word);
        localStorage.setItem('scrambledWord', scrambledDailyWord);
        localStorage.setItem('dailyWordDate', today);
        localStorage.setItem('winOrLose', '');
        localStorage.setItem('gameStatus', 'true');

        setGameStatus(true);
      } catch (error) {
        console.error('Error fetching daily word:', error);
      }
    };

    fetchDailyWord();
  }, []);

  const guessHandler = (value: string) => {
    handleGuess(
      value,
      randomWord,
      guesses,
      gameStatus,
      setGameStatus,
      setScrambledWord,
      setGuesses,
      setWinOrLose,
      toastAlert
    );
  };

  return (
    <GameContext.Provider
      value={{
        randomWord,
        scrambledWord,
        guesses,
        gameStatus,
        winOrLose,
        handleGuess: guessHandler,
        setWinOrLose,
        toastAlert,
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
