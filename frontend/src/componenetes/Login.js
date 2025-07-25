import axios from 'axios';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import "../componenetes/css/Login.css";

const Login = () => {
    const [correo, setcorreo] = useState('');
    const [contrasena, setcontrasena] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        try {
            const response = await axios.post('http://localhost:5000/login', {
                correo,
                contrasena
            });
            
            localStorage.setItem('token', response.data.token);
            window.location.href = "/inicio";
        } catch (error) {
            alert(error.response?.data?.mensaje || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="container">
            <div className="imagen-login">
                <img src='./imagenes/escuelaii.jpg' alt='Imagen en login' />
            </div>
            <div className="form-section">
                <h3 className="login-title">Iniciar Sesión</h3>
                <Form className="login-form" onSubmit={handleLogin}>
                    <div className="custom-form-group">
                        <label htmlFor="correo" className="custom-label">
                            Nombre de Usuario
                        </label>
                        <input
                            type='text'
                            id="correo"
                            name='correo'
                            className='custom-input'
                            value={correo}
                            onChange={(e) => setcorreo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="custom-form-group">
                        <label htmlFor="password" className="custom-label">
                            contrasena
                        </label>
                        <input
                            type='password'
                            id="password"
                            name='contrasena'
                            className='custom-input'
                            value={contrasena}
                            onChange={(e) => setcontrasena(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="custom-button">
                        Iniciar Sesión
                    </button>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <a href="/registro" style={{ textDecoration: 'none', display: 'inline-block' }}>
                            Registrarte
                        </a>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;