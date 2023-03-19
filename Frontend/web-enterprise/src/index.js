//import từ thư viện bên ngoài
import React from 'react';
import ReactDOM from 'react-dom/client';

//import từ bên trong src
import App from './App';
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App/>
  /* </React.StrictMode> */
);