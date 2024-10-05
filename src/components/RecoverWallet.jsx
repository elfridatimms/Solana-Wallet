import React, { useState, useEffect } from 'react';
import 'unorm';  // Import polyfill for normalize()
import { Keypair, Connection } from '@solana/web3.js';
import { useNavigate } from 'react-router-dom';
import bip39 from 'bip39-light';
import { derivePath } from 'ed25519-hd-key'; // For proper key derivation for Solana wallets
import { useSeed } from './SeedContextProvider';
import { FaTimes, FaCopy, FaDownload, FaPaste, FaUpload } from 'react-icons/fa'; // Add FaTimes to the import list

// Function to derive the keypair from the seed using correct derivation path
export async function deriveKeypairFromSeed(mnemonic) {
    // Generate seed from the mnemonic asynchronously
    const seed = await bip39.mnemonicToSeed(mnemonic); // This returns a Buffer

    // Use BIP44 derivation path for Solana
    const path = "m/44'/501'/0'/0'"; // Solana-specific derivation path
    const derivedSeed = derivePath(path, seed).key; // Get derived private key

    // Return the Keypair
    return Keypair.fromSeed(derivedSeed);
}

// Encrypt the seed phrase
export async function encryptSeed(seedPhrase, password) {
    const encoder = new TextEncoder();

    // Derive key from password
    const keyMaterial = await getKeyMaterial(password);
    const salt = window.crypto.getRandomValues(new Uint8Array(16)); // Generate a random salt
    const key = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
    );

    // Encode seed phrase
    const seedBuffer = encoder.encode(seedPhrase);

    // Create initialization vector (IV) for AES-GCM
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the seed phrase
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv,
        },
        key,
        seedBuffer
    );

    return { encryptedData, iv, salt };
}

// Helper function to derive the key from a password
async function getKeyMaterial(password) {
    const encoder = new TextEncoder();
    return window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
}

const RecoverWallet = () => {
    const [seedPhrase, setSeedPhrase, clearSeed] = useSeed(); // 12 fields for recovery phrase
    const [error, setError] = useState('');
    const [pasteSuccess, setPasteSuccess] = useState('');
    const [fileSuccess, setFileSuccess] = useState('');
    const [publicKeyDisplay, setPublicKeyDisplay] = useState('');
    const navigate = useNavigate();
    //const connection = new Connection('https://api.devnet.solana.com'); // Use devnet for testing
    const fileInputRef = React.createRef();

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
            setError('');
        } catch {
            setError('Failed to paste the seed phrase.');
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0]; // Ensure a file is selected
        if (!file) {
            setError('No file selected.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const fileText = e.target.result.trim();
            const fileSeedPhrase = fileText.split(' '); // Split the file content by space

            if (fileSeedPhrase.length !== 12) { // Ensure the file contains exactly 12 words
                setError('Seed phrase in the file must be exactly 12 words.');
                return;
            }

            setSeedPhrase(fileSeedPhrase); // Update the seed phrase with file values
            setFileSuccess('Seed phrase uploaded successfully!');
            setError('');

        };

        reader.onerror = () => {
            setError('Error reading the file.');
        };

        reader.readAsText(file); // Read the file as text
    };
    // Handle keypress for Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleRecover(); // Trigger recover wallet on Enter
        }
    };

    // Add event listener for keypress
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                handleRecover(); // Trigger the Continue button on Enter key
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress); // Clean up event listener
        };
    }, [seedPhrase]);

    useEffect(() => {
        return () => clearSeed();
    }, [])

    const handleRecover = async () => {
        const mnemonic = seedPhrase.join(' ').trim();
        try {
            // Validate the mnemonic seed phrase
            if (!bip39.validateMnemonic(mnemonic)) {
                setError('Invalid seed phrase');
                return;
            }

            // Derive the keypair from the mnemonic using correct derivation path
            const keypair = await deriveKeypairFromSeed(mnemonic);

            // Display the public key for the recovered wallet
            setPublicKeyDisplay(keypair.publicKey.toString());
            console.log("Public Key Generated:", keypair.publicKey.toString());

            // Navigate to password setup after successful wallet recovery
            navigate('/password-setup', { state: { seed: seedPhrase } });
            clearSeed();
        } catch (err) {
            console.error("Error recovering the wallet: ", err);
            setError('Error recovering the wallet');
        }
    };
    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Programmatically trigger the file input
        }
    };
    const containerHeight = error || pasteSuccess || fileSuccess ? '550px' : '500px';

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1b1d] to-[#3e3f43] text-white flex flex-col items-center justify-center py-12 px-4">
            <div
                className="relative max-w-md w-full bg-[#2c2d30] rounded-lg shadow-lg p-6 flex flex-col justify-between"
                style={{ height: containerHeight }} // Dynamically change height based on paste success
            >                {/* X button for closing */}
                <button className="absolute top-2 left-2 text-white text-lg" onClick={() => {
                    setSeedPhrase(new Array(12).fill('')); // Clear the seed phrase
                    navigate('/'); // Navigate back to the previous page
                }}>
                    <FaTimes />
                </button>

                <div>
                    <h1 className="text-2xl font-bold mb-4 text-center tracking-0.5">Enter your recovery phrase.</h1>
                    <p className="mb-6 text-gray-400 text-center">Your recovery phrase is the key to the wallet.</p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {seedPhrase.map((word, index) => (
                            <input
                                key={index}
                                type="text"
                                className="p-2 border border-gray-600 rounded-md text-center bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8ecae6] text-white"
                                placeholder={index + 1}
                                value={word || ''}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                        ))}
                    </div>

                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {pasteSuccess && <p className="text-green-500 mb-4">{pasteSuccess}</p>}
                    {fileSuccess && <p className="text-green-500 mb-4">{fileSuccess}</p>}
                </div>
                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".txt"
                    className="hidden"
                    onChange={handleFileUpload} // This is triggered when the user selects a file
                />
                {/* Icons */}
                <div className="flex justify-center space-x-4 mb-4">
                    {/* Upload Seed Phrase */}
                    <button className="bg-[#3e3f43] text-white font-bold p-4 rounded-md transition transform hover:scale-110 hover:bg-[#57595d]" onClick={handleUploadClick}>
                        <FaUpload className="text-lg" />
                    </button>

                    {/* Paste Seed Phrase */}
                    <button className="bg-[#3e3f43] text-white font-bold p-4 rounded-md transition transform hover:scale-110 hover:bg-[#57595d]" onClick={handlePaste}>
                        <FaPaste className="text-lg" />
                    </button>
                </div>

                {/* Continue button */}
                <button className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-6 rounded-md transition w-full" onClick={handleRecover}>
                    CONTINUE
                </button>
            </div>
        </div>

    );
};

export default RecoverWallet;
