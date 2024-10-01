import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../images/hd.png'; // Ensure logo path is correct

const Home = () => {
    const navigate = useNavigate();
    const createWalletRef = useRef(null);

    // State to control the fading effect
    const [showFirstSection, setShowFirstSection] = useState(true); // Track visibility of the first section
    const [fadeOut, setFadeOut] = useState(false); // Trigger fade-out

    useEffect(() => {
        // Trigger fade out after 3 seconds
        const fadeTimeout = setTimeout(() => {
            setFadeOut(true); // Start fading out the first section
        }, 3000); // Time before fading out starts

        // Remove the first section after fade-out is complete
        const removeTimeout = setTimeout(() => {
            setShowFirstSection(false); // Hide the first section completely
        }, 5000); // 2 seconds after fade-out starts

        return () => {
            clearTimeout(fadeTimeout);
            clearTimeout(removeTimeout);
        };
    }, []);

    return (
        <div className="min-h-screen text-white">
            {/* Full-Screen Background Section with fade-out effect */}
            {showFirstSection && (
                <div
                    className={`h-screen w-full flex flex-col items-center justify-center transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    {/* Content in the first section */}
                </div>
            )}

            {/* Main Content Section with buttons */}
            {!showFirstSection && (
                <div
                    ref={createWalletRef}
                    className="min-h-screen flex flex-col items-center justify-center transition-opacity duration-1000 opacity-100"
                    style={{
                        backgroundColor: "#2b2c2e", // Set background color for the content section
                    }}
                >
                    {/* Logo and Header Section */}
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-5xl font-bold mb-4 text-center animate-fade-in">
                            Already have a wallet?
                        </h1>
                        <button
                            className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white font-bold py-4 px-8 rounded-full text-lg transition transform hover:scale-105"
                            onClick={() => navigate('/login')}
                        >
                            ACCESS YOUR WALLET
                        </button>
                    </div>

                    {/* Create New Wallet Section */}
                    <div className="flex flex-col items-center justify-center mt-20">
                        <h1 className="text-5xl font-bold mb-4 text-center animate-fade-in">
                            New here?
                        </h1>
                        <button
                            className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white font-bold py-4 px-8 rounded-full text-lg transition transform hover:scale-105"
                            onClick={() => navigate('/create-wallet')}
                        >
                            CREATE A NEW WALLET
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
