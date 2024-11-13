import Word from '../components/Word';
import Input from '../components/Input';
import Guess from '../components/Guess';
import '../styling/pages/Home.css';

const Home = () => {
  return (
    <section className="main-container">
      <section className="word-container">
        <Word />
      </section>
      <section className="guess-container">
        <Guess />
      </section>
      <section className="input-container">
        <Input />
      </section>
    </section>
  );
};

export default Home;
