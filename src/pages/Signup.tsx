import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import { signupUser } from '../helper/Api';
import '../styling/pages/Signup.css';

export const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = async (formData: {
    email: string;
    password: string;
    username?: string;
  }) => {
    if (!formData.username) {
      alert('Username is required');
      return;
    }

    try {
      const dataToSend = { ...formData, username: formData.username as string };
      await signupUser(dataToSend);
      alert('Signup Successful');
      navigate('/login');
    } catch (error) {
      alert(error || 'Signup failed');
    }
  };

  return (
    <section className="signup-form-section">
      <Form header="Signup" onSubmit={handleSignup} />
    </section>
  );
};

export default Signup;
