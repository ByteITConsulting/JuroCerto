/// <reference types="vite/client" />

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ReactGA from 'react-ga4';

// Initialize Google Analytics 4
// Only initializes if VITE_GOOGLE_ANALYTICS_ID is available (production on GitHub Pages)
// On localhost (dev), GA is disabled - no events are sent to Google
const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
if (gaId) {
  ReactGA.initialize(gaId);
  console.log('[GA] Initialized with Measurement ID:', gaId.slice(0, 5) + '...');
} else {
  console.log('[GA] Tracking disabled - no VITE_GOOGLE_ANALYTICS_ID (localhost dev mode)');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
