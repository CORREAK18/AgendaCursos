import React, { useEffect, useState } from 'react';
import './css/SolicitudesProfesores.css';
import axios from 'axios';

const SolicitudesProfesores = () => {
    const [professors, setProfessors] = useState([]);
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cargarProfesores = () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        axios.get('http://localhost:5000/profesores/pendientes', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setProfessors(response.data.profesores);
        })
        .catch(error => {
            setError('Error al cargar los profesores. Por favor, intente nuevamente.');
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const handleOpenModal = (prof) => {
        setSelectedProfessor(prof);
        setModalOpen(true);
    };

    useEffect(() => {
        cargarProfesores();
    }, []);

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProfessor(null);
    };

    const handleAccept = (id) => {
        const token = localStorage.getItem('token');
        axios.put(`http://localhost:5000/api/usuarios/${id}/estado`, 
            { estado: 'activo' },
            { headers: { 'Authorization': `Bearer ${token}` } }
        )
        .then(() => {
            setProfessors(professors.filter(prof => prof.IdUsuario !== id));
            handleCloseModal();
            alert('Profesor activado exitosamente');
        })
        .catch(error => {
            alert('Error al activar al profesor');
        });
    };

    const handleReject = (id) => {
        const token = localStorage.getItem('token');
        axios.put(`http://localhost:5000/api/usuarios/${id}/estado`,
            { estado: 'rechazado' },
            { headers: { 'Authorization': `Bearer ${token}` } }
        )
        .then(() => {
            setProfessors(professors.filter(prof => prof.IdUsuario !== id));
            handleCloseModal();
            alert('Profesor rechazado');
        })
        .catch(error => {
            alert('Error al rechazar al profesor');
        });
    };

    return (
        <div className="solicitudes-container">
            <div className="solicitudes-header">
                <h2>Solicitudes de Profesores</h2>
                <button
                    className="btn-outline-green"
                    onClick={cargarProfesores}
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : 'Actualizar'}
                </button>
            </div>

            <table className="table table-bordered table-striped mt-3">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Distrito</th>
                        <th>Fecha Registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {professors.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center">
                                No hay solicitudes pendientes
                            </td>
                        </tr>
                    ) : (
                        professors.map((prof) => (
                            <tr key={prof.IdUsuario}>
                                <td>{prof.IdUsuario}</td>
                                <td>{prof.NombreCompleto}</td>
                                <td>{prof.Correo}</td>
                                <td>{prof.Telefono || 'No disponible'}</td>
                                <td>{prof.Distrito || 'No disponible'}</td>
                                <td>{new Date(prof.FechaRegistro).toLocaleDateString()}</td>
                                <td>
                                    <button 
                                        className="btn btn-info me-2"
                                        onClick={() => handleOpenModal(prof)}
                                    >
                                        Ver Solicitud
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    {error}
                </div>
            )}

            {modalOpen && selectedProfessor && (
                <>
                    {/* Modal */}
                    <div className="modal show d-block custom-modal" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Solicitud de Profesor</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="card">
                                        <div className="card-body">
                                            <h6 className="card-subtitle mb-2 text-muted">Información Personal</h6>
                                            <p><strong>Nombre:</strong> {selectedProfessor.NombreCompleto}</p>
                                            <p><strong>Correo:</strong> {selectedProfessor.Correo}</p>
                                            <p><strong>Teléfono:</strong> {selectedProfessor.Telefono || 'No disponible'}</p>
                                            <p><strong>Distrito:</strong> {selectedProfessor.Distrito || 'No disponible'}</p>
                                            <p><strong>Fecha de Registro:</strong> {new Date(selectedProfessor.FechaRegistro).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary me-2" onClick={() => handleAccept(selectedProfessor.IdUsuario)}>
                                        Aceptar Solicitud
                                    </button>
                                    <button type="button" className="btn btn-danger me-2" onClick={() => handleReject(selectedProfessor.IdUsuario)}>
                                        Rechazar Solicitud
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Backdrop */}
                    <div className="modal-backdrop show"></div>
                </>
            )}
        </div>
    );
};

export default SolicitudesProfesores;
