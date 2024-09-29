import React, { useState, useEffect } from 'react';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import SendTransaction from './SendTransaction';
import QRCode from 'react-qr-code';
import Modal from 'react-modal';
import { decryptData } from '../utils/cryptoUtils';
import { MoonPayBuyWidget } from '@moonpay/moonpay-react';
import SPLTokenList from './SPLTokenList.jsx';
import { useConnection } from '@solana/wallet-adapter-react';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key'; // Use for correct Solana key derivation
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useSeed } from './SeedContextProvider.jsx';

Modal.setAppElement('#root');

const WalletDashboard = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [solPrice, setSolPrice] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const password = location.state?.password;
  const [seed2] = useSeed();

  const { connection } = useConnection();
  useEffect(() => {
    const retrieveAndDecryptSeed = async () => {
      try {
        // Retrieve encrypted data from local storage
        const encryptedSeed = JSON.parse(localStorage.getItem('encryptedSeed'));
        const iv = JSON.parse(localStorage.getItem('iv'));
        const salt = JSON.parse(localStorage.getItem('salt'));

        console.log('Encrypted Seed:', encryptedSeed);
        console.log('IV:', iv);
        console.log('Salt:', salt);
        console.log('Password:', password);

        if (!encryptedSeed) {
          setError('Missing encrypted seed.');
          return;
        }
        if (!iv) {
          setError('Missing IV.');
          return;
        }
        if (!salt) {
          setError('Missing salt.');
          return;
        }
        if (!password) {
          setError('Missing password.');
          return;
        }

        console.log("Before decryption...");
        // Decrypt the seed using stored values
        let decryptedSeed;
        try {
          decryptedSeed = await decryptData(encryptedSeed, iv, salt, password);
        } catch (error) {
          console.error("can't decrypt data:", error);
        }
        console.log("decrypted seed:", decryptedSeed, decryptedSeed.replaceAll(",", " "), seed2);

        if (!bip39.validateMnemonic(decryptedSeed.replaceAll(",", " "))) {
          console.error("Invalid mnemonic after decryption");
          throw new Error('Invalid mnemonic');
        }

        // Convert mnemonic to seed using BIP39
        const seed = await bip39.mnemonicToSeed(decryptedSeed.replaceAll(",", " "));
        console.log('Full Seed:', seed); // Log full seed for debugging

        // Derive key using ed25519-hd-key with Solana BIP44 path
        const path = "m/44'/501'/0'/0'";
        const derived = derivePath(path, seed);

        // Create Solana keypair from derived seed
        const keypair = Keypair.fromSeed(derived.key.subarray(0, 32));
        console.log('Keypair Public Key:', keypair.publicKey.toString());

        // Set the public key state
        setPublicKey(keypair.publicKey.toString());

        // Check if the connection is valid
        if (!connection) {
          throw new Error('Connection object is undefined or invalid');
        } else {
          console.log("Connection is valid", connection);
        }

        // Try fetching the balance from Solana network
        try {
          const balanceLamports = await connection.getBalance(keypair.publicKey);
          console.log('Balance in lamports:', balanceLamports);

          // Handle both zero and non-zero balances
          const solBalance = balanceLamports / LAMPORTS_PER_SOL;
          setBalance(solBalance);

          if (balanceLamports === 0) {
            console.log('This wallet has a zero balance.');
          } else {
            console.log('Balance in SOL:', solBalance);
            setBalance(solBalance); // Set balance for wallets with SOL
          }
        } catch (balanceError) {
          // Handle errors in fetching balance specifically
          console.error('Error fetching balance from Solana:', balanceError);
          setBalance(0); // Default to zero balance on failure
          setError('Error fetching balance.');
          throw balanceError;
        }

      } catch (err) {
        // Handle any other errors in the entire decryption/fetching process
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
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
        );
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
                <p className="bg-[#f0f4f8] text-black font-mono p-1 rounded break-words text-sm">
                  {publicKey}
                </p>
                <p className="mt-3 text-3xl font-medium text-white">
                  {balance !== null ? (
                    <span>
                      {balance.toFixed(2)}{' '}
                      <span className="text-lg font-normal">SOL</span> ($
                      {solPrice !== null
                        ? (balance * solPrice).toFixed(2)
                        : 'Fetching price...'}
                      )
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
                    <button
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                      onClick={handleModalClose}
                    >
                      ×
                    </button>
                    <h4 className="text-xl font-semibold mb-6 text-center text-[#0c7b93]">
                      Send SOL
                    </h4>

                    {/* Send Transaction Form */}
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Recipient Address
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0c7b93] focus:border-[#0c7b93]"
                          placeholder="Enter recipient's public key"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Amount (SOL)
                        </label>
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
                    <button
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                      onClick={handleModalClose}
                    >
                      ×
                    </button>
                    <h4 className="text-xl font-semibold mb-4 text-center text-[#0c7b93]">
                      Receive SOL
                    </h4>
                    <QRCode value={publicKey} size={256} />
                    <p className="mt-4 text-center text-sm text-gray-500">
                      Scan this QR code to receive SOL.
                    </p>
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