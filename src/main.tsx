import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { GameProvider } from './components/GameProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <GameProvider>
        <App />
      </GameProvider>
    </BrowserRouter>
  </StrictMode>
);
