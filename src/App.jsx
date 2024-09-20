import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';

// Import your components
import CreateWallet from './components/CreateWallet.jsx';
import RecoverWallet from './components/RecoverWallet.jsx';
import WalletDashboard from './components/WalletDashboard.jsx';

// Home component
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

  // WalletProvider and ConnectionProvider should wrap your Routes
  return (
    <Router>
      <ConnectionProvider endpoint={network}>
        <WalletProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-wallet" element={<CreateWallet />} />
            <Route path="/recover-wallet" element={<RecoverWallet />} />
            <Route path="/dashboard" element={<WalletDashboard />} />
          </Routes>
        </WalletProvider>
      </ConnectionProvider>
    </Router>
  );
};

export default App;
