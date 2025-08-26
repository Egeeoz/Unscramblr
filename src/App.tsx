import { Routes, Route } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';
import Landing from './pages/Landing';

function App() {
  return (
    <main className="App">
      <Navbar />
      <section className="main-container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
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
