import React from 'react';
import logo from '../assets/cropped.png';

const Footer = () => {
    return (
        <footer className="bg-[#1a1b1d] text-white py-10">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Section - Logo and Copyright */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <img
                        src={logo} // Ensure this path is correct
                        alt="Solara Logo"
                        className="h-12 mb-4"
                    />
                    <p className="text-sm text-gray-400">Copyright ©2024 Solara</p>
                </div>

                {/* Center Section - Resources */}
                <div className="text-center md:text-left">
                    <h3 className="text-lg font-bold">Resources</h3>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">About</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Terms</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Privacy</a></li>
                    </ul>
                </div>

                {/* Right Section - Social */}
                <div className="text-center md:text-left">
                    <h3 className="text-lg font-bold">Social</h3>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Twitter</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">YouTube</a></li>
                    </ul>
                </div>
            </div>


        </footer>
    );
};

export default Footer;
