// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';  // Import custom styles
import CreateWallet from './CreateWallet';  // Import the wallet creation component
import RecoverWallet from './RecoverWallet';  // Import the wallet recovery component

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center relative"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Optional: Dark overlay
      }}
    >
      {/* Rotating Coin */}
      <img
        src="/images/coin.png"  // Ensure the image path is correct
        alt="Rotating Solana Coin"
        className="rotating-coin"
      />

      <h1 className="text-4xl font-bold mb-8 text-white z-10">Solana Wallet Onboarding</h1>
      <div className="flex space-x-8 z-10">
        {/* Button for creating a new wallet */}
        <button
          className="solana-button"
          onClick={() => navigate('/create-wallet')}
        >
          I NEED A NEW WALLET
        </button>

        {/* Button for recovering a wallet */}
        <button
          className="solana-button"
          onClick={() => navigate('/recover-wallet')}
        >
          I ALREADY HAVE A WALLET
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/recover-wallet" element={<RecoverWallet />} />
      </Routes>
    </Router>
  );
};

export default App;
