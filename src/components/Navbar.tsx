import '../styling/components/Navbar.css';

const Navbar = () => {
  return (
    <nav>
      <h1>Mixxy</h1>
      <header>
        <h2>Username</h2>
        <button className="login-button">Log in</button>
      </header>
    </nav>
  );
};

export default Navbar;
