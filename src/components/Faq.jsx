import React from 'react';

const Faq = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">What is this application about?</h2>
        <p>This application is a Solana wallet that allows users to manage their SPL tokens and cryptocurrencies.</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">How do I create a wallet?</h2>
        <p>You can create a new wallet by clicking on the "Create Wallet" button on the main dashboard.</p>
      </div>
      {/* Add more FAQs as needed */}
    </div>
  );
};

export default Faq;
