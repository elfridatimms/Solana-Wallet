import React, { useState } from "react";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { useWallet, useConnection } from '@solana/wallet-adapter-react'; // Import useWallet and useConnection

const SendTransaction = () => {
  const { publicKey, sendTransaction } = useWallet(); // Get publicKey and sendTransaction from the wallet context
  const { connection } = useConnection(); // Access Solana connection
  const [destinationAddress, setDestinationAddress] = useState(''); // Destination address for the transaction
  const [lamports, setLamports] = useState(100000); // Default amount in lamports (1 SOL = 1e9 lamports)
  const [transactionStatus, setTransactionStatus] = useState(''); // State to show transaction status

  // Handler to initiate the transaction
  const sendTransactionHandler = async () => {
    if (!publicKey || !sendTransaction) {
      setTransactionStatus("Wallet not connected or unable to sign transactions.");
      return;
    }

    try {
      // Convert the destination address to a Solana PublicKey
      const destinationPublicKey = new PublicKey(destinationAddress);

      // Create a transfer instruction for sending SOL
      const instruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: destinationPublicKey,
        lamports,
      });

      // Get the latest blockhash for transaction finalization
      const { blockhash } = await connection.getLatestBlockhash();

      // Create a new transaction and add the transfer instruction
      const transaction = new Transaction().add(instruction);
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign and send the transaction using the wallet's sendTransaction function
      const signature = await sendTransaction(transaction, connection);

      // Confirm the transaction
      await connection.confirmTransaction(signature);

      // Display success message with transaction signature
      setTransactionStatus(`Transaction successful! Signature: ${signature}`);
    } catch (error) {
      console.error("Transaction failed:", error);
      setTransactionStatus("Transaction failed. See console for details.");
    }
  };

  return (
    <div>
      <h2>Send Transaction</h2>
      {/* Input for destination address */}
      <input
        type="text"
        value={destinationAddress}
        onChange={(e) => setDestinationAddress(e.target.value)}
        placeholder="Destination PublicKey"
      />
      {/* Input for amount in lamports */}
      <input
        type="number"
        value={lamports}
        onChange={(e) => setLamports(Number(e.target.value))}
        placeholder="Amount (lamports)"
      />
      {/* Button to send the transaction */}
      <button onClick={sendTransactionHandler}>
        Send Transaction
      </button>
      {/* Display transaction status */}
      {transactionStatus && <p>{transactionStatus}</p>}
    </div>
  );
};

export default SendTransaction;
