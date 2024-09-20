// Import necessary modules
import React from 'react'; // Ensure React is imported for JSX syntax
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Import Buffer for compatibility with certain packages like solana/web3.js
import { Buffer } from 'buffer';

// Check if Buffer is already defined, and if not, define it for the window object
if (!window.Buffer) {
  window.Buffer = Buffer;
}

// Render the React application in strict mode
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);