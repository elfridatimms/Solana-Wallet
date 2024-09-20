import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';

import CreateWallet from './components/CreateWallet.jsx';
import RecoverWallet from './components/RecoverWallet.jsx';
import WalletDashboard from './components/WalletDashboard.jsx';
import SendTransaction from './components/SendTransaction.jsx';
import VerifySeed from './components/VerifySeed.jsx';  // Import VerifySeed component
import PasswordSetup from './components/PasswordSetup.jsx';  // Import PasswordSetup component

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Solana Wallet Onboarding</h1>
      <div className="flex space-x-8">
        <button
          className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-3 px-6 rounded-md transition"
          onClick={() => navigate('/create-wallet')}
        >
          I NEED A NEW WALLET
        </button>
        <button
          className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-3 px-6 rounded-md transition"
          onClick={() => navigate('/recover-wallet')}
        >
          I ALREADY HAVE A WALLET
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const network = clusterApiUrl('devnet'); // For testing

  return (
    <Router>
      <ConnectionProvider endpoint={network}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-wallet" element={<CreateWallet />} />
          <Route path="/recover-wallet" element={<RecoverWallet />} />
          <Route path="/verify-seed" element={<VerifySeed />} />
          <Route path="/password-setup" element={<PasswordSetup />} /> {/* Add this route */}
          <Route path="/dashboard" element={<WalletDashboard />} />
          <Route path="/send-transaction" element={<SendTransaction />} />
        </Routes>
      </ConnectionProvider>
    </Router>
  );
};

export default App;
