import React, { useState } from 'react';

const Settings = () => {
  const [network, setNetwork] = useState('Devnet'); // Default network

  const handleNetworkChange = (e) => {
    setNetwork(e.target.value);
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="mb-4">
        <label htmlFor="network" className="block text-sm font-medium text-gray-700">
          Select Network:
        </label>
        <select
          id="network"
          value={network}
          onChange={handleNetworkChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Devnet">Devnet</option>
          <option value="Testnet">Testnet</option>
          <option value="Mainnet">Mainnet</option>
        </select>
      </div>
      <button
        onClick={() => alert('Settings saved!')}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
