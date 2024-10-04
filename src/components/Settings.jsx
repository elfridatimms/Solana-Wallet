import React, { useState } from 'react';
import Header from './Header.jsx';
import PropTypes from 'prop-types';

const Settings = ({currency, setCurrency}) => {
  const [network, setNetwork] = useState('Devnet'); // Default network

  const handleNetworkChange = (e) => {
    setNetwork(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <>
      <Header settings />
      <div className="min-h-screen bg-gradient-to-b from-[#1a1b1d] to-[#3e3f43] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-3xl mx-2 border border-gray-700 shadow-2xl bg-[#2a2a2e] rounded-2xl p-8 -mt-16">
          <h2 className="text-4xl font-bold text-white mb-10 text-center">Settings</h2>

          <div className="mb-8">
            <label htmlFor="network" className="block text-lg font-semibold text-gray-300 mb-3">
              Select Network:
            </label>
            <select
              id="network"
              value={network}
              onChange={handleNetworkChange}
              className="mt-1 block w-full p-4 border border-gray-600 bg-[#1e1e21] text-white rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            >
              <option value="Devnet">Devnet</option>
              <option value="Testnet">Testnet</option>
              <option value="Mainnet">Mainnet</option>
            </select>
          </div>

          <div className="mb-8">
            <label htmlFor="currency" className="block text-lg font-semibold text-gray-300 mb-3">
              Select Currency:
            </label>
            <select
              id="currency"
              value={currency}
              onChange={handleCurrencyChange}
              className="mt-1 block w-full p-4 border border-gray-600 bg-[#1e1e21] text-white rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          <button
            onClick={() => alert('Settings saved!')}
            className="w-full  bg-[#8ecae6] text-black font-bold  hover:bg-[#219ebc]
  py-4 rounded-lg  focus:outline-none focus:ring focus:ring-[#8ecae6] transition duration-300"
          >
            Save Settings
          </button>
        </div>
      </div>
    </>
  );
};

Settings.propTypes = {
  currency: PropTypes.object,
  setCurrency: PropTypes.func
};

export default Settings;
