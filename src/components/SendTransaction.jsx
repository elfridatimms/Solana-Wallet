import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  createTransferInstruction,
  buildTransaction,
  getRentExemption,
  STATIC_PUBLICKEY,
  connection
} from "../utils/solanaTransactionsUtils.js"; // Adjust the relative path as necessary
import { sendAndConfirmTransaction } from '@solana/web3.js';

const SendTransaction = () => {
  const { publicKey, signTransaction } = useWallet();
  const [destinationAddress, setDestinationAddress] = useState('');
  const [lamports, setLamports] = useState(100_000); // Example amount in lamports
  const [transactionStatus, setTransactionStatus] = useState('');

  const sendTransactionHandler = async () => {
    if (!publicKey || !signTransaction) {
      setTransactionStatus("Wallet not connected or unable to sign transactions.");
      return;
    }

    try {
      const payer = publicKey;

      // Fetch the rent exemption balance (optional)
      const balanceForRentExemption = await getRentExemption(0);

      // Create transfer instructions
      const transferToDestinationIx = createTransferInstruction(
        payer,
        destinationAddress ? destinationAddress : STATIC_PUBLICKEY,
        lamports
      );

      // Build the transaction
      const transaction = await buildTransaction(
        [transferToDestinationIx],
        payer
      );

      // Sign the transaction with the wallet
      const signedTransaction = await signTransaction(transaction);

      // Send and confirm the transaction
      const signature = await sendAndConfirmTransaction(connection, signedTransaction, { skipPreflight: false });

      setTransactionStatus(`Transaction sent. Signature: ${signature}`);
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
