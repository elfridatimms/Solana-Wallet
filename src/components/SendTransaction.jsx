import { SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import PropTypes from 'prop-types'; // Import PropTypes
import { useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';

const SendTransaction = ({ wallet }) => {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const { connection } = useConnection(); // Access connection

  const sendTransaction = async () => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet');
      return;
    }
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(destination),
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');
      alert('Transaction successful');
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed');
    }
  };

  return (
    <div>
      <h3>Send SOL</h3>
      <input
        type="text"
        placeholder="Destination Address"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount in SOL"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={sendTransaction}>Send</button>
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
