import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeed } from './SeedContextProvider';
import { encryptSeed } from './RecoverWallet';

const PasswordSetup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [seed] = useSeed();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        let user = localStorage.getItem(username);
        if (user !== null) {
            setError("Username is already taken");
            return;
        }
        const { encryptedData, iv, salt } = await encryptSeed(seed, password);
        const newUser = {
            iv: Array.from(iv),
            salt: Array.from(salt),
            encryptedSeed: Array.from(new Uint8Array(encryptedData))
        }

        localStorage.setItem(username, JSON.stringify(newUser));

        navigate('/dashboard', { state: { password, username } });
    };

    return (
        <div className="min-h-screen bg-[#112240] text-white flex flex-col items-center justify-center p-6">
            <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Set Up Your Wallet Password
                </h1>

                <input
                    type="username"
                    placeholder="Enter username"
                    className="p-2 border border-gray-400 rounded-md w-full mb-4 text-black"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter password"
                    className="p-2 border border-gray-400 rounded-md w-full mb-4 text-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm password"
                    className="p-2 border border-gray-400 rounded-md w-full mb-4 text-black"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <button
                    className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-6 rounded-md transition w-full"
                    onClick={handleSubmit}
                >
                    SET PASSWORD
                </button>
            </div>
        </div>
    );
};

export default PasswordSetup;
