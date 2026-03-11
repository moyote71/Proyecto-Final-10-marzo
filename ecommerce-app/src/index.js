import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./components/App/App";
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import reportWebVitals from './reportWebVitals';

// Detecta preferencia del sistema ANTES de que cargue el app
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
