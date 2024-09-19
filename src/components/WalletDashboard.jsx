import React, { useState, useEffect } from 'react';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { fetchTokens } from '../utils/fetchTokens'; // Ensure the path is correct
import SendTransaction from './SendTransaction'; // Import SendTransaction component
import QRCode from 'react-qr-code'; // Import QRCode from react-qr-code
import Modal from 'react-modal';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

Modal.setAppElement('#root'); // Set the root element for accessibility

const WalletDashboard = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [tokens, setTokens] = useState([]); // State to store tokens
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to manage QR code modal
  const [modalType, setModalType] = useState(''); // State to determine modal type
  const { connection } = useConnection(); // Access connection
  const { publicKey: walletPublicKey, sendTransaction } = useWallet(); // Access wallet

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

  const handleSendClick = () => {
    setModalType('send');
    setModalIsOpen(true);
  };

  const handleReceiveClick = () => {
    setModalType('receive');
    setModalIsOpen(true);
  };

  const handleModalClose = () => setModalIsOpen(false);

  const handleBuyCrypto = () => {
    // Redirect to a crypto exchange or buying service
    alert('Redirecting to crypto buying service...');
  };

  return (
    <div className="min-h-screen bg-[#112240] text-white flex flex-col items-center justify-center p-6">
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
              className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded"
              onClick={handleBuyCrypto}
            >
              Buy Crypto
            </button>
            <button
              className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded"
              onClick={handleReceiveClick}
            >
              Receive
            </button>
            <button 
              className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded"
              onClick={handleSendClick}
            >
              Send
            </button>
          </div>
          
          {/* Modal for Send Transaction */}
          {modalType === 'send' && (
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={handleModalClose}
              className="fixed inset-0 flex items-center justify-center p-4"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
              <div className="bg-white p-6 rounded-lg relative">
                <button
                  className="absolute top-2 right-2 text-black text-2xl font-bold"
                  onClick={handleModalClose}
                >
                  ×
                </button>
                <h4 className="text-lg font-semibold mb-4">Send SOL</h4>
                {/* SendTransaction uses walletPublicKey for the send functionality */}
                <SendTransaction wallet={{ publicKey: walletPublicKey, sendTransaction }} />
              </div>
            </Modal>
          )}
          
          {/* Modal for Receive Info */}
          {modalType === 'receive' && (
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={handleModalClose}
              className="fixed inset-0 flex items-center justify-center p-4"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
              <div className="bg-white p-6 rounded-lg flex flex-col items-center relative">
                <button
                  className="absolute top-2 right-2 text-black text-2xl font-bold"
                  onClick={handleModalClose}
                >
                  ×
                </button>
                <h4 className="text-lg font-semibold mb-4">Share Your Public Key</h4>
                <QRCode value={publicKey || ''} size={256} />
                <button
                  className="mt-4 bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded"
                  onClick={() => navigator.clipboard.writeText(publicKey)}
                >
                  Copy Public Key
                </button>
              </div>
            </Modal>
          )}
        </div>
      ) : (
        <p>No wallet connected. Please recover or create a wallet first.</p>
      )}
    </div>
  );
};

export default WalletDashboard;
