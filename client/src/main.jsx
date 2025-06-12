import { StrictMode } from 'react';  // Importing React's StrictMode for highlighting potential problems
import { createRoot } from 'react-dom/client'; // Importing ReactDOM's createRoot API for rendering the app
// Importing BrowserRouter from react-router-dom to enable routing
import { BrowserRouter } from "react-router-dom"; // ✅ Step 1 in using React Router

import './css/index.css';
import App from './App.jsx'; // Importing the root App component

// Rendering the app into the root DOM node
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ Wrap the App with <BrowserRouter> to enable routing across the app */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
