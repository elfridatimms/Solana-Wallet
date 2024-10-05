import React, { useEffect, useState } from 'react';
import * as bip39 from 'bip39';
import { Keypair, Connection } from '@solana/web3.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { encryptSeed } from '../utils/cryptoUtils';
import { FaTimes, FaUpload, FaPaste } from 'react-icons/fa'; // Import X, Upload, and Paste icons
import Tooltip from './Tooltip';
//bkabla
const VerifySeed = () => {
    const [seedInput, setSeedInput] = useState(new Array(12).fill('')); // 12 input fields for recovery phrase
    const [error, setError] = useState('');
    const navigate = useNavigate();
    let seedFromLastStep = useLocation().state?.seed;
    //const connection = new Connection('https://api.devnet.solana.com'); // Use devnet for testing

    const handleInputChange = (index, value) => {
        const updatedSeedInput = [...seedInput];
        updatedSeedInput[index] = value;
        setSeedInput(updatedSeedInput);
    };

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
        if (!Array.isArray(seedFromLastStep)) {
            console.log("seed from last step: ", seedFromLastStep);

            navigate("/");
            return;
        }
        seedFromLastStep = seedFromLastStep.join(" ").trim();
        const mnemonic = seedInput.join(' ').trim();
        if (mnemonic != seedFromLastStep) {
            setError("Seed mismatch!")
            return;
        }
        try {
            if (!bip39.validateMnemonic(mnemonic)) {
                setError('Invalid seed phrase');
                return;
            }

            const seed = await bip39.mnemonicToSeed(mnemonic);

            // const { encryptedData, iv } = await encryptSeed(mnemonic, password);

            navigate('/password-setup', { state: { seed: seedInput } });
        } catch (err) {
            setError('Error verifying the seed phrase or creating wallet.');
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const seedFileText = e.target.result.trim();
            const words = seedFileText.split(' ');
            if (words.length !== 12) {
                setError('Uploaded seed phrase must contain exactly 12 words.');
            } else {
                setSeedInput(words);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1b1d] to-[#3e3f43] text-white flex flex-col items-center justify-center p-6">
            <div className="relative max-w-md w-full bg-[#2c2d30] rounded-lg shadow-lg p-6">

                {/* X button to close the window */}
                <button
                    className="absolute top-2 left-2 text-white text-lg"
                    onClick={() => navigate('/')} // Navigate back to home
                >
                    <FaTimes />
                </button>

                {/* Heading with letter spacing */}
                <h1 className="text-lg font-bold tracking-0.5 mb-1 text-center">
                    Verify Your Recovery Phrase
                </h1>
                <p className="mb-4 text-gray-400 text-center">
                    Please enter or upload your recovery phrase to verify.
                </p>

                {/* Seed phrase input fields */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {seedInput.map((word, index) => (
                        <input
                            key={index}
                            type="text"
                            className="p-2 border border-gray-600 rounded-md text-center bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8ecae6] text-white"
                            placeholder={index + 1} // Add the number placeholder

                            value={word || ''}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                        />
                    ))}
                </div>


                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                {/* Circular Buttons for Upload and Paste */}
                <div className="flex space-x-4 justify-center mb-4">
                    {/* Paste Button with icon */}
                    <Tooltip text="Paste">

                        <button
                            className="bg-[#3e3f43] text-white font-bold p-4 rounded-md transition transform hover:scale-110 hover:bg-[#57595d]"
                            onClick={handlePasteSeedPhrase}
                        >
                            <FaPaste className="text-lg" />
                        </button>
                    </Tooltip>

                    {/* Upload Button with icon */}
                    <Tooltip text="Upload">
                        <label
                            className="bg-[#3e3f43] block text-white font-bold p-4 rounded-md transition transform hover:scale-110 hover:bg-[#57595d] cursor-pointer"
                        >
                            <FaUpload className="text-lg" />
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                accept=".txt"
                                className="hidden"
                            />
                        </label>
                    </Tooltip>
                </div>

                {/* Blue Verify Button */}
                <button
                    className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded-md text-md transition w-full font-sans"
                    onClick={handleVerify}
                >
                    VERIFY SEED PHRASE
                </button>

            </div>
        </div>
    );
};

export default VerifySeed;
