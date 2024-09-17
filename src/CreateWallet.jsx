// src/CreateWallet.jsx
import React from 'react';

const CreateWallet = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
            <h1 className="text-2xl font-bold mb-4">Write down your Recovery Phrase</h1>
            <p className="mb-6">You will need it on the next step</p>

            {/* Placeholder for the seed phrase area */}
            <div className="bg-gray-800 p-4 rounded-md mb-6">
                <p className="text-center">[Seed phrase would go here]</p>
            </div>

            {/* Continue button */}
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-md">
                I SAVED MY RECOVERY PHRASE
            </button>
        </div>
    );
};

export default CreateWallet;
