import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';

// Function to derive the keypair from seed using the Solana derivation path
export const deriveKeypairFromSeed = (seedPhrase) => {
    const seed = bip39.mnemonicToSeedSync(seedPhrase); // Convert mnemonic to seed
    const derivationPath = "m/44'/501'/0'/0'"; // Solana's default derivation path

    const derivedSeed = derivePath(derivationPath, seed).key;
    const keypair = Keypair.fromSeed(derivedSeed); // Generate Keypair from derived seed
    return keypair;
};

