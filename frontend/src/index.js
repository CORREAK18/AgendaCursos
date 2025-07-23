import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
//import App from './componentes/Header';
import Rutas from './componenetes/Rutas';
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Rutas />
  </React.StrictMode>
);
