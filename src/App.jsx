import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'; // Wallet modal for wallet selection
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { MoonPayProvider } from '@moonpay/moonpay-react';



import CreateWallet from './components/CreateWallet.jsx';
import RecoverWallet from './components/RecoverWallet.jsx';
import WalletDashboard from './components/WalletDashboard.jsx';
import VerifySeed from './components/VerifySeed.jsx';
import PasswordSetup from './components/PasswordSetup.jsx';
import SeedContextProvider from './components/SeedContextProvider.jsx';
import Login from './components/Login.jsx';
import Faq from './components/Faq.jsx';
import Support from './components/Support.jsx';
import Terms from './components/Terms.jsx';
import Settings from './components/Settings.jsx';

import Home from './components/Home.jsx';
//keke
const App = () => {
  const network = clusterApiUrl('devnet'); // For testing
  const [currency, setCurrency] = useState('USD'); // Default currency


  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()]; // Wallets

  return (
    <Router>
      <ConnectionProvider endpoint={network}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <MoonPayProvider
              apiKey="pk_test_psuOlgPT0LQE4yHGB7CQmOPk6Jj3nJWK"
              debug
            >
              <SeedContextProvider>

                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create-wallet" element={<CreateWallet />} />
                  <Route path="/recover-wallet" element={<RecoverWallet />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/verify-seed" element={<VerifySeed />} />
                  <Route path="/password-setup" element={<PasswordSetup />} /> {/* Add this route */}
                  <Route path="/dashboard" element={<WalletDashboard currency={currency}/>} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/settings" element={<Settings currency={currency} setCurrency={setCurrency}/>} />


                </Routes>
              </SeedContextProvider>
            </MoonPayProvider>

          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Router>
  );
};

export default App;