import { useState } from 'react';
import '../styling/components/Form.css';
import Button from './Button';

interface FormProps {
  header: 'Signup' | 'Login';
  onSubmit: (formData: {
    email: string;
    password: string;
    username?: string;
  }) => void;
}

const Form = ({ header, onSubmit }: FormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: header === 'Signup' ? '' : undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (header === 'Signup' && !formData.username) {
      alert('Username is required');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{header === 'Signup' ? 'Signup' : 'Login'}</h2>
      <section className="form-content">
        {header === 'Signup' && (
          <>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter Username"
              value={formData.username || ''}
              onChange={handleChange}
            />
          </>
        )}
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button text={header === 'Signup' ? 'Signup' : 'Login'} />
      </section>
    </form>
  );
};

export default Form;
