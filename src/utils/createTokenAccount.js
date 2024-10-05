import { getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, transfer, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Transaction, PublicKey } from "@solana/web3.js";

export const createTokenAccount = async (mintAddress, userKeypair, connection, amount) => {
  const mintPublicKey = new PublicKey(mintAddress);
  const userPublicKey = new PublicKey(userKeypair.publicKey.toString());

  console.log(`Mint Public Key: ${mintPublicKey.toBase58()}`);

  try {
    // Step 1: Get the Associated Token Account Address
    const associatedTokenAccountAddress = await getAssociatedTokenAddress(mintPublicKey, userPublicKey);

    // Step 2: Check user balance
    const userBalance = await connection.getBalance(userPublicKey);
    console.log("User Balance:", userBalance);

    // Step 3: Check if the associated token account exists
    let associatedTokenAccount;
    try {
      associatedTokenAccount = await connection.getTokenAccountBalance(associatedTokenAccountAddress);
      console.log('Associated Token Account already exists:', associatedTokenAccountAddress.toBase58());
    } catch (error) {
      if (error.message.includes("could not find account")) {
        // Step 4: Create new Associated Token Account
        console.log('Creating new Associated Token Account...');
        try {
            console.log("mint public k: "+ mintPublicKey +", user pubk: "+ userPublicKey)

          associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            userKeypair,
            mintPublicKey,
            userPublicKey,
            TOKEN_PROGRAM_ID
          );

          console.log('Created Associated Token Account:', associatedTokenAccount.address.toBase58());
        } catch (createError) {
          console.error('Error creating associated token account:', createError);
          throw createError; // Re-throw the error for further handling
        }
      } else {
        throw error; // Re-throw unexpected errors
      }
    }

    // Step 5: If amount > 0, transfer tokens
    if (amount > 0) {
      const sourceTokenAccount = associatedTokenAccountAddress; // Use the generated address

      // Check if the source account has enough tokens
      const sourceAccountInfo = await connection.getTokenAccountBalance(sourceTokenAccount);
      if (parseInt(sourceAccountInfo.value.amount) < amount) {
        throw new Error(`Insufficient funds in source token account. Required: ${amount}, Available: ${sourceAccountInfo.value.amount}`);
      }

      // Step 6: Create transfer transaction
      const transaction = new Transaction().add(
        transfer({
          source: sourceTokenAccount, // Source token account
          destination: associatedTokenAccount.address, // Destination token account
          amount, // Amount of tokens to transfer
          owner: userPublicKey, // User's wallet address as owner
        })
      );

      // Step 7: Sign and send the transaction
      const signature = await connection.sendTransaction(transaction, [userKeypair], { skipPreflight: false });
      await connection.confirmTransaction(signature);
      console.log(`Successfully added ${amount} tokens to the account: ${associatedTokenAccount.address.toBase58()}`);
    } else {
      console.log('Token account created, no token transfer occurred.');
    }

    // Return the associated token account address
    return associatedTokenAccount.address;
  } catch (error) {

    console.error('Error adding token:', error);
    alert("Token not valid, choose another one.")
    throw error; // Re-throw the error for further handling if necessary
  }
};
