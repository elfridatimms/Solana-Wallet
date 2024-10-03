import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { decryptData } from '../utils/cryptoUtils'; // Adjust the path based on your folder structure
import { FaTimes } from 'react-icons/fa'; // Import the close (X) icon

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        // Retrieve user data from localStorage
        const user = localStorage.getItem(username);
        console.log("User from localStorage:", user); // Debugging

        if (user === null) {
            setError('User not found');
            return;
        }

        // Parse user data
        let userData;
        try {
            userData = JSON.parse(user);
            console.log("Parsed user data:", userData); // Debugging
        } catch (parseError) {
            setError('Failed to parse user data.');
            console.error('JSON Parse Error:', parseError);
            return;
        }

        const { encryptedSeed, iv, salt } = userData;
        console.log("Encrypted Seed:", encryptedSeed);
        console.log("IV:", iv);
        console.log("Salt:", salt);

        // Decrypt the seed
        let decryptedSeed;
        try {
            decryptedSeed = await decryptData(encryptedSeed, iv, salt, password);
            console.log("Decrypted seed:", decryptedSeed); // Debugging
        } catch (error) {
            console.error("Decryption failed:", error);
            setError("Wrong password");
            return;
        }

        // Navigate to the dashboard securely
        navigate('/dashboard', { state: { username, password } });
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
                    Login to your wallet
                </h1>

                <input
                    type="text"
                    placeholder="Enter username"
                    className="p-2 border border-gray-600 rounded-md w-full mb-4 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#8ecae6]"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="p-2 border border-gray-600 rounded-md w-full mb-4 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#8ecae6]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                {/* Submit Button */}
                <button
                    className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded-full text-md transition w-full font-sans"
                    onClick={handleSubmit}
                >
                    LOGIN
                </button>

                <hr className="my-4" />

                <button
                    className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-4 rounded-full text-md transition w-full font-sans"
                    onClick={() => navigate('/recover-wallet')}
                >
                    IMPORT WALLET
                </button>
            </div>
        </div>
    );
}

export default Login;
