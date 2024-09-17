import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export const fetchTokens = async (walletPublicKey, connection) => {
  const accounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
    programId: TOKEN_PROGRAM_ID,
  });

  const tokens = accounts.value.map((account) => ({
    mint: account.account.data.parsed.info.mint,
    amount: account.account.data.parsed.info.tokenAmount.uiAmount,
  }));

  return tokens;
};
