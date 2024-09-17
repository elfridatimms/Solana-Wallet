import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import SPLTokenList from './SPLTokenList'; // Import SPLTokenList


const WalletDashboard = () => {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState(0);
  const connection = new Connection('https://api.mainnet-beta.solana.com'); // or any other RPC endpoint

  // For testing, use a hardcoded public key
  const testPublicKey = new PublicKey('5e5CZU2FJH12Boz7eTG6pkmzdcg2Bh8gTy8U7gF1WQxf'); // Replace with your test public key

  useEffect(() => {
    const keyToUse = publicKey || testPublicKey;
    if (keyToUse) {
      connection.getBalance(keyToUse).then((lamports) => {
        setBalance(lamports / LAMPORTS_PER_SOL);
      });
    }
  }, [publicKey]);

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-gray-900 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Wallet Dashboard</h1>
        {connected || testPublicKey ? (
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-lg font-semibold">Public Key:</p>
              <p className="text-sm">{(publicKey || testPublicKey).toBase58()}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-lg font-semibold">Balance:</p>
              <p className="text-sm">{balance} SOL</p>
            </div>
            <SPLTokenList />

          </div>
        ) : (
          <p className="text-center text-lg">Please connect your wallet to view your dashboard.</p>
        )}
      </div>
    </div>
  );
};

export default WalletDashboard;
