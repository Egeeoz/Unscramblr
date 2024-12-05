import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './helper/AuthContext.tsx';
import { GameProvider } from './components/GameProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter basename="/">
        <GameProvider>
          <App />
        </GameProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
