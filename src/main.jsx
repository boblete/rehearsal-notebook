import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Modal from 'react-modal';
//import { tryLoadAndStartRecorder } from '@alwaysmeticulous/recorder-loader'

Modal.setAppElement('#root');

function isProduction() {
  // TODO: Update me with your production hostname
  return window.location.hostname.indexOf("staging.charanga.com") > -1;
}

async function startApp() {
  // Record all sessions on localhost, staging stacks and preview URLs
  if (!isProduction()) {
    // Start the Meticulous recorder before you initialise your app.
    // Note: all errors are caught and logged, so no need to surround with try/catch
    /*
    await tryLoadAndStartRecorder({
      recordingToken: 'sxCvj1AUekWagHms64xGqgfBxdevZw345VcCa3HY',
      isProduction: false,
    });
    */
  }

  // Initalise app after the Meticulous recorder is ready, e.g.
  createRoot(document.getElementById('root')).render(<StrictMode>
    <App />
  </StrictMode>);
}

startApp()
