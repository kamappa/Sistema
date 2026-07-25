import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './lib/bus.js'; // window.Bus antes do palco montar (o react.js do palco liga-se)
import './lib/fx.js';  // window.Motion + primitivas fx (toast/floatXP/celebrate/…) — Fase 17
import './design-system/tokens/index.css'; // tokens ANTES do hud.css: só definem
import './styles/base.css';                // custom properties --sys-*, não selecionam
import './styles/hud.css';                 // nada; o HUD atual continua a mandar

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
