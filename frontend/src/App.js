import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import BankIDLogin from './components/BankIDLogin';
import GamePage from './components/GamePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<BankIDLogin />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
