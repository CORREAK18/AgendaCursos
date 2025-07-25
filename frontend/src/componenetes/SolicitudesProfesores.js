import React, { useEffect, useState } from 'react';
import ModalProfesor from './ModalProfesor';
import './css/SolicitudesProfesores.css';
import axios from 'axios';

const SolicitudesProfesores = () => {
    const [professors, setProfessors] = useState([]);
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);


const cargarProfesores = () => {
  setLoading(true);
  axios.get('/profesores/pendientes')
    .then(response => {
      console.log('Respuesta recibida:', response.data);
      setProfessors(response.data); // Asegúrate de que `setProfessors` sea tu setter de estado
    })
    .catch(error => {
      console.error('Error al obtener profesores:', error);
    })
    .finally(() => {
      setLoading(false);
    });
};

useEffect(() => {
  cargarProfesores();
}, []);

 //   const handleOpenModal = (prof) => {
 //       setSelectedProfessor(prof);
 //       setModalOpen(true);
 //   };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProfessor(null);
    };

    const handleAccept = (id) => {
        fetch(`/api/professors/accept/${id}`, { method: 'POST' })
            .then(() => {
                setProfessors(professors.filter(prof => prof.id !== id));
                handleCloseModal();
            })
            .catch(error => console.error('Error accepting professor:', error));
    };

    const handleReject = (id) => {
        fetch(`/api/professors/reject/${id}`, { method: 'POST' })
            .then(() => {
                setProfessors(professors.filter(prof => prof.id !== id));
                handleCloseModal();
            })
            .catch(error => console.error('Error rejecting professor:', error));
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
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Estado</th>
                        <th>Ver</th>
                    </tr>
                </thead>
                <tbody>
  {professors.length === 0 ? (
    <tr>
      <td colSpan={5} className="text-center">
        No hay solicitudes pendientes
      </td>
    </tr>
  ) : (
    professors.map((prof) => (
      <tr key={prof.id}>
        <td>{prof.id}</td>
        <td>{prof.name}</td>
        <td>{prof.email}</td>
        <td>{prof.estado}</td>
        <td><button>Ver</button></td>
      </tr>
    ))
  )}
</tbody>
          
              
            </table>

            {modalOpen && selectedProfessor && (
                <ModalProfesor
                    professor={selectedProfessor}
                    onClose={handleCloseModal}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />
            )}
        </div>
    );
};

export default SolicitudesProfesores;
