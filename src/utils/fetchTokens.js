import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { TokenListProvider, ENV } from '@solana/spl-token-registry';
import { Metaplex } from '@metaplex-foundation/js'; // Import Metaplex

export const fetchTokens = async (publicKey, connection) => {
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      new PublicKey(publicKey),
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );

    // Initialize Metaplex
    const metaplex = Metaplex.make(connection);

    // Determine which environment to use based on the connection URL
  const connectionUrl = connection.rpcEndpoint;
  const environment = connectionUrl.includes("devnet") ? ENV.Devnet : ENV.MainnetBeta;

    // Use Promise.all to fetch token data
    const tokens = await Promise.all(tokenAccounts.value.map(async ({ account }) => {
      const mint = account.data.parsed.info.mint;
      const amount = account.data.parsed.info.tokenAmount.uiAmount;

      let tokenName = mint; // Fallback to mint address
      let tokenSymbol = '';
      let tokenLogo = null;

      try {
        // Fetch metadata using Metaplex
        const metadataAccount = metaplex.nfts().pdas().metadata({ mint: new PublicKey(mint) });
        const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);

        if (metadataAccountInfo) {
          const token = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(mint) });
          tokenName = token.name;
          tokenSymbol = token.symbol;
          tokenLogo = token.json?.image;
        } else {
          // If metadata is not found, fall back to Token List Provider
          const provider = await new TokenListProvider().resolve();
          const tokenList = provider.filterByChainId(environment).getList();
          const tokenMap = tokenList.reduce((map, item) => {
            map.set(item.address, item);
            return map;
          }, new Map());

          const token = tokenMap.get(mint);
          if (token) {
            tokenName = token.name;
            tokenSymbol = token.symbol;
            tokenLogo = token.logoURI;
          }
        }
      } catch (error) {
        console.error('Error fetching metadata for mint', mint, error);
      }

      return {
        mint,
        amount,
        name: tokenName,  // Use tokenName fetched from metadata or fallback
        logo: tokenLogo,  // Use logo fetched from metadata or fallback
      };
    }));

    return tokens;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return [];
  }
};
