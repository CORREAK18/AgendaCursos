import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import './css/gestionusuarios.css';

function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null);

    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Cargar usuarios
    const cargarUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/usuarios', {
                headers: headers
            });
            if (!response.ok) throw new Error('Error al cargar usuarios');
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            setError('Error al cargar la lista de usuarios');
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    // Función para cambiar el estado de la cuenta
    const cambiarEstadoCuenta = async (usuarioId, nuevoEstado) => {
        try {
            const response = await fetch(`http://localhost:5000/api/usuarios/${usuarioId}/estado`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({
                    estado: nuevoEstado
                })
            });

            if (!response.ok) throw new Error('Error al actualizar estado');

            setMensaje(nuevoEstado === 'activo' 
                ? 'Usuario activado exitosamente' 
                : 'Usuario suspendido exitosamente');
            
            // Recargar la lista de usuarios
            cargarUsuarios();

            // Limpiar el mensaje después de 3 segundos
            setTimeout(() => setMensaje(null), 3000);

        } catch (error) {
            setError('Error al actualizar el estado del usuario');
            console.error('Error:', error);
        }
    };

    const getEstadoDisplayText = (estado) => {
        switch (estado) {
            case 'activo': return 'Activo';
            case 'rechazado': return 'Suspendido';
            case 'pendiente': return 'Pendiente';
            default: return estado;
        }
    };

    const getEstadoClassName = (estado) => {
        switch (estado) {
            case 'activo': return 'status-activo';
            case 'rechazado': return 'status-suspendido';
            case 'pendiente': return 'status-pendiente';
            default: return '';
        }
    };

    return (
        <div className="gestion-usuarios-container">
            <div className="gestion-usuarios-header">
                <h2 className="gestion-usuarios-title">Gestión de Usuarios</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {mensaje && <Alert variant="success">{mensaje}</Alert>}

            <Table className="usuarios-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Teléfono</th>
                        <th>Distrito</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => (
                        <tr key={usuario.IdUsuario}>
                            <td>{usuario.NombreCompleto}</td>
                            <td>{usuario.Correo}</td>
                            <td>{usuario.Rol?.NombreRol}</td>
                            <td>{usuario.Telefono || '-'}</td>
                            <td>{usuario.Distrito || '-'}</td>
                            <td>
                                <span className={`status-badge ${getEstadoClassName(usuario.EstadoCuenta)}`}>
                                    {getEstadoDisplayText(usuario.EstadoCuenta)}
                                </span>
                            </td>
                            <td className="action-buttons">
                                {usuario.EstadoCuenta !== 'activo' && (
                                    <Button
                                        className="activate-btn"
                                        onClick={() => cambiarEstadoCuenta(usuario.IdUsuario, 'activo')}
                                    >
                                        Activar
                                    </Button>
                                )}
                                {usuario.EstadoCuenta === 'activo' && (
                                    <Button
                                        className="suspend-btn"
                                        onClick={() => cambiarEstadoCuenta(usuario.IdUsuario, 'rechazado')}
                                    >
                                        Suspender
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default GestionUsuarios;
