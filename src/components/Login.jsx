import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async () => {
        const user = localStorage.getItem(username);
        if (!user === null) {
            setError('User not found');
            return;
        }
        const { encryptedSeed, iv, salt } = user;
        let decryptedSeed;
        try {
            decryptedSeed = await decryptData(encryptedSeed, iv, salt, password);
        } catch (error) {
            setError("Wrong password");
            return;
        }
        navigate('/dashboard', { state: { password, username } });
    };
    return (
        <div className="min-h-screen bg-[#112240] text-white flex flex-col items-center justify-center p-6">
            <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl text-black font-bold mb-4 text-center">
                    Login to your wallet
                </h1>

                <input
                    type="text"
                    placeholder="Enter username"
                    className="p-2 border border-gray-400 rounded-md w-full mb-4 text-black"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="p-2 border border-gray-400 rounded-md w-full mb-4 text-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <button
                    className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-2 px-6 rounded-md transition w-full"
                    onClick={handleSubmit}
                >
                    SET PASSWORD
                </button>
                <hr />
                <button
                    className="bg-[#8ecae6] hover:bg-[#219ebc] text-black font-bold py-3 px-6 rounded-md transition"
                    onClick={() => navigate('/recover-wallet')}
                >
                    IMPORT WALLET
                </button>
            </div>
        </div>
    );
}

export default Login;
