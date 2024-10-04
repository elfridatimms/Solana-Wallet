import React from 'react';
import Header from './Header';

const Support = () => {
  return (
    <>
      <Header settings/>
      <div className="p-8 bg-gradient-to-b from-[#1a1b1d] to-[#3e3f43] min-h-screen">
        {/* Support 1 */}
        <div className="mb-6 p-6 bg-[#313133] rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-[#e0e0e0] hover:text-[#00d0c6] transition-colors duration-200">
            How can I get support?
          </h2>
          <p className="mt-2 text-[#b0b0b0]">
            You can reach out to our support team via the contact form on our website.
          </p>
        </div>

        {/* Support 2 */}
        <div className="mb-6 p-6 bg-[#313133] rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-[#e0e0e0] hover:text-[#00d0c6] transition-colors duration-200">
            What hours is support available?
          </h2>
          <p className="mt-2 text-[#b0b0b0]">
            Our support team is available 24/7 to assist you with your inquiries.
          </p>
        </div>

        {/* Add more support items as needed */}
      </div>
    </>
  );
};

export default Support;
