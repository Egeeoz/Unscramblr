import '../styling/components/Form.css';

interface FormProps {
  header: 'Signup' | 'Login';
}

const Form = ({ header }: FormProps) => {
  return (
    <form action="">
      <h2>{header === 'Signup' ? 'Signup' : 'Login'}</h2>
      <section className="form-content">
        {header === 'Signup' && (
          <>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Enter Username" />
          </>
        )}
        <label htmlFor="email">Email</label>
        <input type="text" id="email" placeholder="Enter Email" />
        <label htmlFor="password">Password</label>
        <input type="text" id="password" placeholder="Enter Password" />
        <input
          type="submit"
          value={header === 'Signup' ? 'Sign Up' : 'Login'}
          className="submit"
        />
      </section>
    </form>
  );
};

export default Form;
