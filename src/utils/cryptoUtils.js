// cryptoUtils.js

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

    // Convert ArrayBuffers to Uint8Array and return salt, iv, and encrypted data
    return {
        encryptedData: Array.from(new Uint8Array(encryptedData)),
        iv: Array.from(iv),
        salt: Array.from(salt)  // Include salt in the output
    };
}

// Decrypt the seed phrase
export async function decryptData(encryptedData, iv, salt, password) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Derive key from password using the same salt
    const keyMaterial = await getKeyMaterial(password);
    const key = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: new Uint8Array(salt),  // Use the retrieved salt
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
    );

    // Decrypt the seed phrase
    const decrypted = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: new Uint8Array(iv), // Convert IV to Uint8Array
        },
        key,
        new Uint8Array(encryptedData) // Convert encryptedData to Uint8Array
    );

    // Convert the decrypted data back to string
    return decoder.decode(decrypted);
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
