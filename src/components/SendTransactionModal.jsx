// src/components/SendTransactionModal.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import { sendTransaction } from '../utils/sendTransaction';
import { Connection , Keypair} from '@solana/web3.js';
import PropTypes from 'prop-types';


const SendTransactionModal = ({ isOpen, onRequestClose, keypair, connection, selectedToken }) => {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  const handleAddressChange = (event) => {
    setRecipientAddress(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await sendTransaction(recipientAddress, amount, keypair, connection, selectedToken);
      // Reset the form or handle success here if needed
      setRecipientAddress('');
      setAmount('');
      onRequestClose(); // Close the modal after successful submission
    } catch (error) {
      setError('Error sending transaction: ' + error.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-[#2c2d30] p-8 rounded-lg shadow-xl max-w-md w-full relative">
        <button
          className="absolute top-3 right-3 text-gray-100 hover:text-gray-700 text-2xl font-bold"
          onClick={onRequestClose}
        >
          ×
        </button>
        <h4 className="text-xl font-semibold mb-6 text-center text-[#8ecae6]">
          Send SOL
        </h4>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Send Transaction Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-50">
              Recipient Address
            </label>
            <input
              value={recipientAddress}
              onChange={handleAddressChange}
              type="text"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0c7b93] focus:border-[#0c7b93]"
              placeholder="Enter recipient's public key"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-50">
              Amount (SOL)
            </label>
            <input
              value={amount}
              onChange={handleAmountChange}
              type="number"
              step="0.000001" // Allow decimal input for SOL
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0c7b93] focus:border-[#0c7b93]"
              placeholder="Enter amount in SOL"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-[#8ecae6] text-black hover:bg-[#6bb3cf] font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 w-full"
          >
            Send
          </button>
        </form>
      </div>
    </Modal>
  );
};

SendTransactionModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    keypair: PropTypes.instanceOf(Keypair).isRequired,
    connection: PropTypes.instanceOf(Connection).isRequired,
    selectedToken: PropTypes.object, // This allows any object
  };
  
  

export default SendTransactionModal;
