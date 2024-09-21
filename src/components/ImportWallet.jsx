import React, { useState } from 'react';
import * as bip39 from 'bip39';
import { Keypair, Connection, clusterApiUrl } from '@solana/web3.js';

const ImportWallet = () => {
    const [seedPhrase, setSeedPhrase] = useState('');
    const [publicKey, setPublicKey] = useState(null);
    const [error, setError] = useState('');

    // Handle when user submits the seed phrase
    const handleSubmit = async () => {
        try {
            // Validate the seed phrase using bip39
            if (!bip39.validateMnemonic(seedPhrase)) {
                setError('Invalid seed phrase');
                return;
            }

            // Derive seed from the mnemonic
            const seed = await bip39.mnemonicToSeed(seedPhrase.trim());

            // Derive the keypair from the first 32 bytes of the seed
            const keypair = Keypair.fromSeed(seed.slice(0, 32));

            // Store the public key in the state to display it
            setPublicKey(keypair.publicKey.toString());

            // You can now use the `keypair` to sign transactions and interact with Solana!
            console.log("Wallet successfully imported!");
        } catch (error) {
            console.error('Error importing wallet:', error);
            setError('Failed to import wallet. Please check the seed phrase.');
        }
    };

    return (
        <div>
            <h2>Import Wallet from Seed Phrase</h2>
            <textarea
                value={seedPhrase}
                onChange={(e) => setSeedPhrase(e.target.value)}
                placeholder="Enter your seed phrase"
                rows={4}
                cols={50}
            />
            <button onClick={handleSubmit}>Import Wallet</button>

            {publicKey && (
                <div>
                    <h3>Your Wallet Public Key:</h3>
                    <p>{publicKey}</p>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ImportWallet;
