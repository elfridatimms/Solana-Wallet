import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { LAMPORTS_PER_SOL, PublicKey, Keypair } from '@solana/web3.js';
import { fetchTokens } from '../utils/fetchTokens';
import { useConnection } from '@solana/wallet-adapter-react';
import axios from 'axios';
import CreateTokenModal from './CreateTokenModal'; // Import the modal
import solLogo from '../assets/sol_logo.png';
import SendTransactionModal from './SendTransactionModal';
import { useCurrency } from './CurrencyProvider';
import { deleteTokenAccount } from '../utils/removeTokenFromAccount';


const SPLTokenList = ({ keypair }) => {
  const [tokens, setTokens] = useState([]);
  const [solBalance, setSolBalance] = useState(null);
  const [solPrice, setSolPrice] = useState(null);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false); // Manage send modal visibility
  const [isCreateTokenModalOpen, setIsCreateTokenModalOpen] = useState(false); // Manage create token modal visibility
  const [selectedToken, setSelectedToken] = useState(null); // Track selected token for sending
  const { connection } = useConnection();
  const { currency } = useCurrency(); // Get the selected currency from the context



  const publicKey = keypair.publicKey.toString();
  console.log(tokens);

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

    if (keypair) {
      fetchTokenData();
    }
  }, [keypair, connection]);

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd,eur,gbp`);
    console.log("currency: "+ currency)
        
        setSolPrice(response.data.solana[currency]);
        console.log("usd...."+response.data.solana.usd)
      } catch (err) {
        console.error('Error fetching SOL price:', err);
      }
    };

    if (currency) {
      fetchSolPrice();
      const interval = setInterval(fetchSolPrice, 60000); // Refresh price every minute

      return () => clearInterval(interval);
    }
  }, [currency]);


 

  const handleAddAssetClick = () => {
    setIsCreateTokenModalOpen(true); // Open the create token modal
  };

  const handleCloseSendModal = () => {
    setIsSendModalOpen(false); // Close the send modal
    setSelectedToken(null); // Reset selected token when modal closes
  };

  const handleCloseCreateTokenModal = () => {
    setIsCreateTokenModalOpen(false); // Close the create token modal
  };

  const handleSendClick = (token) => {
    setSelectedToken(token); // Set the selected token for sending
    setIsSendModalOpen(true); // Open the send modal
  };

  const handleDeleteToken = async (tokenAddress) => {
    await deleteTokenAccount(connection, keypair, tokenAddress);
  };
  

  return (
    <div className="bg-[#313133] rounded-lg p-4">
      <h3 className="text-2xl font-bold text-white mb-4">SPL Tokens</h3>

      <ul className="space-y-4">
        {solBalance !== null && (
          <li className="bg-[#3d3d3f] p-4 rounded-lg flex items-center justify-between relative group transition duration-200 hover:bg-[#4b4c4f]">
            <div className="flex items-center">
              <img src={solLogo} alt={`sol logo`} className="h-8 w-8 mr-2" />
              <div>
                <div className="text-white font-semibold">Solana (SOL)</div>
                <div className="text-gray-400">Amount: {solBalance.toFixed(2)}</div>
              </div>
            </div>
            <div className="text-gray-400 mx-auto">
              Value:  {solPrice !== null ? `${(solBalance * solPrice).toFixed(2)} ${currency.toUpperCase()}` : 'Fetching price...'}
            </div>
            <button
              className="hidden group-hover:block bg-[#8ecae6] text-black font-bold py-1 px-3 rounded-md hover:bg-[#219ebc] transition duration-200"
              onClick={() => handleSendClick(null)} // Pass null for SOL
            >
              Send
            </button>


          </li>
        )}

{tokens.length > 0 ? (
          tokens.map((token, index) => (
            <li key={index} className="bg-[#3d3d3f] p-4 rounded-lg flex items-center justify-between relative group transition duration-200 hover:bg-[#4b4c4f]">
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
              <div className="text-gray-400 mx-auto">
              Value:  {solPrice !== null ? `${(token.amount * solPrice).toFixed(2)} ${currency.toUpperCase()}` : 'Fetching price...'}
               </div>
              <button
                className="hidden group-hover:block bg-[#8ecae6] text-black font-bold py-1 px-3 rounded-md hover:bg-[#219ebc] transition duration-200"
                onClick={() => handleSendClick(token)}
              >
                Send
              </button>

              <button
                  className="hidden ml-2 group-hover:block bg-[#f18080] text-black font-bold py-1 px-3 rounded-md hover:bg-[#d16060] transition duration-200"
                  onClick={() => handleDeleteToken(token.mint)}
                >
                  Delete
                </button>

            </li>
          ))
        ) : (
          <p className="text-white">No tokens found.</p>
        )}
      </ul>

      <button
        className="mt-4 bg-[#8ecae6] text-black font-bold py-2 px-4 rounded-md hover:bg-[#219ebc] transition duration-200"
        onClick={handleAddAssetClick} // Open modal on click
      >
        + Add new asset
      </button>

      <SendTransactionModal
        isOpen={isSendModalOpen}
        onRequestClose={handleCloseSendModal} // Use the prop name from modal
        connection={connection}
        keypair={keypair}
        selectedToken={selectedToken} // Pass selected token to modal
      /> {/* Include the send transaction modal */}

      <CreateTokenModal
        isOpen={isCreateTokenModalOpen}
        onClose={handleCloseCreateTokenModal}
        setAddedTokens={setTokens}
        connection={connection}
        keypair={keypair}
        selectedToken={selectedToken} // Pass selected token to modal
      /> {/* Include the create token modal */}
    </div>
  );
};

SPLTokenList.propTypes = {
  keypair: PropTypes.instanceOf(Keypair).isRequired, // Ensure userKeypair is an instance of Keypair
};

export default SPLTokenList;
