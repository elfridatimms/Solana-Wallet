import React, { useState } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction
} from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

const SendTransaction = ({ wallet }) => {
  const { publicKey, sendTransaction } = wallet; // Get publicKey and sendTransaction from props
  const [destinationAddress, setDestinationAddress] = useState('');
  const [lamports, setLamports] = useState(100000); // Amount in lamports (1 SOL = 1e9 lamports)
  const [transactionStatus, setTransactionStatus] = useState('');

  const sendTransactionHandler = async () => {
    if (!publicKey || !sendTransaction) {
      setTransactionStatus("Wallet not connected or unable to sign transactions.");
      return;
    }

    try {
      // Convert destination address to PublicKey
      const destinationPublicKey = new PublicKey(destinationAddress);

      // Create transfer instruction for SOL
      const instruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: destinationPublicKey,
        lamports,
      });

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();

      // Create a new Transaction
      const transaction = new Transaction().add(instruction);
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign the transaction using wallet's signTransaction function
      const signedTransaction = await sendTransaction(transaction, connection);

      // Send and confirm the transaction
      const signature = await sendAndConfirmTransaction(connection, signedTransaction.serialize(), {
        skipPreflight: false
      });

      setTransactionStatus(`Transaction successful! Signature: ${signature}`);
    } catch (error) {
      console.error("Transaction failed:", error);
      setTransactionStatus("Transaction failed. See console for details.");
    }
  };

  return (
    <div>
      <h2>Send Transaction</h2>
      <input
        type="text"
        value={destinationAddress}
        onChange={(e) => setDestinationAddress(e.target.value)}
        placeholder="Destination PublicKey"
      />
      <input
        type="number"
        value={lamports}
        onChange={(e) => setLamports(Number(e.target.value))}
        placeholder="Amount (lamports)"
      />
      <button onClick={sendTransactionHandler}>
        Send Transaction
      </button>
      {transactionStatus && <p>{transactionStatus}</p>}
    </div>
  );
};

export default SendTransaction;
