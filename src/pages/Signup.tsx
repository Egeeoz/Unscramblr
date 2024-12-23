import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import { signupUser } from '../helper/Api';
import { useGame } from '../components/GameProvider';

export const Signup = () => {
  const navigate = useNavigate();
  const { toastAlert } = useGame();

  const handleSignup = async (formData: {
    email: string;
    password: string;
    username?: string;
  }) => {
    if (!formData.username) {
      toastAlert('Username is required');
      return;
    }

    try {
      const dataToSend = { ...formData, username: formData.username as string };
      await signupUser(dataToSend);
      toastAlert('Signup Successful');
      navigate('/login');
    } catch (error) {
      toastAlert('Signup failed');
    }
  };

  return (
    <>
      <Form header="Signup" onSubmit={handleSignup} />
    </>
  );
};

export default Signup;
