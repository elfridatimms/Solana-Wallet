// src/components/VerifySeed.jsx
import React, { useState } from 'react';
import * as bip39 from 'bip39';
import { Keypair, Connection } from '@solana/web3.js';
import { useNavigate } from 'react-router-dom';
import { encryptSeed } from '../utils/cryptoUtils';

const VerifySeed = () => {
    const [seedInput, setSeedInput] = useState(new Array(12).fill('')); // 12 input fields for recovery phrase
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const connection = new Connection('https://api.devnet.solana.com'); // Use devnet for testing

    // Handle updating the input fields
    const handleInputChange = (index, value) => {
        const updatedSeedInput = [...seedInput];
        updatedSeedInput[index] = value;
        setSeedInput(updatedSeedInput);
    };

    // Handle pasting the seed phrase
    const handlePasteSeedPhrase = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            const pastedWords = clipboardText.trim().split(' ');

            if (pastedWords.length !== 12) {
                setError('Seed phrase must be exactly 12 words.');
                return;
            }

            setSeedInput(pastedWords); // Update the seed input with pasted values
        } catch {
            setError('Failed to paste the seed phrase.');
        }
    };


    const handleVerify = async () => {
        const mnemonic = seedInput.join(' ').trim();
        try {
            if (!bip39.validateMnemonic(mnemonic)) {
                setError('Invalid seed phrase');
                return;
            }

            const seed = await bip39.mnemonicToSeed(mnemonic);
            const keypair = Keypair.fromSeed(seed.slice(0, 32));

            const password = localStorage.getItem('walletPassword');
            const { encryptedData, iv } = await encryptSeed(mnemonic, password);

            // Store the encrypted seed and iv in localStorage
            localStorage.setItem('encryptedSeed', JSON.stringify(Array.from(new Uint8Array(encryptedData))));
            localStorage.setItem('iv', JSON.stringify(Array.from(iv)));

            navigate('/password-setup');
        } catch (err) {
            setError('Error verifying the seed phrase or creating wallet.');
        }
    };


    return (
        <div className="min-h-screen bg-[#112240] text-white flex flex-col items-center justify-center p-6">
            <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-4" style={{ height: 'auto' }}>
                <h1 className="text-lg font-bold mb-1 text-center">Verify Your Recovery Phrase</h1>
                <p className="mb-4 text-gray-600 text-center">Please enter the recovery phrase to verify.</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    {seedInput.map((word, index) => (
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

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <div className="flex flex-col space-y-4 items-center">
                    <button
                        className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-6 rounded-md transition w-full"
                        onClick={handleVerify}
                    >
                        VERIFY SEED PHRASE
                    </button>

                    {/* Paste Seed Phrase Button */}
                    <button
                        className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-6 rounded-md transition w-full"
                        onClick={handlePasteSeedPhrase}
                    >
                        PASTE SEED PHRASE
                    </button>

                    <button
                        className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-1 px-4 rounded-md transition w-1/3"
                        onClick={() => navigate('/')}
                    >
                        BACK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifySeed;
