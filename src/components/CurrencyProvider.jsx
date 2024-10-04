import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const CurrencyContext = createContext();

const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('USD'); // Default currency
    const [exchangeRates, setExchangeRates] = useState({});

    // Fetch exchange rates when the component mounts or the currency changes
    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/exchange_rates');
                const data = await response.json();
                setExchangeRates(data.rates); // Set the rates for conversions
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            }
        };
        fetchExchangeRates();
    }, [currency]);

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export default CurrencyProvider;
