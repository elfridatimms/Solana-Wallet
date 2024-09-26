import React, { useState, useEffect } from 'react';
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import SendTransaction from './SendTransaction'; 
import QRCode from 'react-qr-code';
import Modal from 'react-modal';
import { decryptData } from '../utils/cryptoUtils';
import { MoonPayBuyWidget } from '@moonpay/moonpay-react';
import SPLTokenList from './SPLTokenList.jsx';


Modal.setAppElement('#root');

const WalletDashboard = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [error, setError] = useState(null);

  const [amountEUR, setAmountEUR] = useState(10);
  const [amountSOL, setAmountSOL] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);

  const [visible, setVisible] = useState(false);



  const connection = new Connection('https://api.devnet.solana.com');

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
        const keypair = Keypair.fromSeed(new TextEncoder().encode(decryptedSeed).slice(0, 32));
        
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


  // Fetch exchange rate from CoinGecko
  const fetchExchangeRate = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=eur');
      const data = await response.json();
      if (data.solana && data.solana.eur) {
        setExchangeRate(data.solana.eur); // Set EUR to SOL rate
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  useEffect(() => {
    fetchExchangeRate(); // Fetch rate when the component mounts
  }, []);

  useEffect(() => {
    // Update SOL equivalent when EUR amount or exchange rate changes
    setAmountSOL((amountEUR / exchangeRate).toFixed(4));
  }, [amountEUR, exchangeRate]);



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
    setModalType('buy');
    setModalIsOpen(true);
  };
  

  return (
    <div className="min-h-screen  bg-[#112240] text-white flex flex-col items-center justify-center p-6 space-y-6">
      <h1 className="text-5xl font-bold mb-8 tracking-wider text-[#f4f9f9]">Wallet Dashboard</h1>
      {error ? (
        <p className="text-red-500 text-xl">{error}</p>
      ) : (
        <>
          {publicKey ? (
            <>
              <div className="bg-[#0c7b93] p-8 rounded-lg shadow-lg text-center">
                <p className="text-xl font-semibold mb-2">Public Key:</p>
                <p className="bg-[#f4f9f9] text-black font-mono p-2 rounded break-words">{publicKey}</p>
                <p className="mt-4 text-2xl font-semibold">{balance !== null ? `${balance.toFixed(2)} SOL` : 'Fetching balance...'}</p>
              </div>

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

              <button onClick={() => setVisible(!visible)}>
            Toggle widget
        </button>

              <MoonPayBuyWidget
            variant="overlay"
            baseCurrencyCode="usd"
            baseCurrencyAmount="100"
            defaultCurrencyCode="sol"
            visible={visible}
        />

              {/* Modal for buying crypto */}
              {modalType === 'buy' && (<Modal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg relative">
          {/* Close Button */}
          <button className="absolute top-2 right-2 text-black text-2xl font-bold" onClick={handleModalClose}>
            ×
          </button>

          <h2 className="text-xl font-semibold mb-4">Buy SOL</h2>

          {/* Input for EUR */}
          <label className="block mb-4">
            Amount in EUR:
            <input
              type="number"
              min="10"
              max="92266"
              value={amountEUR}
              onChange={(e) => setAmountEUR(e.target.value)}
              className="block w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </label>

          {/* Display Equivalent SOL */}
          <p className="mb-4">Equivalent in SOL: {amountSOL}</p>

          {/* Button to proceed with the purchase */}
          <button
            className="bg-[#219ebc] hover:bg-[#0077b6] text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              const url = `https://onramp.gatefi.com/?amount=${amountEUR}&gtfTradeId=...&merchantId=...`;
              window.location.href = url; // Redirect to the Gatefi URL in the current window
            }}
          >
            Buy Now
          </button>
        </div>
      </Modal>)}



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
                    <button className="absolute top-2 right-2 text-black text-2xl font-bold" onClick={handleModalClose}>
                      ×
                    </button>
                    <h4 className="text-lg font-semibold mb-4">Share Your Public Key</h4>
                    <QRCode value={publicKey} size={256} />
                    <button className="mt-4 bg-[#0c7b93] hover:bg-[#27496d] text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105" onClick={() => navigator.clipboard.writeText(publicKey)}>
                      Copy Public Key
                    </button>
                  </div>
                </Modal>
              )}
                       { /*  <SPLTokenList publicKey={publicKey}/>*/}

            </>



          ) : (
            <p className="text-xl">No wallet connected. Please recover or create a wallet first.</p>
          )}
        </>
      )}
    </div>
  );
};

export default WalletDashboard;
