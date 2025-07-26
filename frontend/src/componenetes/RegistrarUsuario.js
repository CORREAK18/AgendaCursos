import React, { useState } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './css/registro.css';

const RegistrarUsuario = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        telefono: '',
        distrito: '',
        tipo: 'alumno'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validaciones
        if (formData.contrasena !== formData.confirmarContrasena) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/registro', {
                nombreCompleto: formData.nombreCompleto,
                correo: formData.correo,
                contrasena: formData.contrasena,
                telefono: formData.telefono,
                distrito: formData.distrito,
                tipo: formData.tipo
            });

            setSuccess(response.data.mensaje);
            
            // Esperar 2 segundos antes de redirigir
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al registrar usuario');
        }
    };

    return (
        <div className="registro-container">
            <div className="registro-form">
                <h2 className="registro-title">Registro de Usuario</h2>
                <Form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nombre Completo</label>
                        <input
                            type="text"
                            name="nombreCompleto"
                            className="form-input"
                            value={formData.nombreCompleto}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Correo Electrónico</label>
                        <input
                            type="email"
                            name="correo"
                            className="form-input"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            name="contrasena"
                            className="form-input"
                            value={formData.contrasena}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirmar Contraseña</label>
                        <input
                            type="password"
                            name="confirmarContrasena"
                            className="form-input"
                            value={formData.confirmarContrasena}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Teléfono</label>
                        <input
                            type="tel"
                            name="telefono"
                            className="form-input"
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Distrito</label>
                        <input
                            type="text"
                            name="distrito"
                            className="form-input"
                            value={formData.distrito}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tipo de Usuario</label>
                        <select
                            name="tipo"
                            className="form-select"
                            value={formData.tipo}
                            onChange={handleChange}
                            required
                        >
                            <option value="alumno">Alumno</option>
                            <option value="profesor">Profesor</option>
                        </select>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" className="registro-button">
                        Registrarse
                    </button>
                </Form>
            </div>
        </div>
    );
};

export default RegistrarUsuario;
