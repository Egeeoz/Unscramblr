import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import { useAuth } from '../helper/AuthContext';
import '../styling/pages/Login.css';
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
      navigate('/');
    } catch (error) {
      toastAlert('Login Failed');
    }
  };

  return (
    <section className="login-form-section">
      <Form header="Login" onSubmit={handleLogin} />
    </section>
  );
};

export default Login;
