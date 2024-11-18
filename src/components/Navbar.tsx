import '../styling/components/Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <Link to={'/'}>
        <h1>Mixxy</h1>
      </Link>
      <header>
        <h2>Username</h2>
        <Link to={'/join'}>
          <button className="login-button">Log in</button>
        </Link>
      </header>
    </nav>
  );
};

export default Navbar;
