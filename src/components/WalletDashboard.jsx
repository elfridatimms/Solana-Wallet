import React, { useState, useEffect } from 'react';
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { sendTransaction } from '../utils/sendTransaction';
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
import { Link } from 'react-router-dom';
import Header from './Header.jsx';
import { FaQuestionCircle, FaHeadset, FaFileAlt, FaCopy } from 'react-icons/fa'; // Import icons




Modal.setAppElement('#root');

const WalletDashboard = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [solPrice, setSolPrice] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [myKeyPair, setMyKeypair] = useState('');

  const location = useLocation();
  const password = location.state?.password;
  const username = location.state?.username;


  const { connection } = useConnection();
  useEffect(() => {
    const retrieveAndDecryptSeed = async () => {
      try {
        // Retrieve encrypted data from local storage
        const user = JSON.parse(localStorage.getItem(username))
        if (!user) {
          setError("couldn't find user for username: ", username)
        }
        const encryptedSeed = user.encryptedSeed;
        const iv = user.iv;
        const salt = user.salt;

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

        setMyKeypair(keypair);

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

const handleCopy = () => {
    navigator.clipboard.writeText(publicKey)
      .then(() => {
        alert('Public key copied to clipboard!'); // You can replace this with a toast notification
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendTransaction(recipientAddress, amount, myKeyPair, connection);
  };

  // Handle changes for each input
  const handleAddressChange = (event) => {
    setRecipientAddress(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };


  return (
    <>
    <Header settings />
      <div className="min-h-screen bg-[#4e4f51] text-white flex flex-col p-6 space-y-8">
      
      <div className="flex flex-row space-x-6">
        {/* Aside Section */}
        <aside className="w-1/4 bg-[#313133] p-6 rounded-lg shadow-lg text-left max-w-md">
          <h3 className="text-xl font-semibold mb-4 text-white">Useful Links</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/faq" 
                className="flex items-center p-3 rounded-lg transition duration-200 hover:bg-[#4b4c4f]"
              >
                <FaQuestionCircle className="mr-2" /> {/* Icon */}
                <span className="text-lg">FAQ</span> {/* Enhanced Font Size */}
              </Link>
            </li>
            <li>
              <Link 
                to="/support" 
                className="flex items-center p-3 rounded-lg transition duration-200 hover:bg-[#4b4c4f]"
              >
                <FaHeadset className="mr-2" /> {/* Icon */}
                <span className="text-lg">Support</span> {/* Enhanced Font Size */}
              </Link>
            </li>
            <li>
              <Link 
                to="/terms" 
                className="flex items-center p-3 rounded-lg transition duration-200 hover:bg-[#4b4c4f]"
              >
                <FaFileAlt className="mr-2" /> {/* Icon */}
                <span className="text-lg">Terms</span> {/* Enhanced Font Size */}
              </Link>
            </li>
          </ul>
        </aside>
  
        {/* Main Content */}
        <div className="flex-grow">
          {error ? (
            <p className="text-red-500 text-xl">{error}</p>
          ) : (
            <>
              {publicKey ? (
                <>
                  {/* Wallet Info and SPL Tokens */}
                  <div className="flex flex-col items-center space-y-8">
                    {/* Wallet Info */}
                    <div className="bg-[#313133] p-6 rounded-lg shadow-lg text-left w-full max-w-3xl">
                      <p className="text-xs font-medium mb-1 text-gray-400">Public Key:</p>
                      <p className="bg-[#494e51] text-black font-mono p-1 rounded break-words text-sm flex items-center justify-between">
      <span>{publicKey}</span>
      <FaCopy 
        onClick={handleCopy}
        className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
        title="Copy Public Key"
      />
    </p>
                      <p className="mt-3 text-3xl font-medium text-white">
                        {balance !== null ? (
                          <span> $  
                            {solPrice !== null ? (balance * solPrice).toFixed(2): 'Fetching price...'}  
                          </span>
                        ) : (
                          'Fetching balance...'
                        )}
                      </p>
  
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
                    </div>
  
                    {/* SPL Token List */}
                    <div className="bg-[#313133]  p-6 rounded-lg shadow-lg text-left w-full max-w-3xl">
                      <SPLTokenList publicKey={publicKey} />
                    </div>
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
                    <form className="space-y-6" onSubmit={handleSubmit}>
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Recipient Address
    </label>
    <input
      name="recipientAddress" // Add a name attribute for form data
      value={recipientAddress}
      onChange={handleAddressChange}
      type="text"
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0c7b93] focus:border-[#0c7b93]"
      placeholder="Enter recipient's public key"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">
      Amount (SOL)
    </label>
    <input
      name="amount" // Add a name attribute for form data
      value={amount}
      onChange={handleAmountChange}
      type="number"
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0c7b93] focus:border-[#0c7b93]"
      placeholder="Enter amount"
      min={0}
      step="any" // Allow decimal values
      required
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
                </>
              ) : (
                <p>Loading wallet information...</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
  
};

export default WalletDashboard;
