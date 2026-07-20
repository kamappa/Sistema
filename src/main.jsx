import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './lib/bus.js'; // window.Bus antes do palco montar (o react.js do palco liga-se)
import './styles/base.css';
import './styles/hud.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
