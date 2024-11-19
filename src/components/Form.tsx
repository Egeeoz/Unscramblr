import '../styling/components/Form.css';
import Button from './Button';

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
        <Button text={header === 'Signup' ? 'Signup' : 'Login'} />
      </section>
    </form>
  );
};

export default Form;
