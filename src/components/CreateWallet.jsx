// src/components/CreateWallet.jsx
import React, { useState, useEffect } from 'react';
import * as bip39 from 'bip39';
import { Keypair } from '@solana/web3.js'; // Import Solana Web3 for wallet derivation
import { useNavigate } from 'react-router-dom';

const CreateWallet = () => {
    const [seedPhrase, setSeedPhrase] = useState([]);
    const [publicKey, setPublicKey] = useState(null);
    const navigate = useNavigate();

    // Generate the seed phrase and derive wallet when the component mounts
    useEffect(() => {
        const generateWallet = async () => {
            // Generate mnemonic (seed phrase)
            const mnemonic = bip39.generateMnemonic();
            setSeedPhrase(mnemonic.split(' '));

            // Derive the wallet from the mnemonic
            const seed = await bip39.mnemonicToSeed(mnemonic); // Converts mnemonic to seed buffer
            const derivedKeypair = Keypair.fromSeed(seed.slice(0, 32)); // Solana requires 32 bytes for the keypair

            // Store the seed phrase in localStorage (never store on server)
            localStorage.setItem('solanaSeedPhrase', mnemonic);
            localStorage.setItem('solanaPublicKey', derivedKeypair.publicKey.toString());

            // Set public key to state for display
            setPublicKey(derivedKeypair.publicKey.toString());
        };

        generateWallet();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold mb-4">Write down your Recovery Phrase</h1>
            <p className="mb-6">You will need it on the next step</p>

            {/* Display the seed phrase */}
            <div className="bg-gray-800 p-4 rounded-md mb-6">
                <div className="grid grid-cols-3 gap-2">
                    {seedPhrase.length > 0 ? (
                        seedPhrase.map((word, index) => (
                            <div key={index} className="text-left">
                                <span className="text-gray-400">{index + 1}. </span>
                                {word}
                            </div>
                        ))
                    ) : (
                        <p>Generating Seed Phrase...</p>
                    )}
                </div>
            </div>

            {/* Continue button */}
            <button
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-md"
                onClick={() => navigate('/dashboard')}  // Navigate to dashboard
            >
                I SAVED MY RECOVERY PHRASE
            </button>

            {/* Display the public key (for debugging or later usage) */}
            {publicKey && (
                <p className="mt-4">Your Wallet Public Key: <strong>{publicKey}</strong></p>
            )}
        </div>
    );
};

export default CreateWallet;
