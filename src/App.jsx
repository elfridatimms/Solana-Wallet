// src/App.jsx
import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { SolletWalletAdapter } from '@solana/wallet-adapter-sollet'; // Import the Sollet adapter from its package
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css'; // Default styles

// Import the wallet creation, recovery, and dashboard components
import CreateWallet from './components/CreateWallet.jsx';
import RecoverWallet from './components/RecoverWallet.jsx';
import WalletDashboard from './components/WalletDashboard.jsx';

// Home component (UI for choosing wallet creation or recovery)
const Home = () => {
  const navigate = useNavigate();  // Ensure useNavigate is properly imported

  return (
    <div className="min-h-screen bg-green-800 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Solana Wallet Onboarding</h1>
      <div className="flex space-x-8">
        {/* Button for creating a new wallet */}
        <button
          className="bg-neutral-500 hover:bg-neutral-600 text-black font-bold py-3 px-6 rounded-md"
          onClick={() => navigate('/create-wallet')}  // Navigate to wallet creation
        >
          I NEED A NEW WALLET
        </button>

        {/* Button for recovering a wallet */}
        <button
          className="bg-neutral-500 hover:bg-neutral-600 text-black font-bold py-3 px-6 rounded-md"
          onClick={() => navigate('/recover-wallet')}  // Navigate to wallet recovery
        >
          I ALREADY HAVE A WALLET
        </button>

        {/* Button for connecting to an existing wallet */}
        <WalletMultiButton className="bg-orange-600 text-white py-3 px-6 rounded-md" />
      </div>
    </div>
  );
};

const App = () => {
  // Configure network and wallets
  const network = clusterApiUrl('devnet'); // For testing

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolletWalletAdapter(), // Use the Sollet wallet adapter
    ],
    []
  );

  return (
    <Router>
      <ConnectionProvider endpoint={network}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Routes>
              {/* Home page route */}
              <Route path="/" element={<Home />} />
              {/* Route for creating a new wallet */}
              <Route path="/create-wallet" element={<CreateWallet />} />
              {/* Route for recovering an existing wallet */}
              <Route path="/recover-wallet" element={<RecoverWallet />} />
              {/* Route for the wallet dashboard */}
              <Route path="/dashboard" element={<WalletDashboard />} />
            </Routes>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Router>
  );
};

export default App;
