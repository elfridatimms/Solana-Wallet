import React from 'react';
import Header from './Header.jsx';
import PropTypes from 'prop-types';

const Settings = ({ currency, setCurrency, network, setNetwork }) => {
  const networks = ['mainnet-beta', 'testnet', 'devnet'];

  const handleNetworkChange = (event) => {
    console.log(event.target.value);
    setNetwork(event.target.value);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <>
      <Header settings />

      <div className="min-h-screen bg-gradient-to-b from-[#1a1b1d] to-[#3e3f43] text-white flex p-6 max-w-7xl mx-auto">
        <div className="flex-grow bg-[#313133] p-6 rounded-lg shadow-lg text-left max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6">Settings</h3>

          <div className="mb-8">
            <label htmlFor="network" className="block text-md font-semibold text-gray-300 mb-3">
              Select Network:
            </label>
            <select
              id="cluster"
              value={network}
              onChange={handleNetworkChange}
              className="mt-1 block w-full p-4 border border-gray-600 bg-[#1e1e21] text-white rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            >
              {networks.map((networkName) => (
                <option key={networkName} value={networkName}>
                  {networkName.charAt(0).toUpperCase() + networkName.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-8">
            <label htmlFor="currency" className="block text-md font-semibold text-gray-300 mb-3">
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
            onClick={() => {
              localStorage.setItem('selectedCurrency', currency);
              localStorage.setItem('selectedNetwork', network);
              alert('Settings saved!');
            }}
            className="w-full bg-[#8ecae6] text-black font-bold hover:bg-[#219ebc] py-4 rounded-lg focus:outline-none focus:ring focus:ring-[#8ecae6] transition duration-300"
          >
            Save Settings
          </button>
        </div>
      </div>
    </>
  );
};

Settings.propTypes = {
  currency: PropTypes.string,
  setCurrency: PropTypes.func,
  network: PropTypes.string,
  setNetwork: PropTypes.func,
};

export default Settings;
