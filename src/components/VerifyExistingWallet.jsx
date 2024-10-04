import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Keypair, Connection } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';


const VerifyExistingWallet = () => {
    const location = useLocation();
    const { seedPhrase } = location.state; // Get seedPhrase from RecoverWallet
    const [publicKey, setPublicKey] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { connection } = useConnection();


    useEffect(() => {
        const verifyWallet = async () => {
            try {
                //const connection = new Connection('https://api.devnet.solana.com');
                const seed = await bip39.mnemonicToSeed(seedPhrase);
                const keypair = Keypair.fromSeed(seed.slice(0, 32));

                setPublicKey(keypair.publicKey.toString());

                // Check if this public key has any transactions or balance
                const balance = await connection.getBalance(keypair.publicKey);
                if (balance > 0) {
                    // Wallet exists, redirect to dashboard
                    navigate('/dashboard', { state: { publicKey: keypair.publicKey.toString() } });
                } else {
                    setError('Wallet does not exist on the blockchain.');
                }
            } catch (err) {
                setError('Error verifying the wallet.');
            }
        };

        verifyWallet();
    }, [seedPhrase, navigate]);

    return (
        <div className="min-h-screen bg-[#112240] text-white flex flex-col items-center justify-center p-6">
            <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-4">
                <h1 className="text-lg font-bold mb-1 text-center">Verifying Wallet</h1>
                <p className="mb-4 text-gray-600 text-center">Checking the Solana blockchain for an existing wallet.</p>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                {publicKey && <p className="text-green-500 mb-4 text-center">Public Key: {publicKey}</p>}
            </div>
        </div>
    );
};

export default VerifyExistingWallet;
