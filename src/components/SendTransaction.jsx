import { SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import PropTypes from 'prop-types'; // Import PropTypes
import { useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';

const SendTransaction = ({ wallet }) => {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState(null); // Track status messages
  const [isSending, setIsSending] = useState(false); // Disable button during transaction
  const { connection } = useConnection(); // Access connection

  const sendTransaction = async () => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet');
      return;
    }

    if (!destination || !amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid destination address and amount.');
      return;
    }

    setIsSending(true); // Disable the button while processing

    try {
      // Create the transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(destination),
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );

      // Send the transaction
      const signature = await wallet.sendTransaction(transaction, connection);
      
      // Confirm the transaction
      await connection.confirmTransaction(signature, 'processed');
      
      setStatus('Transaction successful!');
    } catch (error) {
      console.error('Transaction failed:', error);
      setStatus(`Transaction failed: ${error.message}`);
    } finally {
      setIsSending(false); // Re-enable the button
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg mt-6">
      <h3 className="text-xl font-bold text-white mb-4">Send SOL</h3>
      <input
        className="block w-full p-2 mb-4 text-black"
        type="text"
        placeholder="Destination Address"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <input
        className="block w-full p-2 mb-4 text-black"
        type="number"
        placeholder="Amount in SOL"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={sendTransaction}
        disabled={isSending} // Disable button while sending
      >
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {status && <p className="text-white mt-4">{status}</p>} {/* Display status */}
    </div>
  );
};

SendTransaction.propTypes = {
  wallet: PropTypes.shape({
    publicKey: PropTypes.instanceOf(PublicKey).isRequired,
    signTransaction: PropTypes.func.isRequired,
    signAllTransactions: PropTypes.func.isRequired,
    sendTransaction: PropTypes.func.isRequired, // Add sendTransaction validation
  }).isRequired,
};

export default SendTransaction;
