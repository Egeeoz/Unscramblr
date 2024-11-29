import { Routes, Route } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Profile from './pages/Profile';

function App() {
  return (
    <main className="App">
      <Navbar />
      <section className="main-container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </section>
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
