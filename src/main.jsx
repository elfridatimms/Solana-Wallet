// Import necessary modules
import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Ensure Buffer is polyfilled for certain packages like solana/web3.js
import { Buffer } from 'buffer';
if (!window.Buffer) {
  window.Buffer = Buffer;
}

// Import Transform from stream-browserify (ensure it is correctly aliased in Vite)
import { Transform } from 'stream-browserify';
const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk);
  }
});

// Polyfill process for browser environments
import process from 'process';
if (!window.process) {
  window.process = process;
}

// Import and polyfill util module for browser compatibility
import util from 'util';
if (!window.util) {
  window.util = util;
}

// Polyfill crypto for browser (using crypto-browserify)
import crypto from 'crypto-browserify';
if (!window.crypto) {
  window.crypto = crypto;
}

// Render the React application in strict mode
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
