import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeed } from './SeedContextProvider';
import { encryptSeed } from './RecoverWallet';
import { FaTimes } from 'react-icons/fa'; // Import the close (X) icon

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
        <div className="min-h-screen bg-gradient-to-b from-[#1a1b1d] to-[#3e3f43] text-white flex flex-col items-center justify-center p-6">

            <div className="relative max-w-sm w-full bg-[#2c2d30] rounded-lg shadow-lg p-6">

                {/* X button for closing the form */}
                <button
                    className="absolute top-2 left-2 text-white text-lg"
                    onClick={() => navigate('/')}
                >
                    <FaTimes />
                </button>

                <h1 className="text-2xl font-bold mb-4 text-center tracking-0.5">
                    Set Up Your Wallet Password
                </h1>

                <input
                    type="username"
                    placeholder="Enter username"
                    className="p-2 border border-gray-600 rounded-md w-full mb-4 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#8ecae6]"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter password"
                    className="p-2 border border-gray-600 rounded-md w-full mb-4 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#8ecae6]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm password"
                    className="p-2 border border-gray-600 rounded-md w-full mb-4 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#8ecae6]"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                {/* Submit Button */}
                <button
                    className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded-full text-md transition w-full font-sans"
                    onClick={handleSubmit}
                >
                    SET PASSWORD
                </button>
            </div>
        </div>
    );
};

export default PasswordSetup;
