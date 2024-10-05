import React, { useState, useEffect, useContext } from 'react';
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
import { Link } from 'react-router-dom';
import Header from './Header.jsx';
import { FaHeadset, FaFileAlt, FaCopy } from 'react-icons/fa'; // Import icons
import { useNavigate } from 'react-router-dom';
import SendTransactionModal from './SendTransactionModal.jsx';
import PropTypes from 'prop-types';
import Aside from './Aside.jsx';
import { useCurrency } from './CurrencyProvider'; // Assuming you have a CurrencyProvider for global currency context
import { usd } from '@metaplex-foundation/js';
import Footer from './Footer.jsx';



Modal.setAppElement('#root');

const WalletDashboard = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [solPrice, setSolPrice] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [myKeyPair, setMyKeypair] = useState('');

  console.log("balance: " + balance);

  const { currency } = useCurrency(); // Get the selected currency from the context

  const location = useLocation();
  const password = location.state?.password;
  const username = location.state?.username;

  const navigate = useNavigate(); // Hook for programmatic navigation


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

        if (!bip39.validateMnemonic(decryptedSeed)) {
          console.error("Invalid mnemonic after decryption");
          throw new Error('Invalid mnemonic');
        }

        // Convert mnemonic to seed using BIP39
        const seed = await bip39.mnemonicToSeed(decryptedSeed);
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



  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd,eur,gbp`);
        console.log("currency: " + currency)

        setSolPrice(response.data.solana[currency]);
        console.log("usd...." + response.data.solana.usd)
      } catch (err) {
        console.error('Error fetching SOL price:', err);
      }
    };

    if (currency) {
      fetchSolPrice();
      const interval = setInterval(fetchSolPrice, 60000); // Refresh price every minute

      return () => clearInterval(interval);
    }
  }, [currency]);

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

  /*  const handleSubmit = async (event) => {
     event.preventDefault();
     await sendTransaction(recipientAddress, amount, myKeyPair, connection);
   };
 
   // Handle changes for each input
   const handleAddressChange = (event) => {
     setRecipientAddress(event.target.value);
   };
 
   const handleAmountChange = (event) => {
     setAmount(event.target.value);
   }; */

  const handleSettingsClick = () => {
    navigate('/settings'); // Navigate to the settings page
  };

  return (
    <>
      <Header settings onSettingsClick={handleSettingsClick} />
      <div className="min-h-screen bg-gradient-to-b from-[#1a1b1d] to-[#3e3f43] text-white flex flex-col p-6 space-y-8">

        <div className="flex flex-row space-x-6">
          {/* Aside Section */}

          <Aside>
            <h3 className="text-xl font-semibold mb-4 text-white">Useful Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/support"
                  className="flex items-center p-3 rounded-md transition duration-200 hover:bg-[#4b4c4f]"
                >
                  <FaHeadset className="mr-2" /> {/* Icon */}
                  <span className="text-lg">Support</span> {/* Enhanced Font Size */}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="flex items-center p-3 rounded-md transition duration-200 hover:bg-[#4b4c4f]"
                >
                  <FaFileAlt className="mr-2" /> {/* Icon */}
                  <span className="text-lg">Terms</span> {/* Enhanced Font Size */}
                </Link>
              </li>
            </ul>
          </Aside>


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
                            <span>
                              {solPrice !== null ? `${(balance * solPrice).toFixed(2)} ${currency.toUpperCase()}` : 'Fetching price...'}
                            </span>
                          ) : (
                            'Fetching balance...'
                          )}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 mt-8">
                          <button
                            className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded-md text-md transition w-full font-sans"
                            onClick={handleBuyCrypto}
                          >
                            Buy Crypto
                          </button>
                          <button
                            className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded-md text-md transition w-full font-sans"
                            onClick={handleReceiveClick}
                          >
                            Receive
                          </button>
                          <button
                            className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded-md text-md transition w-full font-sans"
                            onClick={handleSendClick}
                          >
                            Send
                          </button>
                        </div>
                      </div>

                      {/* SPL Token List */}
                      <div className="bg-[#313133]  p-6 rounded-lg shadow-lg text-left w-full max-w-3xl">
                        <SPLTokenList keypair={myKeyPair} />
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
                      <SendTransactionModal
                        isOpen={modalIsOpen}
                        onRequestClose={handleModalClose}
                        myKeyPair={myKeyPair}
                        connection={connection}
                        selectedTokenAddress={null}
                      />
                    )}



                    {/* Modal for Receive Info */}
                    {modalType === 'receive' && (
                      <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={handleModalClose}
                        className="fixed inset-0 flex items-center justify-center p-4"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                      >
                        <div className="bg-white p-6 rounded-md flex flex-col items-center relative shadow-lg">
                          <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            onClick={handleModalClose}
                          >
                            ×
                          </button>
                          <h4 className="text-xl font-semibold mb-4 text-center text-[#567b8c]">
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
      <Footer />
    </>
  );

};



export default WalletDashboard;
