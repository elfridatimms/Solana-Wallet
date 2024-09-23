import React, { useState } from 'react';
import 'unorm';  // Import polyfill for normalize()
import { Keypair, Connection } from '@solana/web3.js';
import { useNavigate } from 'react-router-dom';
import bip39 from 'bip39-light';
import { derivePath } from 'ed25519-hd-key'; // For proper key derivation for Solana wallets

// Function to derive the keypair from the seed using correct derivation path
export async function deriveKeypairFromSeed(mnemonic) {
    // Generate seed from the mnemonic asynchronously
    const seed = await bip39.mnemonicToSeed(mnemonic); // This returns a Buffer

    // Use BIP44 derivation path for Solana
    const path = "m/44'/501'/0'/0'"; // Solana-specific derivation path
    const derivedSeed = derivePath(path, seed.toString('hex')).key; // Get derived private key

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
    const [seedPhrase, setSeedPhrase] = useState(new Array(12).fill('')); // 12 fields for recovery phrase
    const [error, setError] = useState('');
    const [pasteSuccess, setPasteSuccess] = useState('');
    const [fileSuccess, setFileSuccess] = useState('');
    const [publicKeyDisplay, setPublicKeyDisplay] = useState('');
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
            // Validate the mnemonic seed phrase
            if (!bip39.validateMnemonic(mnemonic)) {
                setError('Invalid seed phrase');
                return;
            }

            // Derive the keypair from the mnemonic using correct derivation path
            const keypair = await deriveKeypairFromSeed(mnemonic);

            // Encrypt the seed phrase using the password from localStorage
            const password = localStorage.getItem('walletPassword');
            const { encryptedData, iv, salt } = await encryptSeed(mnemonic, password);

            // Store the encrypted seed, iv, and salt in localStorage
            localStorage.setItem('encryptedSeed', JSON.stringify(Array.from(new Uint8Array(encryptedData))));
            localStorage.setItem('iv', JSON.stringify(Array.from(iv)));
            localStorage.setItem('salt', JSON.stringify(Array.from(salt))); // Store the salt

            // Display the public key for the recovered wallet
            setPublicKeyDisplay(keypair.publicKey.toString());
            console.log("Public Key Generated:", keypair.publicKey.toString());
            console.log('normalize exists:', !!String.prototype.normalize);

            // Navigate to password setup after successful wallet recovery
            navigate('/password-setup');
        } catch (err) {
            console.error("Error recovering the wallet: ", err);
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
                {publicKeyDisplay && (
                    <p className="text-green-500 mb-4">Generated Public Key: {publicKeyDisplay}</p>
                )}

                {/* File Upload */}
                <div className="mb-4">
                    <input
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-[#8ecae6] file:text-black hover:file:bg-[#219ebc] transition"
                    />
                </div>

                {/* Buttons */}
                <div className="flex flex-col space-y-4 items-center">
                    {/* Paste Seed Phrase Button */}
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
