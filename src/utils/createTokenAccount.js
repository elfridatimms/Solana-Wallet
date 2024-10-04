import { getOrCreateAssociatedTokenAccount, transfer, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Transaction, PublicKey } from '@solana/web3.js';

export const createTokenAccount = async (mintAddress, userKeypair, connection, amount = 0) => {
  const mintPublicKey = new PublicKey(mintAddress);
  const userPublicKey = userKeypair.publicKey;

  try {
    // Step 1: Get or Create Associated Token Account for the user
    const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      userKeypair,
      mintPublicKey,
      userPublicKey
    );

    console.log('Associated Token Account:', associatedTokenAccount.address.toBase58());

    if (amount > 0) {
      // Step 2: Transfer tokens if amount > 0 (if you are transferring tokens to this account)
      // Ensure you have a valid source token account with tokens.
      const sourceTokenAccount = associatedTokenAccount.address; // Replace with actual source token account

      // Step 3: Create transfer transaction
      const transaction = new Transaction().add(
        transfer({
          source: sourceTokenAccount, // This is where the tokens are coming from
          destination: associatedTokenAccount.address, // This is where tokens are going
          amount, // Amount of tokens to transfer
          owner: userPublicKey, // User's wallet address as owner
        })
      );

      // Step 4: Sign and send the transaction
      const signature = await connection.sendTransaction(transaction, [userKeypair]);
      await connection.confirmTransaction(signature);
      console.log(`Successfully added ${amount} tokens to the account: ${associatedTokenAccount.address.toBase58()}`);
    } else {
      console.log('Token account created, no token transfer occurred.');
    }

    // Return the associated token account address
    return associatedTokenAccount.address;
  } catch (error) {
    console.error('Error adding token:', error);
  }
};
