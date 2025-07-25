import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/detallesolicitud.css';

const DetalleSolicitud = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const solicitud = state?.solicitud;

    if (!solicitud) {
        return <div className="detalle-solicitud-container">No se encontró información de la solicitud</div>;
    }

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleAccion = async (accion) => {
        try {
            await axios.put(
                `http://localhost:5000/api/solicitudes/${solicitud.IdSolicitud}`,
                {
                    estado: accion
                }
            );
            alert(`Solicitud ${accion === 'aceptado' ? 'aceptada' : 'rechazada'} correctamente`);
            navigate('/profesor/solicitudes');
        } catch (err) {
            console.error('Error:', err);
            alert('Error al procesar la solicitud');
        }
    };

    return (
        <div className="detalle-solicitud-container">
            <div className="detalle-solicitud-content">
                <div className="detalle-header">
                    <h2>Detalle de Solicitud</h2>
                    <button className="volver-btn" onClick={() => navigate('/profesor/solicitudes')}>
                        Volver
                    </button>
                </div>
                <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Curso:</span>
                        <span className="info-value">{solicitud.Curso.NombreCurso}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Alumno:</span>
                        <span className="info-value">{solicitud.Alumno.NombreCompleto}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Correo:</span>
                        <span className="info-value">{solicitud.Alumno.Correo}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Teléfono:</span>
                        <span className="info-value">{solicitud.Alumno.Telefono || 'No especificado'}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Distrito:</span>
                        <span className="info-value">{solicitud.Alumno.Distrito || 'No especificado'}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Fecha solicitud:</span>
                        <span className="info-value">{formatearFecha(solicitud.FechaSolicitud)}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Estado actual:</span>
                        <span className={`info-value estado-${solicitud.EstadoSolicitud.toLowerCase()}`}>
                            {solicitud.EstadoSolicitud}
                        </span>
                    </div>
                </div>
                {solicitud.EstadoSolicitud === 'pendiente' && (
                    <div className="actions-container">
                        <button 
                            className="action-btn aceptar-btn"
                            onClick={() => handleAccion('aceptado')}
                        >
                            Aceptar Solicitud
                        </button>
                        <button 
                            className="action-btn denegar-btn"
                            onClick={() => handleAccion('rechazado')}
                        >
                            Denegar Solicitud
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetalleSolicitud;
