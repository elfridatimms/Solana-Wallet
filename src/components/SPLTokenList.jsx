import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { fetchTokens } from '../utils/fetchTokens'; 

const SPLTokenList = ({ publicKey }) => {

  const [tokens, setTokens] = useState([]);
  const [solBalance, setSolBalance] = useState(null);
  const connection = new Connection('https://api.mainnet-beta.solana.com'); // Adjust as needed

  useEffect(() => {
    const fetchTokenData = async () => {
      if (publicKey) {
        try {
          // Fetch SOL balance
          const balance = await connection.getBalance(publicKey);
          setSolBalance(balance / LAMPORTS_PER_SOL);

          // Fetch SPL tokens
          const tokens = await fetchTokens(publicKey, connection);
          setTokens(tokens);
        } catch (error) {
          console.error('Error fetching token data:', error);
        }
      }
    };

    fetchTokenData();
  }, [publicKey, connection]);

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">SPL Tokens</h3>

      {/* Always show SOL balance */}
      <div className="mb-4 text-white">
        <div className="flex justify-between">
          <span className="font-semibold">SOL Balance:</span>
          <span>{solBalance !== null ? solBalance.toFixed(2) : 'Fetching...'}</span>
        </div>
      </div>

      {tokens.length > 0 ? (
        <ul className="space-y-2">
          {tokens.map((token, index) => (
            <li key={index} className="text-white">
              <div className="flex justify-between">
                <span className="font-semibold">Mint:</span>
                <span>{token.mint}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Amount:</span>
                <span>{token.amount}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white">No tokens found.</p>
      )}
    </div>
  );
};

export default SPLTokenList;
