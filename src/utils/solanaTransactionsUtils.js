import {
    SystemProgram,
    Transaction,
    TransactionMessage,
    VersionedTransaction,
    Connection,
    PublicKey,
    sendAndConfirmTransaction
  } from "@solana/web3.js";
  
  // Setup the connection to the Solana devnet (or mainnet-beta if needed)
  export const connection = new Connection("https://api.devnet.solana.com");
  
  // Static public key to use (replace with your actual public key)
  export const STATIC_PUBLICKEY = new PublicKey("4z7JwTVPxfG4HXjmy5S9Z8cW1iS7J4z3t2EAV1EE9TK5");
  
  // Helper function to print a separator in the console
  export function printConsoleSeparator() {
      console.log("==================================");
  }
  
  // Helper function to generate a Solana Explorer URL for a transaction
  export function explorerURL({ txSignature }) {
      return `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`; // Change to 'mainnet-beta' for production
  }
  
  /**
   * Function to get rent exemption cost for a given space.
   */
  export async function getRentExemption(space = 0) {
      return await connection.getMinimumBalanceForRentExemption(space);
  }
  
  /**
   * Function to create an account instruction using web3.js
   */
  export function createAccountInstruction(fromPubkey, newAccountPubkey, lamports, space) {
      return SystemProgram.createAccount({
          fromPubkey,
          newAccountPubkey,
          lamports,
          space,
          programId: SystemProgram.programId,
      });
  }
  
  /**
   * Function to create a transfer instruction
   */
  export function createTransferInstruction(fromPubkey, toPubkey, lamports) {
      return SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
          programId: SystemProgram.programId,
      });
  }
  
  /**
   * Function to build a VersionedTransaction with multiple instructions
   */
  export async function buildTransaction(instructions, payerKey) {
      const { blockhash } = await connection.getLatestBlockhash();
      const message = new TransactionMessage({
          payerKey,
          recentBlockhash: blockhash,
          instructions,
      }).compileToV0Message();
  
      return new VersionedTransaction(message);
  }
  
  /**
   * Function to sign and send a transaction
   */
  export async function signAndSendTransaction(tx, signers) {
      tx.sign(signers);
  
      const signature = await sendAndConfirmTransaction(connection, tx, {
          skipPreflight: false,
          preflightCommitment: "confirmed",
      });
  
      printConsoleSeparator();
      console.log("Transaction completed.");
      console.log(explorerURL({ txSignature: signature }));
  
      return signature;
  }
  