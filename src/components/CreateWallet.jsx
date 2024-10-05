import React, { useState, useEffect } from 'react';
import * as bip39 from 'bip39';
import { Keypair, Connection, clusterApiUrl } from '@solana/web3.js'; // Import Solana Web3 for wallet derivation and connection
import { derivePath } from 'ed25519-hd-key'; // Import to derive the correct Solana key
import { useNavigate } from 'react-router-dom';
import { useSeed } from './SeedContextProvider';
import { FaTimes, FaCopy, FaDownload } from 'react-icons/fa'; // Icons for Copy, Download, and X button
import { useConnection } from '@solana/wallet-adapter-react';
import Tooltip from './Tooltip';


const CreateWallet = () => {
    const [seedPhrase, setSeedPhrase] = useSeed();
    const [publicKey, setPublicKey] = useState(null);
    const [copySuccess, setCopySuccess] = useState('');
    const [accountCreated, setAccountCreated] = useState(false); // Track if account is created
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { connection } = useConnection();
    const generateWallet = async () => {
        try {
            // Generate mnemonic (seed phrase)
            const mnemonic = bip39.generateMnemonic();
            setSeedPhrase(mnemonic.split(' '));

            // Derive the wallet using BIP44 path for Solana
            const seed = await bip39.mnemonicToSeed(mnemonic); // Converts mnemonic to seed buffer
            const path = `m/44'/501'/0'/0'`; // Standard BIP44 derivation path for Solana
            const derivedSeed = derivePath(path, seed).key;

            // Create a Keypair from the derived seed
            const derivedKeypair = Keypair.fromSeed(derivedSeed.slice(0, 32));

            // Set public key to state for display
            setPublicKey(derivedKeypair.publicKey.toString());

            // Request an airdrop (only on devnet) to activate the account
            const airdropSignature = await connection.requestAirdrop(derivedKeypair.publicKey, 2 * 1e9); // Request 1 SOL
            await connection.confirmTransaction(airdropSignature, 'confirmed');
            setAccountCreated(true); // Account successfully created and funded
        } catch (err) {
            console.error("Error creating wallet:", err);
            setError("Failed to create the wallet. Please try again.");
        }
    };

    // Generate the seed phrase and derive wallet when the component mounts
    useEffect(() => {
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
    const [currentStep, setCurrentStep] = useState(1); // Step tracker
    const totalSteps = 3; // For example: 1. Enter Seed, 2. Verify, 3. Finish

    const handleNextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1b1d] to-[#3e3f43] text-white flex flex-col items-center justify-center p-6">


            <div className="relative max-w-md w-full bg-[#2c2d30] rounded-lg shadow-lg p-6">
                {/* X button inside the smaller window */}
                <button
                    className="absolute top-2 left-2 text-white text-lg"  // Adjusted to top-left corner
                    onClick={() => navigate('/')}
                >
                    <FaTimes />
                </button>

                <h1 className="text-lg font-bold mb-2 text-center tracking-0.5">Your Recovery Phrase</h1>
                <p className="mb-4 text-gray-400 text-center">Make sure to save your recovery phrase. You will need it to access your wallet.</p>

                {/* Display the seed phrase */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {seedPhrase.length > 0 ? (
                        seedPhrase.map((word, index) => (
                            <input
                                key={index}
                                type="text"
                                className="p-2 border border-gray-600 rounded-md text-center bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8ecae6] text-white"
                                value={word || ''}
                                readOnly  // Disable editing as this is for display only
                            />
                        ))
                    ) : (
                        <p>Generating Seed Phrase...</p>
                    )}
                </div>


                {/* Display public key if available */}
                {publicKey && (
                    <div className="text-center mb-4">
                        <p className="text-gray-400">Your Public Key:</p>
                        <p className="text-[#8ecae6] font-mono">{publicKey}</p>
                    </div>
                )}

                {accountCreated && (
                    <p className="text-green-500 text-center mb-4">
                        Account successfully created and 1 SOL has been airdropped to your wallet!
                    </p>
                )}

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                {/* Display copy success message */}
                {copySuccess && <p className="text-green-500 mb-4 text-center">{copySuccess}</p>}

                {/* Circular Buttons for Copy and Download */}
                <div className="flex space-x-4 justify-center mb-4">
                    <Tooltip text="Copy">
                        <button
                            className="bg-[#3e3f43] text-white font-bold p-4 rounded-md transition transform hover:scale-110 hover:bg-[#57595d]"
                            onClick={copyToClipboard}
                        >
                            <FaCopy className="text-lg" />
                        </button>
                    </Tooltip>

                    <Tooltip text="Download">
                        <button
                            className="bg-[#3e3f43] text-white font-bold p-4 rounded-md transition transform hover:scale-110 hover:bg-[#57595d]"
                            onClick={downloadSeedPhrase}
                        >
                            <FaDownload className="text-lg" />
                        </button>
                    </Tooltip>
                </div>

                {/* Big Button for "I Saved My Recovery Phrase" */}
                {/* Big Button for "I Saved My Recovery Phrase" */}
                {/* Big Button for "I Saved My Recovery Phrase" */}
                <button
                    className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded-md text-md transition w-full font-sans"
                    onClick={() => {
                        navigate('/verify-seed', { state: { seed: seedPhrase } });
                        setSeedPhrase("");
                    }}
                >
                    I SAVED MY RECOVERY PHRASE
                </button>
            </div >
        </div >
    );
};

export default CreateWallet;
