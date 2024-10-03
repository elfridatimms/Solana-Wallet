import React, { useState } from 'react';

const Settings = () => {
  const [network, setNetwork] = useState('Devnet'); // Default network

  const handleNetworkChange = (e) => {
    setNetwork(e.target.value);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 border border-gray-200 rounded-xl shadow-lg bg-gradient-to-r from-white to-gray-100">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Settings</h2>
      <div className="mb-6">
        <label htmlFor="network" className="block text-base font-medium text-gray-600 mb-2">
          Select Network:
        </label>
        <select
          id="network"
          value={network}
          onChange={handleNetworkChange}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 transition duration-200"
        >
          <option value="Devnet">Devnet</option>
          <option value="Testnet">Testnet</option>
          <option value="Mainnet">Mainnet</option>
        </select>
      </div>
      <button
        onClick={() => alert('Settings saved!')}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
      >
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
