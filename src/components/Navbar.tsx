import '../styling/components/Navbar.css';
import { Link } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../helper/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout, username } = useAuth();

  return (
    <nav>
      <Link to={'/home'}>
        <h1>Mixxy</h1>
      </Link>
      <header>
        {isLoggedIn ? (
          <>
            <h2 className="username">
              <Link to="/profile">{username}</Link>
            </h2>
            <Button text="Log out" onClick={logout} />
          </>
        ) : (
          <>
            <Link to="/login">
              <Button text="Log in" />
            </Link>
            <Link to="/signup">
              <Button text="Signup" />
            </Link>
          </>
        )}
      </header>
    </nav>
  );
};

export default Navbar;
