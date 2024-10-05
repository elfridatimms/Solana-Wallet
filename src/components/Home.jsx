import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; // Assuming you already have the Header component
import logo from '../assets/cropped.webp'; // Adjust the path based on where you saved the image
import Faq from './Faq';
import Footer from './Footer';

const Home = () => {
    const navigate = useNavigate();
    const [showFaq, setShowFaq] = useState(false); // State to toggle FAQ visibility

    const toggleFaq = () => {
        setShowFaq(prevShowFaq => !prevShowFaq);
    };

    useEffect(() => {
        const scrollElements = document.querySelectorAll('.animate-on-scroll');

        const elementInView = (el, dividend = 1) => {
            const elementTop = el.getBoundingClientRect().top;
            return (
                elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
            );
        };

        const displayScrollElement = (element) => {
            element.classList.add('visible');
        };

        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                if (elementInView(el, 1.25)) {
                    displayScrollElement(el);
                }
            });
        };

        window.addEventListener('scroll', handleScrollAnimation);

        return () => {
            window.removeEventListener('scroll', handleScrollAnimation);
        };
    }, []);

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-[#1a1b1d] to-[#3e3f43] text-white flex flex-col items-center justify-center p-6">
                {/* Header */}
                <div>
                    {/* Hero Section */}
                    <section className="min-h-screen flex flex-col items-center justify-center text-center">
                        <div className="flex flex-col items-center justify-center">
                            <img src={logo} alt="Solara Logo" className="mb-6 w-40 h-40 object-contain" />
                            <h1 className="text-6xl font-bold mb-6">Effortless Crypto with Solara</h1>
                            <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
                                A simple and secure Solana wallet to manage your digital assets with ease. Join us today!
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    className="bg-[#8ecae6] text-black font-bold py-4 px-8 rounded-md text-lg hover:scale-105 transition"
                                    onClick={() => navigate('/create-wallet')}
                                >
                                    Create New Wallet
                                </button>
                                <button
                                    className="bg-[#8ecae6] text-black font-bold py-4 px-8 rounded-md text-lg hover:scale-105 transition"
                                    onClick={() => navigate('/login')}
                                >
                                    Access Your Wallet
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-12 bg-[#3d3f43] px-6">
                        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-[#2c2d30] p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
                                <h2 className="text-3xl font-bold mb-4 text-white hover:text-[#00d0c6] transition-colors duration-200">Manage Your Tokens</h2>
                                <p className="text-gray-300">
                                    Easily view and manage your Solana-based tokens in a simple, intuitive interface.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-[#2c2d30] p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
                                <h2 className="text-3xl font-bold mb-4 text-white hover:text-[#00d0c6] transition-colors duration-200">Secure and Private</h2>
                                <p className="text-gray-300">
                                    Your security is our top priority. We ensure your private keys are never exposed.
                                </p>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Toggle FAQ Button */}
                <div className="text-center my-10">
                    <button
                        className="bg-[#8ecae6] text-black font-bold py-2 px-6 rounded-md text-lg hover:scale-105 transition mt-10 mb-1"
                        onClick={toggleFaq}
                    >
                        {showFaq ? 'Hide FAQ' : 'Need help?'}  {/* Toggle Button Text */}
                    </button>
                </div>

                {/* Conditionally Render FAQ Section */}
                {showFaq && <Faq />} {/* Show the FAQ section if `showFaq` is true */}

                {/* "Still have questions?" text and Get in touch button */}
                <div className="text-center mt-6 mb-10">
                    <p className="text-gray-400 mb-4">Still have questions?</p>
                    <button className="bg-[#8ecae6] text-black font-bold py-2 px-6 rounded-md text-lg hover:scale-105 transition mb-7">
                        Get in touch
                    </button>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default Home;
