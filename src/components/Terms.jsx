import React from 'react';
import Header from './Header';

const Terms = () => {
  return (
    <>
      <Header settings />
      <div className="p-8 bg-gradient-to-b from-[#1a1b1d] to-[#3e3f43] min-h-screen">
        {/* Term 1 */}
        <div className="mb-6 p-6 bg-[#313133] rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-[#e0e0e0] hover:text-[#00d0c6] transition-colors duration-200">
            Terms of Service
          </h2>
          <p className="mt-2 text-[#b0b0b0]">
            By using this application, you agree to the terms outlined in our service agreement.
          </p>
        </div>

        {/* Term 2 */}
        <div className="mb-6 p-6 bg-[#313133] rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-[#e0e0e0] hover:text-[#00d0c6] transition-colors duration-200">
            Privacy Policy
          </h2>
          <p className="mt-2 text-[#b0b0b0]">
            We value your privacy and are committed to protecting your personal information.
          </p>
        </div>

        {/* Add more terms as needed */}
      </div>
    </>
  );
};

export default Terms;
