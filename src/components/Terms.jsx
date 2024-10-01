import React from 'react';

const Terms = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      <p>By using this application, you agree to the following terms and conditions:</p>
      <ul className="list-disc ml-8">
        <li>You are responsible for keeping your private keys secure.</li>
        <li>We are not liable for any losses due to the misuse of this application.</li>
        <li>Ensure that you understand how cryptocurrency and blockchain work before using the wallet.</li>
      </ul>
      {/* Add more terms as needed */}
    </div>
  );
};

export default Terms;
