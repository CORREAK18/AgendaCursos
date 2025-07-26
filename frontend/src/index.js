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
export const formatProfessorData = (professor) => {
    return {
        id: professor.id,
        name: professor.name,
        email: professor.email,
        status: professor.status,
    };
};

export const validateProfessorEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const getStatusLabel = (status) => {
    switch (status) {
        case 'pending':
            return 'Pending Approval';
        case 'active':
            return 'Active';
        case 'denied':
            return 'Denied';
        default:
            return 'Unknown Status';
    }
};
