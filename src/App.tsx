import { Routes, Route } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';

function App() {
  return (
    <main className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
      <ToastContainer
        transition={Slide}
        style={{
          fontSize: '20px',
        }}
      />
    </main>
  );
}

export default App;
