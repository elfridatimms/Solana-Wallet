// CurrencyProvider.jsx

import React, { createContext, useState, useContext } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  return useContext(CurrencyContext);
};

const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('usd');

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider; // Change this to export as default
