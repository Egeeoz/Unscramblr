import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import { useAuth } from '../helper/AuthContext';
import { loginUser } from '../helper/Api';
import { useGame } from '../components/GameProvider';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toastAlert } = useGame();

  const handleLogin = async (formData: {
    email: string;
    password: string;
    username?: string;
  }) => {
    try {
      const response = await loginUser(formData);

      toastAlert('Login Successfull');
      const username = response.username;

      login(username);
      navigate('/home');
    } catch (error) {
      toastAlert('Login Failed');
    }
  };

  return (
    <>
      <Form header="Login" onSubmit={handleLogin} />
    </>
  );
};

export default Login;
