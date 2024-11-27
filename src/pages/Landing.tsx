import Button from '../components/Button';
import '../styling/pages/Landing.css';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <section className="landing-container">
      <section className="wrapper">
        <h1>
          Welcome to Mi<span className="green-x">x</span>
          <span className="red-x">x</span>y
        </h1>
        <p>
          Every day, you'll get a new scrambled word to solve. You have 5
          guesses to unscramble it, and each guess must match the word's length.
          Letters in the correct position will turn{' '}
          <span style={{ fontWeight: 'bold', color: 'green' }}>green</span>,
          while incorrect ones will appear{' '}
          <span style={{ fontWeight: 'bold', color: 'darkred' }}>red</span>. Can
          you solve today's word? Good luck!
        </p>
        <Link to="/home">
          <Button text="Play now!" />
        </Link>
      </section>
    </section>
  );
};

export default Landing;
