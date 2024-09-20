// src/components/PasswordSetup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PasswordSetup = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Store password securely (Note: never store in plaintext in production!)
        localStorage.setItem('walletPassword', password);

        // Redirect to the dashboard after password setup
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#112240] text-white flex flex-col items-center justify-center p-6">
            <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">Set Up Your Wallet Password</h1>

                <input
                    type="password"
                    placeholder="Enter password"
                    className="p-2 border border-gray-400 rounded-md w-full mb-4 text-black"  // Dodali smo text-black klasu
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm password"
                    className="p-2 border border-gray-400 rounded-md w-full mb-4 text-black"  // Dodali smo text-black klasu
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
