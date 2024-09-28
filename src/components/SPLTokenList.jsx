import React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { fetchTokens } from '../utils/fetchTokens'; 
import { useConnection } from '@solana/wallet-adapter-react';
import axios from 'axios';
import CreateTokenModal from './CreateTokenModal'; // Import the modal

const SPLTokenList = ({ publicKey }) => {
  const [tokens, setTokens] = useState([]);
  const [solBalance, setSolBalance] = useState(null);
  const [solPrice, setSolPrice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility
  const { connection } = useConnection();

  useEffect(() => {
    const fetchTokenData = async () => {
      const walletPublicKey = new PublicKey(publicKey);

      try {
        const balance = await connection.getBalance(walletPublicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);

        const fetchedTokens = await fetchTokens(walletPublicKey, connection);
        setTokens(fetchedTokens);
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    if (publicKey) {
      fetchTokenData();
    }
  }, [publicKey, connection]);

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        setSolPrice(response.data.solana.usd);
      } catch (err) {
        console.error('Error fetching SOL price:', err);
      }
    };

    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, 60000); // Refresh price every minute

    return () => clearInterval(interval);
  }, []);

  const handleAddAssetClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-white mb-4">SPL Tokens</h3>

      <ul className="space-y-4">
        {solBalance !== null && (
          <li className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
            <div>
              <div className="text-white font-semibold">Solana (SOL)</div>
              <div className="text-gray-400">Amount: {solBalance.toFixed(2)}</div>
            </div>
            <div className="text-gray-400">
              Value: ${solPrice !== null ? (solBalance * solPrice).toFixed(2) : 'Fetching price...'}
            </div>
          </li>
        )}

        {tokens.length > 0 ? (
          tokens.map((token, index) => (
            <li key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
              <div className="flex items-center">
                {token.logo ? (
                  <img src={token.logo} alt={`${token.name} logo`} className="h-8 w-8 mr-2" />
                ) : (
                  <div className="h-8 w-8 mr-2 bg-gray-600 rounded-full" />
                )}
                <div>
                  <div className="text-white font-semibold">{token.name || token.mint}</div>
                  <div className="text-gray-400">Amount: {token.amount}</div>
                </div>
              </div>
              <div className="text-gray-400">
                Value: ${solPrice !== null ? (token.amount * solPrice).toFixed(2) : 'Fetching price...'}
              </div>
            </li>
          ))
        ) : (
          <p className="text-white">No tokens found.</p>
        )}
      </ul>

      <button
        className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500 transition duration-200"
        onClick={handleAddAssetClick} // Open modal on click
      >
        + Add new asset
      </button>

      <CreateTokenModal isOpen={isModalOpen} onClose={handleCloseModal} /> {/* Include the modal */}
    </div>
  );
};

SPLTokenList.propTypes = {
  publicKey: PropTypes.string.isRequired,
};

export default SPLTokenList;
