import React from 'react';
import logo from '../assets/logo.png'; // Adjust the path to your logo image
import PropTypes from 'prop-types';
import { FaCog } from 'react-icons/fa'; // Import a settings icon from react-icons

const Header = ({ settings }) => {
  return (
    <header className="bg-[#4e4f51] text-white pt-4 px-8 flex items-center justify-between ">
      <img src={logo} alt="Logo" className="h-20 w-20 mr-4 object-contain" />

      {/* Conditionally render settings icon */}
      {settings && (
        <button
          aria-label="Settings"
          className="text-white hover:text-gray-300"
        >
          <FaCog size={24} />
        </button>
      )}
    </header>
  );
};

Header.propTypes = {
  settings: PropTypes.bool.isRequired,
};

export default Header;
