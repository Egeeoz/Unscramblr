import '../styling/components/Navbar.css';
import { Link } from 'react-router-dom';
import Button from './Button';

const Navbar = () => {
  return (
    <nav>
      <Link to={'/'}>
        <h1>Mixxy</h1>
      </Link>
      <header>
        <h2>Username</h2>
        <Link to={'/login'}>
          <Button text="Log in" />
        </Link>
        <Link to={'/signup'}>
          <Button text="Signup" />
        </Link>
      </header>
    </nav>
  );
};

export default Navbar;
