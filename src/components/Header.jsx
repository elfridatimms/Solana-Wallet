import React from 'react';
import logo from '../assets/logo.png'; // Adjust the path to your logo image

const Header = () => {
  return (
    <header className="bg-[#4e4f51] text-white pt-4 px-8 flex items-center border-b-[0.5] border-b-slate-50">
      <img src={logo} alt="Logo" className="h-20 w-20 mr-4 object-contain" />
    </header>
  );
};

export default Header;
