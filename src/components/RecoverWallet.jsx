import React, { useState } from 'react';
import * as bip39 from 'bip39';
import { Keypair, Connection } from '@solana/web3.js';
import { useNavigate } from 'react-router-dom';

const RecoverWallet = () => {
    const [seedPhrase, setSeedPhrase] = useState(new Array(12).fill('')); // 12 fields for recovery phrase
    const [error, setError] = useState('');
    const [pasteSuccess, setPasteSuccess] = useState('');
    const [fileSuccess, setFileSuccess] = useState('');
    const navigate = useNavigate();
    //const connection = new Connection('https://api.devnet.solana.com'); // Use devnet for testing
    const connection = new Connection('https://api.mainnet-beta.solana.com');

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

    // Function to handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) {
            setError('No file selected.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const fileText = e.target.result.trim();
            const fileSeedPhrase = fileText.split(' ');

            if (fileSeedPhrase.length !== 12) {
                setError('Seed phrase in the file must be exactly 12 words.');
                return;
            }

            setSeedPhrase(fileSeedPhrase); // Update the seed phrase with file values
            setFileSuccess('Seed phrase uploaded successfully!');
        };

        reader.onerror = () => {
            setError('Error reading the file.');
        };

        reader.readAsText(file); // Read the file as text
    };

    const handleRecover = async () => {
        const mnemonic = seedPhrase.join(' ').trim();
        try {
            // Validate the seed phrase
            if (!bip39.validateMnemonic(mnemonic)) {
                setError('Invalid seed phrase');
                return;
            }

            // Convert mnemonic to seed
            const seed = await bip39.mnemonicToSeed(mnemonic);

            // Generate a Keypair from the seed
            const keypair = Keypair.fromSeed(seed.slice(0, 32));

            // Log the public key for manual checking on Solana block explorer
            console.log("Public Key Generated:", keypair.publicKey.toString());

            // Switch to Mainnet connection
            const connection = new Connection('https://api.mainnet-beta.solana.com');

            // Check if the account exists by getting its account information
            const accountInfo = await connection.getAccountInfo(keypair.publicKey);

            if (accountInfo) {
                console.log("Account Info: ", accountInfo);
                // Wallet exists on the blockchain, navigate to dashboard with public key
                navigate('/dashboard', { state: { publicKey: keypair.publicKey.toString() } });
            } else {
                setError('No existing wallet found for the given seed phrase.');
            }
        } catch (err) {
            console.error("Error: ", err);
            setError('Error recovering the wallet');
        }
    };


    return (
        <div className="min-h-screen bg-[#112240] text-white flex flex-col items-center justify-center py-12 px-4">
            <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">Enter your recovery phrase.</h1>
                <p className="mb-6 text-gray-600 text-center">Your recovery phrase is the key to the wallet.</p>

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
                {fileSuccess && <p className="text-green-500 mb-4">{fileSuccess}</p>}

                {/* File Upload */}
                <div className="mb-4">
                    <input
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-[#8ecae6] file:text-black hover:file:bg-[#219ebc] transition"
                    />
                </div>

                {/* Buttons vertically aligned */}
                <div className="flex flex-col space-y-4 items-center">
                    {/* Button to paste seed phrase */}
                    <button
                        className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-6 rounded-md transition w-full"
                        onClick={handlePaste}
                    >
                        PASTE SEED PHRASE
                    </button>

                    {/* Continue button */}
                    <button
                        className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-6 rounded-md transition w-full"
                        onClick={handleRecover}
                    >
                        CONTINUE
                    </button>

                    {/* Back button */}
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

export default RecoverWallet;
