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

    // Function to download the seed phrase as a text file
    const downloadSeedPhrase = () => {
        const seedText = seedPhrase.join(' '); // Join the seed phrase into a single string
        const blob = new Blob([seedText], { type: 'text/plain' }); // Create a blob with the seed phrase
        const link = document.createElement('a'); // Create a temporary link element
        link.href = URL.createObjectURL(blob); // Create a URL for the blob
        link.download = 'seed-phrase.txt'; // Set the download file name
        document.body.appendChild(link); // Append the link to the document body
        link.click(); // Programmatically click the link to trigger the download
        document.body.removeChild(link); // Remove the link after download
    };

    return (
        <div className="min-h-screen bg-[#112240] text-white flex flex-col items-center justify-center p-6">
            <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-4" style={{ height: 'auto' }}>
                <h1 className="text-lg font-bold mb-1 text-center">You will need it for later</h1>
                <h2 className="text-xl font-bold mb-2 text-center">Write down your Recovery Phrase</h2>
                <p className="mb-4 text-gray-600 text-center">You will need it on the next step</p>

                {/* Display the seed phrase */}
                <div className="grid grid-cols-3 gap-4 mb-4">
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

                {/* Display copy success message */}
                {copySuccess && <p className="text-green-500 mb-4 text-center">{copySuccess}</p>}

                {/* Buttons stacked vertically */}
                <div className="flex flex-col space-y-4 items-center">
                    <button
                        className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-6 rounded-md transition w-full"
                        onClick={copyToClipboard}
                    >
                        COPY SEED PHRASE
                    </button>

                    <button
                        className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-6 rounded-md transition w-full"
                        onClick={downloadSeedPhrase}
                    >
                        DOWNLOAD SEED PHRASE
                    </button>

                    <button
                        className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-6 rounded-md transition w-full"
                        onClick={() => navigate('/verify-seed')}  // Redirect to verify seed page
                    >
                        I SAVED MY RECOVERY PHRASE
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

export default CreateWallet;
