import { Transaction, sendAndConfirmTransaction, PublicKey } from '@solana/web3.js';
import { createCloseAccountInstruction } from '@solana/spl-token';

/**
 * Deletes a token account from the user's wallet.
 * @param {Object} connection - The Solana connection object.
 * @param {Keypair} keypair - The keypair for the user's wallet.
 * @param {string} tokenAddress - The associated token account address to be deleted.
 */
export const deleteTokenAccount = async (connection, keypair, tokenAddress) => {
  try {
    const associatedTokenAddress = await getAssociatedTokenAccount(keypair.publicKey, tokenAddress);

    const tokenPublicKey = new PublicKey(associatedTokenAddress);

    const transaction = new Transaction().add(
      createCloseAccountInstruction(tokenPublicKey, keypair.publicKey, keypair.publicKey)
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
    console.log('Deleted token account successfully, transaction signature:', signature);
  } catch (error) {
    console.error('Error deleting token account:', error);
  }
};


import { getAssociatedTokenAddress } from '@solana/spl-token';

/**
 * Get the associated token account address for a specific mint and wallet address.
 * @param {string} walletAddress - The public key of the wallet.
 * @param {string} mintAddress - The mint address of the token.
 * @returns {Promise<PublicKey>} - The associated token account address.
 */
const getAssociatedTokenAccount = async (walletAddress, mintAddress) => {
  try {
    const walletPublicKey = new PublicKey(walletAddress);
    const mintPublicKey = new PublicKey(mintAddress);

    // Get the associated token account address
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      walletPublicKey
    );

    return associatedTokenAddress;
  } catch (error) {
    console.error('Error getting associated token account address:', error);
  }
};

