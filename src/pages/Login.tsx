import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import { useAuth } from '../helper/AuthContext';
import '../styling/pages/Login.css';
import { loginUser } from '../helper/Api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (formData: {
    email: string;
    password: string;
    username?: string;
  }) => {
    try {
      const response = await loginUser(formData);

      alert('Login Successfull');
      const username = response.username;

      login(username);
      navigate('/');
    } catch (error) {
      alert(error || 'Login Failed');
    }
  };

  return (
    <section className="login-form-section">
      <Form header="Login" onSubmit={handleLogin} />
    </section>
  );
};

export default Login;
