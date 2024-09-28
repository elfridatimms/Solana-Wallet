import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { TokenListProvider } from '@solana/spl-token-registry';

export const fetchTokens = async (publicKey, connection) => {
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      new PublicKey(publicKey),
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );

    // Fetch the token list from the Solana Token Registry
    const tokenListProvider = new TokenListProvider();
    const tokenListContainer = await tokenListProvider.resolve();

    // Access the tokenList property, which is an array
    const tokenList = tokenListContainer?.getList() || []; // Get the array of tokens or empty array if undefined

    // Ensure tokenList is an array
    if (!Array.isArray(tokenList)) {
      console.error('tokenList is not an array:', tokenList);
      return []; // Return an empty array if not
    }

    // Filter for Solana tokens
    const tokensList = tokenList.filter(token => token.chainId === 101); // Assuming 101 is the chainId for Solana

    // Log the tokenAccounts and tokensList to understand their structure
    console.log('Token Accounts:', tokenAccounts);
    console.log('Tokens List:', tokensList);

    const tokens = tokenAccounts.value.map(({ account }) => {
      const mint = account.data.parsed.info.mint;
      const amount = account.data.parsed.info.tokenAmount.uiAmount;

      // Look up token metadata
      const tokenData = tokensList.find(token => token.address === mint) || {};
      return {
        mint,
        amount,
        name: tokenData.symbol || mint,  // Use symbol if available, otherwise fallback to mint address
        logo: tokenData.logoURI || null, // Use logoURI if available
      };
    });

    console.log('Tokens:', tokens); // Log the final tokens array

    return tokens;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return [];
  }
};
