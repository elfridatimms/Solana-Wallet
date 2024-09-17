// src/components/RecoverWallet.jsx
import React, { useState } from 'react';
import * as bip39 from 'bip39';
import { Keypair, Connection } from '@solana/web3.js';
import { useNavigate } from 'react-router-dom';

const RecoverWallet = () => {
    const [seedPhrase, setSeedPhrase] = useState(new Array(12).fill('')); // 12 fields for recovery phrase
    const [error, setError] = useState('');
    const [pasteSuccess, setPasteSuccess] = useState('');
    const navigate = useNavigate();
    const connection = new Connection('https://api.devnet.solana.com'); // Use devnet for testing

    // Handle updating the input fields
    const handleInputChange = (index, value) => {
        const updatedSeedPhrase = [...seedPhrase];
        updatedSeedPhrase[index] = value;
        setSeedPhrase(updatedSeedPhrase);
    };

    // Function to paste the seed phrase
    const handlePaste = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            const pastedWords = clipboardText.split(' ');

            if (pastedWords.length !== 12) {
                setError('Seed phrase must be exactly 12 words.');
                return;
            }

            setSeedPhrase(pastedWords); // Update the seed phrase with pasted values
            setPasteSuccess('Seed phrase pasted successfully!');
        } catch {
            setError('Failed to paste the seed phrase.');
        }
    };

    const handleRecover = async () => {
        const mnemonic = seedPhrase.join(' ').trim();
        try {
            // Validate the seed phrase
            if (!bip39.validateMnemonic(mnemonic)) {
                setError('Invalid seed phrase');
                return;
            }
            // Handle recovery logic
            const seed = await bip39.mnemonicToSeed(mnemonic);
            const keypair = Keypair.fromSeed(seed.slice(0, 32));

            // Redirect to the dashboard or handle the wallet recovery further
            navigate('/dashboard');
        } catch (err) {
            setError('Error recovering the wallet');
        }
    };

    return (
        <div className="min-h-screen bg-[#112240] text-white flex flex-col items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Enter your recovery phrase.</h1>
                <p className="mb-6 text-gray-600">Your recovery phrase is the key to the wallet.</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    {seedPhrase.map((word, index) => (
                        <input
                            key={index}
                            type="text"
                            className="p-2 border border-gray-400 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-[#8ecae6] text-[#112240]"
                            placeholder={index + 1}
                            value={word}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                        />
                    ))}
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                {pasteSuccess && <p className="text-green-500 mb-4">{pasteSuccess}</p>}

                {/* Buttons vertically aligned */}
                <div className="flex flex-col space-y-4">
                    {/* Button to paste seed phrase */}
                    <button
                        className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-6 rounded-md transition"
                        onClick={handlePaste}
                    >
                        PASTE SEED PHRASE
                    </button>

                    {/* Continue button */}
                    <button
                        className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-6 rounded-md transition"
                        onClick={handleRecover}
                    >
                        CONTINUE
                    </button>

                    {/* Back button */}
                    <button
                        className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-1 px-4 rounded-md transition"
                        onClick={() => navigate('/')}
                    >
                        BACK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecoverWallet;
