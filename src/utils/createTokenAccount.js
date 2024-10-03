import { getOrCreateAssociatedTokenAccount, transfer, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Transaction, PublicKey } from '@solana/web3.js';

export const createTokenAccount = async (mintAddress, userKeypair, connection, amount) => {
  const mintPublicKey = new PublicKey(mintAddress);
  const userPublicKey = userKeypair.publicKey;

  try {
    // Attempt to get or create the associated token account
    const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      userKeypair,
      mintPublicKey,
      userPublicKey
    );

    console.log('Associated Token Account:', associatedTokenAccount.address.toBase58());

    // If you want to add tokens to this account, you'll need a source account with tokens.
    // If you don't have a source token account, you need to create it or use an existing one.
    
    // Replace this with your actual source token account for transferring tokens
    const sourceTokenAccount = associatedTokenAccount.address; // Placeholder

    // Create a transaction to transfer tokens
    const transaction = new Transaction().add(
      transfer({
        source: sourceTokenAccount, // Ensure this is a valid source token account
        destination: associatedTokenAccount.address, // This is where tokens are going
        amount: amount, // Amount of tokens to transfer
        owner: userPublicKey, // Your wallet address
      })
    );

    // Sign and send the transaction
    const signature = await connection.sendTransaction(transaction, [userKeypair]);
    await connection.confirmTransaction(signature);

    console.log(`Successfully added ${amount} tokens to the account: ${associatedTokenAccount.address.toBase58()}`);
    return associatedTokenAccount.address; // Return the associated token account address
  } catch (error) {
    console.error('Error adding token:', error);
  }
};
