import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const CreateTokenModal = ({ isOpen, onClose }) => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json');
        console.log(response.data); // Log the response for debugging
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Create Token Account</h3>
        
        {loading && <p>Loading tokens...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <ul className="space-y-2">
          {tokens.length > 0 ? (
            tokens.map((token, index) => (
              <li key={index} className="flex justify-between items-center p-2 border-b">
                <div className="flex items-center">
                  {token.logo ? (
                    <img src={token.logo} alt={`${token.name} logo`} className="h-6 w-6 mr-2" />
                  ) : (
                    <div className="h-6 w-6 mr-2 bg-gray-600 rounded-full" />
                  )}
                  <span>{token.name || token.mint}</span>
                </div>
                <button className="bg-blue-500 text-white px-2 py-1 rounded">
                  Add
                </button>
              </li>
            ))
          ) : (
            <p>No tokens found.</p>
          )}
        </ul>

        <button onClick={onClose} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

CreateTokenModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateTokenModal;
