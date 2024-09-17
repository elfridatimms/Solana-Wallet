import React, { useState, useEffect } from 'react';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { fetchTokens } from '../utils/fetchTokens'; // Ensure the path is correct
import SendTransaction from './SendTransaction'; // Import SendTransaction component

const WalletDashboard = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [tokens, setTokens] = useState([]);  // State to store tokens
  const [showSend, setShowSend] = useState(false); // State to toggle SendTransaction component
  const [showReceive, setShowReceive] = useState(false); // State to toggle Receive info
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

      // Fetch SPL tokens
      fetchTokens(key, connection).then(setTokens);
    }
  }, [connection]);

  const handleSendClick = () => setShowSend(!showSend);
  const handleReceiveClick = () => setShowReceive(!showReceive);

  const handleBuyCrypto = () => {
    // Redirect to a crypto exchange or buying service
    // For now, we'll use a placeholder alert
    alert('Redirecting to crypto buying service...');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8">Wallet Dashboard</h1>
      {publicKey ? (
        <div className="space-y-4">
          <p>Public Key: <strong>{publicKey}</strong></p>
          <p>Balance: <strong>{balance} SOL</strong></p>
          
          {/* Display SPL Tokens */}
          <h3 className="text-xl font-bold mt-6">SPL Tokens</h3>
          {tokens.length > 0 ? (
            <ul className="space-y-2">
              {tokens.map((token, index) => (
                <li key={index}>
                  <div className="flex justify-between">
                    <span>Mint:</span>
                    <span>{token.mint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>{token.amount}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No SPL tokens found.</p>
          )}
          
          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleBuyCrypto}
            >
              Buy Crypto
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleReceiveClick}
            >
              Receive
            </button>
            <button 
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleSendClick}
            >
              Send
            </button>
          </div>
          
          {/* Conditionally render SendTransaction component */}
          {showSend && <SendTransaction wallet={{ publicKey: new PublicKey(publicKey) }} />}
          
          {/* Conditionally render Receive Info */}
          {showReceive && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h4 className="text-lg font-semibold">Share Your Public Key</h4>
              <p>{publicKey}</p>
            </div>
          )}
        </div>
      ) : (
        <p>No wallet connected. Please recover or create a wallet first.</p>
      )}
    </div>
  );
};

export default WalletDashboard;
