// src/components/RecoverWallet.jsx
import React, { useState } from 'react';
import * as bip39 from 'bip39';
import { Keypair, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useNavigate } from 'react-router-dom';

const RecoverWallet = () => {
    const [seedPhrase, setSeedPhrase] = useState('');
    const [publicKey, setPublicKey] = useState(null);
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const connection = new Connection('https://api.devnet.solana.com'); // Use devnet for testing

    const handleRecover = async () => {
        try {
            // Validate the seed phrase
            if (!bip39.validateMnemonic(seedPhrase)) {
                setError('Invalid seed phrase');
                return;
            }

            // Convert the mnemonic to a seed
            const seed = await bip39.mnemonicToSeed(seedPhrase);

            // Use only the first 32 bytes of the seed to generate the keypair
            const keypair = Keypair.fromSeed(seed.slice(0, 32));

            // Set the public key to display
            setPublicKey(keypair.publicKey.toBase58());

            // Fetch the balance of the recovered account
            const lamports = await connection.getBalance(keypair.publicKey);
            setBalance(lamports / LAMPORTS_PER_SOL);

            // Optionally store the public key in localStorage for future use
            localStorage.setItem('solanaPublicKey', keypair.publicKey.toBase58());

            // Redirect to the dashboard
            navigate('/dashboard');
        } catch (err) {
            setError('Error recovering the wallet');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Recover Your Wallet</h1>
            <p className="mb-6">Enter your seed phrase to recover your wallet.</p>

            <textarea
                className="p-4 bg-gray-700 text-white rounded-md mb-4 w-96 h-32"
                placeholder="Enter your 12-word seed phrase"
                value={seedPhrase}
                onChange={(e) => setSeedPhrase(e.target.value)}
            />

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-md"
                onClick={handleRecover}
            >
                Recover Wallet
            </button>

            {publicKey && (
                <div className="mt-6">
                    <p>Public Key: <strong>{publicKey}</strong></p>
                    <p>Balance: <strong>{balance} SOL</strong></p>
                </div>
            )}
        </div>
    );
};

export default RecoverWallet;
