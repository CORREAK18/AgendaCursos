import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './css/solicitudesalumnos.css';

const SolicitudesAlumnos = () => {
    const navigate = useNavigate();
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    const cargarSolicitudes = async () => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const response = await axios.get(
                `http://localhost:5000/api/profesor/${decodedToken.id}/solicitudes`
            );

            setSolicitudes(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setError('Error al cargar las solicitudes');
            setLoading(false);
        }
    };

    const verDetalleSolicitud = (solicitud) => {
        navigate('/profesor/solicitud/detalle', { state: { solicitud } });
    };

    if (loading) return <div className="solicitudes-container">Cargando solicitudes...</div>;
    if (error) return <div className="solicitudes-container">Error: {error}</div>;

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="solicitudes-container">
            <h2>Solicitudes de Alumnos</h2>
            {solicitudes.length === 0 ? (
                <div className="empty-state">
                    <p>No hay solicitudes pendientes</p>
                </div>
            ) : (
                <table className="solicitudes-table">
                    <thead>
                        <tr>
                            <th>Curso</th>
                            <th>Alumno</th>
                            <th>Fecha de Solicitud</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitudes.map((solicitud) => (
                            <tr key={solicitud.IdSolicitud}>
                                <td>{solicitud.Curso.NombreCurso}</td>
                                <td>{solicitud.Alumno.NombreCompleto}</td>
                                <td>{formatearFecha(solicitud.FechaSolicitud)}</td>
                                <td>
                                    <span className={`estado-${solicitud.EstadoSolicitud.toLowerCase()}`}>
                                        {solicitud.EstadoSolicitud}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        className="ver-btn"
                                        onClick={() => verDetalleSolicitud(solicitud)}
                                    >
                                        Ver
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SolicitudesAlumnos;
