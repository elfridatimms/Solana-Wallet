import React from 'react';

const Faq = () => {
  return (
    <>
      {/* Container for FAQ section */}
      <div className="py-12 bg-[#3d3f43] px-6">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* FAQ 1 */}
          <div className="flex flex-col justify-between mb-6 p-6 bg-[#2c2d30] rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
            <h2 className="text-2xl font-semibold text-white hover:text-[#00d0c6] transition-colors duration-200">
              What is this application about?
            </h2>
            <p className="mt-2 text-[#b0b0b0]">
              This application is a Solana wallet that allows users to manage their SPL tokens and cryptocurrencies.
            </p>
          </div>

          {/* FAQ 2 */}
          <div className="flex flex-col justify-between mb-6 p-6 bg-[#2c2d30] rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
            <h2 className="text-2xl font-semibold text-white hover:text-[#00d0c6] transition-colors duration-200">
              How do I create a wallet?
            </h2>
            <p className="mt-2 text-[#b0b0b0]">
              You can create a new wallet by clicking on the "Create Wallet" button on the main dashboard.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;
