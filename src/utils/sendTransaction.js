import {
    PublicKey,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
  } from '@solana/web3.js';
  import {
    createTransferInstruction,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
  } from '@solana/spl-token';
  
  export const sendTransaction = async (
    recipientAddress,
    amount,
    sender,
    connection,
    selectedTokenAddress
  ) => {
    try {
      const transaction = new Transaction();
  
      // Check if sending SOL or SPL Token
      if (!selectedTokenAddress) {
        // Sending SOL
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: sender.publicKey,
            toPubkey: new PublicKey(recipientAddress),
            lamports: Number(amount) * 1e9, // Convert SOL to lamports (1 SOL = 1e9 lamports)
          })
        );
      } else {
        // Sending SPL Token
        const senderTokenAccount = await getAssociatedTokenAddress(
          selectedTokenAddress,
          sender.publicKey
        );
  
        const recipientTokenAccount = await getAssociatedTokenAddress(
          selectedTokenAddress,
          new PublicKey(recipientAddress)
        );
  
        // Add transfer instruction for SPL token
        transaction.add(
          createTransferInstruction(
            senderTokenAccount,
            recipientTokenAccount,
            sender.publicKey,
            Number(amount) // Amount in token's smallest unit (depends on the token decimals)
          )
        );
      }
  
      // Send and confirm the transaction
      const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);
      alert('Transaction successful');
      console.log('Transaction successful with signature:', signature);
    } catch (error) {
      alert('Transaction failed: ' + error);
      console.error('Transaction failed:', error);
    }
  };
  