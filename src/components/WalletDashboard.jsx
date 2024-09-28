import React, { useState, useEffect } from 'react';
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import SendTransaction from './SendTransaction'; 
import QRCode from 'react-qr-code';
import Modal from 'react-modal';
import { decryptData } from '../utils/cryptoUtils';
import { MoonPayBuyWidget } from '@moonpay/moonpay-react';
import SPLTokenList from './SPLTokenList.jsx';
import { useConnection } from '@solana/wallet-adapter-react';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import axios from 'axios';

Modal.setAppElement('#root');

const WalletDashboard = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [solPrice, setSolPrice] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  
  const { connection } = useConnection();

  useEffect(() => {
    const retrieveAndDecryptSeed = async () => {
      try {
        const encryptedSeed = JSON.parse(localStorage.getItem('encryptedSeed'));
        const iv = JSON.parse(localStorage.getItem('iv'));
        const salt = JSON.parse(localStorage.getItem('salt')); 
        const password = localStorage.getItem('walletPassword');

        if (!encryptedSeed || !iv || !salt || !password) {
          setError('Missing encrypted seed, IV, salt, or password.');
          return;
        }

        const decryptedSeed = await decryptData(encryptedSeed, iv, salt, password);
        const seed = await bip39.mnemonicToSeed(decryptedSeed);
        const path = "m/44'/501'/0'/0'"; // Standard Solana derivation path
        const derivedKey = derivePath(path, seed.toString('hex'));
        const keypair = Keypair.fromSeed(Buffer.from(derivedKey.key));

        setPublicKey(keypair.publicKey.toString());
        const balance = await connection.getBalance(keypair.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      } catch (err) {
        console.error('Error decrypting seed or fetching balance:', err);
        setError('Error decrypting seed or fetching balance.');
      }
    };

    retrieveAndDecryptSeed();
  }, [connection]);

  // Fetch the current SOL price in USD
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        setSolPrice(response.data.solana.usd);
      } catch (err) {
        console.error('Error fetching SOL price:', err);
      }
    };

    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, 60000); // Refresh price every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

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
    setVisible(true);
  };

  const handleCloseOverlay = () => {
    setVisible(false);
  };

  return (
    <div className="min-h-screen bg-[#112240] text-white flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-5xl font-bold mb-8 tracking-wider text-[#f4f9f9]">Wallet Dashboard</h1>
      {error ? (
        <p className="text-red-500 text-xl">{error}</p>
      ) : (
        <>
          {publicKey ? (
            <>
              {/* Wallet Info */}
              <div className="bg-[#1e2a34] p-6 rounded-lg shadow-lg text-left max-w-md w-full mx-auto">
                <p className="text-xs font-medium mb-1 text-gray-400">Public Key:</p>
                <p className="bg-[#f0f4f8] text-black font-mono p-1 rounded break-words text-sm">{publicKey}</p>
                <p className="mt-3 text-3xl font-medium text-white">
                  {balance !== null ? (
                    <span>
                      {balance.toFixed(2)} <span className="text-lg font-normal">SOL</span> ($
                      {solPrice !== null ? (balance * solPrice).toFixed(2) : 'Fetching price...'})
                      </span>
                  ) : (
                    'Fetching balance...'
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-8">
                <button 
                  className="bg-[#f4f9f9] text-black hover:bg-[#c4e0e5] font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                  onClick={handleBuyCrypto}
                >
                  Buy Crypto
                </button>
                <button 
                  className="bg-[#f4f9f9] text-black hover:bg-[#c4e0e5] font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                  onClick={handleReceiveClick}
                >
                  Receive
                </button>
                <button 
                  className="bg-[#f4f9f9] text-black hover:bg-[#c4e0e5] font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                  onClick={handleSendClick}
                >
                  Send
                </button>
              </div>

              {/* Modal for buying crypto */}
              <MoonPayBuyWidget
                variant="overlay"
                baseCurrencyCode="usd"
                baseCurrencyAmount="100"
                defaultCurrencyCode="sol"
                visible={visible}
                onCloseOverlay={handleCloseOverlay}
              />

              {/* Modal for Send Transaction */}
              {modalType === 'send' && (
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={handleModalClose}
                  className="fixed inset-0 flex items-center justify-center p-4"
                  overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                >
                  <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
                    <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={handleModalClose}>
                      ×
                    </button>
                    <h4 className="text-xl font-semibold mb-6 text-center text-[#0c7b93]">Send SOL</h4>

                    {/* Send Transaction Form */}
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Recipient Address</label>
                        <input
                          type="text"
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0c7b93] focus:border-[#0c7b93]"
                          placeholder="Enter recipient's public key"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Amount (SOL)</label>
                        <input
                          type="number"
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0c7b93] focus:border-[#0c7b93]"
                          placeholder="Enter amount"
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          type="submit"
                          className="w-full bg-[#0c7b93] text-white font-bold py-2 px-4 rounded-lg transition-all hover:bg-[#27496d] transform hover:scale-105"
                        >
                          Send
                        </button>
                      </div>
                    </form>
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
                  <div className="bg-white p-6 rounded-lg flex flex-col items-center relative shadow-lg">
                    <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={handleModalClose}>
                      ×
                    </button>
                    <h4 className="text-xl font-semibold mb-4 text-center text-[#0c7b93]">Receive SOL</h4>
                    <QRCode value={publicKey} size={256} />
                    <p className="mt-4 text-center text-sm text-gray-500">Scan this QR code to receive SOL.</p>
                  </div>
                </Modal>
              )}

              {/* SPL Token List */}
              <SPLTokenList publicKey={publicKey} />
            </>
          ) : (
            <p>Loading wallet information...</p>
          )}
        </>
      )}
    </div>
  );
};

export default WalletDashboard;
