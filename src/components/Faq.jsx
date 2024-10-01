import React from 'react';
import Header from './Header';

const Faq = () => {
  return (
    <>
    <Header />      

    <div className="p-8 bg-[#4e4f51] min-h-screen">
      {/* FAQ 1 */}
      <div className="mb-6 p-6 bg-[#313133] rounded-lg shadow-lg transition-transform transform hover:scale-105">
        <h2 className="text-2xl font-semibold text-[#e0e0e0] hover:text-[#f0c14b] transition-colors duration-200">
          What is this application about?
        </h2>
        <p className="mt-2 text-[#b0b0b0]">
          This application is a Solana wallet that allows users to manage their SPL tokens and cryptocurrencies.
        </p>
      </div>
      
      {/* FAQ 2 */}
      <div className="mb-6 p-6 bg-[#313133] rounded-lg shadow-lg transition-transform transform hover:scale-105">
        <h2 className="text-2xl font-semibold text-[#e0e0e0] hover:text-[#00d0c6] transition-colors duration-200">
          How do I create a wallet?
        </h2>
        <p className="mt-2 text-[#b0b0b0]">
          You can create a new wallet by clicking on the "Create Wallet" button on the main dashboard.
        </p>
      </div>

      {/* Add more FAQs as needed */}
    </div>
    </>
  );
};

export default Faq;
