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

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
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
      const now = new Date();
      const todayMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      );

      const todayFormatted = `${todayMidnight.getFullYear()}-${String(
        todayMidnight.getMonth() + 1
      ).padStart(2, '0')}-${String(todayMidnight.getDate()).padStart(2, '0')}`;

      const storedDate = localStorage.getItem('dailyWordDate');

      if (storedDate !== todayFormatted) {
        try {
          const response = await fetch(
            'https://agwyz0r4jg.execute-api.eu-north-1.amazonaws.com/dailyword'
          );
          if (!response.ok) throw new Error('Failed to fetch daily word');

          const data = await response.json();
          const dailyWord = data.word;

          // Reset game state
          setRandomWord(dailyWord);
          const scrambledDailyWord = scrambleWord(dailyWord);
          setScrambledWord(scrambledDailyWord);
          setGuesses([]);
          setWinOrLose('');

          // Update local storage
          localStorage.setItem('guessedWords', JSON.stringify([]));
          localStorage.setItem('dailyWord', data.word);
          localStorage.setItem('scrambledWord', scrambledDailyWord);
          localStorage.setItem('dailyWordDate', todayFormatted);
          localStorage.setItem('winOrLose', '');
          localStorage.setItem('gameStatus', 'true');
          setGameStatus(true);
        } catch (error) {
          console.error('Error fetching daily word:', error);
          const storedWord = localStorage.getItem('dailyWord') || '';
          setRandomWord(storedWord);
          const storedScrambledWord =
            localStorage.getItem('scrambledWord') || '';
          setScrambledWord(storedScrambledWord);
        }
      } else {
        const storedWord = localStorage.getItem('dailyWord') || '';
        setRandomWord(storedWord);
        const storedScrambledWord = localStorage.getItem('scrambledWord') || '';
        setScrambledWord(storedScrambledWord);
      }
    };

    fetchDailyWord();

    const intervalId = setInterval(fetchDailyWord, 4 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const guessHandler = (value: string) => {
    handleGuess(
      value,
      randomWord,
      guesses,
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
