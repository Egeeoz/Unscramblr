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
  dailyWordNumber: string;
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

  const [dailyWordNumber, setDailyWordNumber] = useState<string>(() => {
    const dailyWordNumber = localStorage.getItem('dailyWordNumber');
    return dailyWordNumber || '';
  });

  const toastAlert = (message: string) =>
    toast(message, {
      theme: 'dark',
      autoClose: 3000,
      position: 'top-center',
    });

  const resetGameState = (newWord: string) => {
    const scrambledNewWord = scrambleWord(newWord);
    setRandomWord(newWord);
    setScrambledWord(scrambledNewWord);
    setGuesses([]);
    setWinOrLose('');
    setGameStatus(true);

    localStorage.setItem('guessedWords', JSON.stringify([]));
    localStorage.setItem('dailyWord', newWord);
    localStorage.setItem('scrambledWord', scrambledNewWord);
    localStorage.setItem('winOrLose', '');
    localStorage.setItem('gameStatus', 'true');
  };

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
        resetGameState(data.word);
        setDailyWordNumber(data.totalWords);
        localStorage.setItem('dailyWordNumber', data.totalWords);
        localStorage.setItem('dailyWordDate', todayFormatted);
      } catch (error) {
        console.error('Error fetching daily word:', error);
        const storedWord = localStorage.getItem('dailyWord');
        if (!storedWord) {
          setTimeout(fetchDailyWord, 60000);
        } else {
          setRandomWord(storedWord);
          setScrambledWord(localStorage.getItem('scrambledWord') || '');
        }
      }
    } else {
      const storedWord = localStorage.getItem('dailyWord') || '';
      setRandomWord(storedWord);
      const storedScrambledWord = localStorage.getItem('scrambledWord') || '';
      setScrambledWord(storedScrambledWord);
    }
  };

  useEffect(() => {
    fetchDailyWord();

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      fetchDailyWord();
      setInterval(fetchDailyWord, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => {
      clearTimeout(timeoutId);
    };
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
        dailyWordNumber,
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
