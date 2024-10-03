import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { createTokenAccount } from '../utils/createTokenAccount';
import { Keypair } from '@solana/web3.js';
import { Connection } from '@solana/web3.js';
import { amount } from '@metaplex-foundation/js';



const CreateTokenModal = ({ isOpen, onClose, setAddedTokens,keypair ,connection  }) => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleTokens, setVisibleTokens] = useState(10); // Initial number of tokens to display
  const [searchQuery, setSearchQuery] = useState(''); // State for search input



  const handleAddToken = async (mint, name, logo) => {
    const amount =0;
    try {
      // Wait for createTokenAccount to complete
      await createTokenAccount(mint, keypair, connection, amount);
  
      
    } catch (error) {
      console.error("Error adding token:", error);
    }
  };
  

  

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          'https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json'
        );
        console.log(response.data.tokens); // Log the response for debugging
        setTokens(response.data.tokens || []); // Set tokens to the retrieved tokens or an empty array
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setError('Error fetching tokens'); // Set error message
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTokens();
    }
  }, [isOpen]);

  if (!isOpen) return null; // Don't render anything if the modal is closed

  const loadMoreTokens = () => {
    setVisibleTokens((prev) => prev + 10); // Load 10 more tokens each time
  };

  // Filter tokens based on search query
  const filteredTokens = tokens.filter((token) =>
    (token.name && token.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (token.address && token.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-[#2c2d30]  p-6 rounded-lg shadow-lg w-11/12 max-w-lg max-h-[80vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-xl transition-colors duration-200"
          aria-label="Close modal"
        >
          &#10005;
        </button>

        <h3 className="text-2xl font-bold mb-4 text-gray-50">Create Token Account</h3>

        <input
          type="text"
          placeholder="Search by token name or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className=" text-black mb-4 p-2 border bg-[#3d3d3f] border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400 w-full transition duration-200"
        />

        {loading && <p className="text-gray-500">Loading tokens...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && filteredTokens.length === 0 && <p className="text-gray-500">No tokens found.</p>}

        <ul className="space-y-3">
          {filteredTokens.slice(0, visibleTokens).map((token, index) => (
            <li
              key={index}
              className="bg-[#3d3d3f] p-4 rounded-lg flex justify-between items-center transition-shadow duration-200 hover:shadow-md"
            >
              <div className="flex items-center">
                {token.logoURI ? (
                  <img
                    src={token.logoURI}
                    alt={`${token.name} logo`}
                    className="h-10 w-10 mr-3 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 mr-3 bg-gray-300 rounded-full" />
                )}
                <div>
                  <div className="text-gray-900 font-semibold">
                    {token.extensions?.website ? (
                      <a
                        href={token.extensions.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-semibold hover:text-blue-800 transition duration-200"
                      >
                        {token.name}
                      </a>
                    ) : (
                      <span className="text-gray-900">{token.name || token.address}</span>
                    )}
                  </div>
                  <div className="text-gray-400 text-sm overflow-hidden w-60">
                    {token.address || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Website Link */}
              {token.extensions?.website && (
                <div className="flex flex-col items-end">
                  <button className="mt-2 bg-[#8ecae6] hover:bg-[#219ebc]  text-black font-bold py-2 px-6 rounded-md transition duration-200"
                  onClick={() => handleAddToken(token.address ,token.name, token.logoURI)}
                  >
                    Add
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

        {visibleTokens < filteredTokens.length && (
          <button
            onClick={loadMoreTokens}
            className="mt-4 w-full bg-[#8ecae6] hover:bg-[#219ebc]  text-black font-bold py-2 px-6 rounded-md transition duration-200"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

CreateTokenModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  solPrice: PropTypes.number,
  setAddedTokens: PropTypes.func,
  keypair: PropTypes.instanceOf(Keypair).isRequired, // Ensure userKeypair is an instance of Keypair,
  connection: PropTypes.instanceOf(Connection).isRequired,


};

export default CreateTokenModal;
