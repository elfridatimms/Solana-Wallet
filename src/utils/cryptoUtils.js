// cryptoUtils.js

// Encrypt the seed phrase
export async function encryptSeed(seedPhrase, password) {
    try {
        const encoder = new TextEncoder();

        // Derive key from password
        let keyMaterial;
        try {
            keyMaterial = await getKeyMaterial(password);
        } catch (error) {
            console.error('Error during key material derivation:', error);
            throw new Error('Failed to derive key material from password.');
        }

        let salt;
        try {
            salt = window.crypto.getRandomValues(new Uint8Array(16)); // Generate a random salt
        } catch (error) {
            console.error('Error generating salt:', error);
            throw new Error('Failed to generate salt.');
        }

        let key;
        try {
            key = await window.crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256',
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt']
            );
        } catch (error) {
            console.error('Error deriving key:', error);
            throw new Error('Failed to derive key.');
        }

        // Encode seed phrase
        let seedBuffer;
        try {
            seedBuffer = encoder.encode(seedPhrase);
        } catch (error) {
            console.error('Error encoding seed phrase:', error);
            throw new Error('Failed to encode seed phrase.');
        }

        // Create initialization vector (IV) for AES-GCM
        let iv;
        try {
            iv = window.crypto.getRandomValues(new Uint8Array(12));
        } catch (error) {
            console.error('Error generating IV:', error);
            throw new Error('Failed to generate IV.');
        }

        // Encrypt the seed phrase
        let encryptedData;
        try {
            encryptedData = await window.crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv,
                },
                key,
                seedBuffer
            );
        } catch (error) {
            console.error('Error during encryption:', error);
            throw new Error('Failed to encrypt the seed phrase.');
        }

        // Convert ArrayBuffers to Uint8Array and return salt, iv, and encrypted data
        return {
            encryptedData: Array.from(new Uint8Array(encryptedData)),
            iv: Array.from(iv),
            salt: Array.from(salt), // Include salt in the output
        };
    } catch (error) {
        console.error('Error during seed encryption:', error);
        throw new Error('Failed to encrypt the seed phrase.');
    }
}

/**
FIXME decrypt seed method is not returning space delimited
but it is returnin comma delimited string
or it can return Array<Uint8>
Decrypt the seed phrase */
export async function decryptData(encryptedData, iv, salt, password) {
    try {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        // Derive key from password using the same salt
        let keyMaterial;
        try {
            keyMaterial = await getKeyMaterial(password);
        } catch (error) {
            console.error('Error deriving key material:', error);
            throw new Error('Failed to derive key material.');
        }

        let key;
        try {
            key = await window.crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: new Uint8Array(salt), // Use the retrieved salt
                    iterations: 100000,
                    hash: 'SHA-256',
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            );
        } catch (error) {
            console.error('Error deriving key for decryption:', error);
            throw new Error('Failed to derive key for decryption.');
        }

        // Decrypt the seed phrase
        let decrypted;
        try {
            decrypted = await window.crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: new Uint8Array(iv), // Convert IV to Uint8Array
                },
                key,
                new Uint8Array(encryptedData) // Convert encryptedData to Uint8Array
            );
        } catch (error) {
            console.error('Error during decryption:', error, " for iv: ", iv, " for encrypted data: ", encryptedData, " key: ", key);
            throw new Error('Failed to decrypt the seed phrase.');
        }

        // Convert the decrypted data back to string
        let decodedData;
        try {
            decodedData = decoder.decode(decrypted);
        } catch (error) {
            console.error('Error decoding decrypted data:', error);
            throw new Error('Failed to decode decrypted data.');
        }

        return decodedData;
    } catch (error) {
        console.error('Error during seed decryption:', error);
        throw new Error('Failed to decrypt the seed phrase.');
    }
}

// Helper function to derive the key from a password
async function getKeyMaterial(password) {
    try {
        const encoder = new TextEncoder();
        return await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );
    } catch (error) {
        console.error('Error deriving key material from password:', error);
        throw new Error('Failed to derive key material.');
    }
}
