import React, { useState, useEffect } from 'react';
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import SendTransaction from './SendTransaction'; // Assume you have a SendTransaction component
import QRCode from 'react-qr-code';
import Modal from 'react-modal';
import { decryptData } from '../utils/cryptoUtils';

Modal.setAppElement('#root')

const WalletDashboard = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [error, setError] = useState(null);
  const connection = new Connection('https://api.devnet.solana.com');

  useEffect(() => {
    const retrieveAndDecryptSeed = async () => {
      try {
        const encryptedSeed = JSON.parse(localStorage.getItem('encryptedSeed'));
        const iv = JSON.parse(localStorage.getItem('iv'));
        const salt = JSON.parse(localStorage.getItem('salt'));  // Retrieve the stored salt
        const password = localStorage.getItem('walletPassword');

        if (!encryptedSeed || !iv || !salt || !password) {
          setError('Missing encrypted seed, IV, salt, or password.');
          return;
        }

        // Decrypt the seed phrase
        const decryptedSeed = await decryptData(encryptedSeed, iv, salt, password);
        console.log('Decrypted Seed:', decryptedSeed);

        // Kreiraj Keypair iz dekriptiranog seeda
        const keypair = Keypair.fromSeed(new TextEncoder().encode(decryptedSeed).slice(0, 32));

        console.log('Generated Keypair PublicKey:', keypair.publicKey.toString());

        // Fetch balance and set public key
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
    alert('Redirecting to crypto buying service...');
  };

  return (
    <div className="min-h-screen bg-[#112240] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8">Wallet Dashboard</h1>
      {error ? (
        <p className="text-red-500 mb-4">{error}</p>
      ) : (
        <>
          {publicKey ? (
            <>
              <p>Public Key: {publicKey}</p>
              <p>Balance: {balance !== null ? `${balance} SOL` : 'Fetching balance...'}</p>
              <div className="flex space-x-4 mt-6">
                <button className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded" onClick={handleBuyCrypto}>
                  Buy Crypto
                </button>
                <button className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded" onClick={handleReceiveClick}>
                  Receive
                </button>
                <button className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded" onClick={handleSendClick}>
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
                    <button className="absolute top-2 right-2 text-black text-2xl font-bold" onClick={handleModalClose}>
                      ×
                    </button>
                    <h4 className="text-lg font-semibold mb-4">Send SOL</h4>
                    <SendTransaction wallet={{ publicKey, connection }} />
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
                    <button className="absolute top-2 right-2 text-black text-2xl font-bold" onClick={handleModalClose}>
                      ×
                    </button>
                    <h4 className="text-lg font-semibold mb-4">Share Your Public Key</h4>
                    <QRCode value={publicKey} size={256} />
                    <button className="mt-4 bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded" onClick={() => navigator.clipboard.writeText(publicKey)}>
                      Copy Public Key
                    </button>
                  </div>
                </Modal>
              )}
            </>
          ) : (
            <p>No wallet connected. Please recover or create a wallet first.</p>
          )}
        </>
      )}
    </div>
  );
};

export default WalletDashboard;
