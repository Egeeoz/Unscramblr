import Word from '../components/Word';
import '../styling/pages/Home.css';

const Home = () => {
  return (
    <section className="main-container">
      <section className="word-container">
        <Word />
      </section>
    </section>
  );
};

export default Home;
