import Word from '../components/Word';
import '../styling/pages/Home.css';
import { useGame } from '../components/GameProvider';

const Home = () => {
  const { dailyWordNumber } = useGame();

  return (
    <section className="game-container">
      <p className="word-counter">Daily word #{dailyWordNumber}</p>
      <Word />
    </section>
  );
};

export default Home;
