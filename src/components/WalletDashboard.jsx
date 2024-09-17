// src/components/WalletDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const WalletDashboard = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const connection = new Connection('https://api.devnet.solana.com');

  useEffect(() => {
    // Get the public key from localStorage
    const storedPublicKey = localStorage.getItem('solanaPublicKey');
    if (storedPublicKey) {
      const key = new PublicKey(storedPublicKey);
      setPublicKey(key.toBase58());

      // Fetch the balance
      connection.getBalance(key).then((lamports) => {
        setBalance(lamports / LAMPORTS_PER_SOL);
      });
    }
  }, [connection]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Wallet Dashboard</h1>
      {publicKey ? (
        <div className="space-y-4">
          <p>Public Key: <strong>{publicKey}</strong></p>
          <p>Balance: <strong>{balance} SOL</strong></p>
        </div>
      ) : (
        <p>No wallet connected. Please recover or create a wallet first.</p>
      )}
    </div>
  );
};

export default WalletDashboard;
