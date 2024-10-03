import React from 'react';
import logo from '../assets/logo.png'; // Adjust the path to your logo image
import PropTypes from 'prop-types';
import { FaCog } from 'react-icons/fa'; // Import a settings icon from react-icons

const Header = ({ settings,onSettingsClick }) => {
    let headerClasses = "text-white pt-4 px-8 flex items-center justify-between "

    if(settings){
        headerClasses += "bg-[#1a1b1d]";
    }else{
        headerClasses+= "bg-[#4e4f51]";
    }

  return (
    <header className={headerClasses}>
      <img src={logo} alt="Logo" className="h-20 w-20 mr-4 object-contain" />

      {/* Conditionally render settings icon */}
      {settings && (
        <button
          aria-label="Settings"
          className="text-white hover:text-gray-300"
          onClick={onSettingsClick}
        >
          <FaCog size={24} />
        </button>
      )}
    </header>
  );
};

Header.propTypes = {
  settings: PropTypes.bool.isRequired,
  onSettingsClick: PropTypes.func
};

export default Header;
