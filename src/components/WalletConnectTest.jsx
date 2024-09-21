import { useEffect } from 'react';

const WalletConnectTest = () => {
    useEffect(() => {
        // Check if Phantom is installed
        if (window.solana && window.solana.isPhantom) {
            console.log('Phantom wallet is installed');

            // Try to connect to the wallet
            window.solana.connect({ onlyIfTrusted: true })
                .then((response) => {
                    console.log('Wallet connected:', response.publicKey.toString());
                })
                .catch((err) => {
                    console.error('Failed to connect to Phantom wallet:', err);
                });
        } else {
            console.log('Phantom wallet not installed');
        }
    }, []);

    return <div>Check console for wallet status</div>;
};

export default WalletConnectTest;
