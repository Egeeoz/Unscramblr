import '../styling/components/Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <Link to={'/'}>
        <h1 className="navbar-title">Unscramblr</h1>
      </Link>
      <header>
        <span style={{ opacity: 0.6, fontSize: '16px' }}>
          More features coming soon!
        </span>
      </header>
    </nav>
  );
};

export default Navbar;
