import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkProvider } from "@clerk/clerk-react";

// For Create React App, use process.env instead of import.meta.env
const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Make sure we have a publishable key
if (!publishableKey) {
  throw new Error("Missing Publishable Key")
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
