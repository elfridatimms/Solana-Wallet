// src/SPLTokenList.jsx
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { fetchTokens } from '../utils/fetchTokens'; 

const SPLTokenList = () => {
  const { publicKey } = useWallet();
  const [tokens, setTokens] = useState([]);
  const connection = new Connection('https://api.mainnet-beta.solana.com'); // Adjust as needed

  useEffect(() => {
    if (publicKey) {
      fetchTokens(publicKey, connection).then(setTokens);
    }
  }, [publicKey]);

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">SPL Tokens</h3>
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
