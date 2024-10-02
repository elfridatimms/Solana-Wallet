import { PublicKey, Transaction, SystemProgram, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';

export const sendTransaction = async (recipientAddress, amount, sender, connection) => {
  try {
    // Create a transaction to send SOL
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: new PublicKey(recipientAddress),
        lamports: Number(amount) * 1e9, // Convert SOL to lamports (1 SOL = 1e9 lamports)
      })
    );

    // Send and confirm the transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);
    alert('Transaction successful with signature:', signature);
    console.log('Transaction successful with signature:', signature);
  } catch (error) {
    alert('Transaction failed:', error)
    console.error('Transaction failed:', error);
  }
};
