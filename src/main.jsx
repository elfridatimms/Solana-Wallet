// Import necessary modules
import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Only polyfill Buffer if needed (this might be unnecessary now with Vite)
import { Buffer } from 'buffer';
if (!window.Buffer) {
  window.Buffer = Buffer;
}

// Render the React application in strict mode
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
