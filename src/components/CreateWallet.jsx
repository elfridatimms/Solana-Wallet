// src/components/CreateWallet.jsx
import React, { useState, useEffect } from 'react';
import * as bip39 from 'bip39';
import { Keypair } from '@solana/web3.js'; // Import Solana Web3 for wallet derivation
import { useNavigate } from 'react-router-dom';

const CreateWallet = () => {
    const [seedPhrase, setSeedPhrase] = useState([]);
    const [publicKey, setPublicKey] = useState(null);
    const [copySuccess, setCopySuccess] = useState('');
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

    // Function to copy the seed phrase to the clipboard
    const copyToClipboard = () => {
        const seedToCopy = seedPhrase.join(' ');
        navigator.clipboard.writeText(seedToCopy)
            .then(() => {
                setCopySuccess('Seed phrase copied to clipboard!');
            })
            .catch(() => {
                setCopySuccess('Failed to copy the seed phrase.');
            });
    };

    return (
        <div className="min-h-screen bg-[#112240] text-white flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold mb-4">Write down your Recovery Phrase</h1>
            <p className="mb-6">You will need it on the next step</p>

            {/* Display the seed phrase */}
            <div className="bg-white p-4 rounded-md mb-6 shadow-lg">
                <div className="grid grid-cols-3 gap-4">
                    {seedPhrase.length > 0 ? (
                        seedPhrase.map((word, index) => (
                            <input
                                key={index}
                                type="text"
                                className="p-2 border border-gray-400 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-[#8ecae6] text-[#112240]"
                                placeholder={index + 1}
                                value={word}
                                readOnly  // Disable editing as this is for display only
                            />
                        ))
                    ) : (
                        <p>Generating Seed Phrase...</p>
                    )}
                </div>
            </div>

            {/* Button to copy seed phrase */}
            <button
                className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-6 rounded-md transition mb-4"
                onClick={copyToClipboard}
            >
                COPY SEED PHRASE
            </button>

            {/* Display copy success message */}
            {copySuccess && <p className="text-green-500 mb-4">{copySuccess}</p>}

            {/* Continue button */}
            <button
                className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-6 rounded-md transition mb-4"
                onClick={() => navigate('/dashboard')}  // Navigate to dashboard
            >
                I SAVED MY RECOVERY PHRASE
            </button>

            {/* Back button */}
            <button
                className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-1 px-4 rounded-md transition mt-4"
                onClick={() => navigate('/')}
            >
                BACK
            </button>

            {/* Display the public key (for debugging or later usage) */}
            {publicKey && (
                <p className="mt-4">Your Wallet Public Key: <strong>{publicKey}</strong></p>
            )}
        </div>
    );
};

export default CreateWallet;
