import '../styling/pages/Join.css';

const Join = () => {
  return (
    <form action="">
      <h2>Login</h2>
      <section className="form-content">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" />
        <label htmlFor="email">Email</label>
        <input type="text" id="email" />
        <label htmlFor="password">Password</label>
        <input type="text" id="password" />
        <input type="submit" value="submit" className="submit" />
      </section>
    </form>
  );
};

export default Join;
