import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Join from './pages/Join';

function App() {
  return (
    <main className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
      </Routes>
    </main>
  );
}

export default App;
