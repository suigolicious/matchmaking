import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App.tsx';

const rootElement = document.getElementById('root')!;  // ✅ Add '!'
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
