import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

function MisCursosAlumno() {
    const [cursos, setCursos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [materiales, setMateriales] = useState([]);

    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Cargar cursos del alumno
    const cargarCursos = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/alumno/${jwtDecode(token).id}/cursos`, {
                headers
            });
            const data = await response.json();
            // Asegurarnos de que data sea un array
            setCursos(Array.isArray(data) ? data : []);
            console.log('Datos recibidos:', data); // Para depuración
        } catch (error) {
            console.error('Error al cargar cursos:', error);
            setCursos([]); // En caso de error, establecer un array vacío
        }
    };

    useEffect(() => {
        cargarCursos();
    }, []);

    // Cargar materiales del curso
    const cargarMateriales = async (cursoId) => {
        try {
            console.log('Cargando materiales para el curso:', cursoId);
            const response = await fetch(`http://localhost:5000/api/cursos/${cursoId}/materiales`, {
                headers
            });
            console.log('Respuesta del servidor:', response.status);
            const data = await response.json();
            console.log('Datos de materiales recibidos:', data);
            setMateriales(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al cargar materiales:', error);
            setMateriales([]);
        }
    };

    // Ver detalles del curso
    const handleViewCourse = (curso) => {
        console.log('Curso seleccionado:', curso);
        setSelectedCurso(curso);
        setMateriales([]); // Limpiar materiales anteriores
        setShowModal(true);
        if (curso && curso.IdCurso) {
            console.log('Cargando materiales para el curso ID:', curso.IdCurso);
            cargarMateriales(curso.IdCurso);
        } else {
            console.error('ID del curso no encontrado:', curso);
        }
    };

    // Desinscribirse del curso
    const handleUnenroll = async (cursoId) => {
        if (window.confirm('¿Estás seguro de que deseas desinscribirte de este curso?')) {
            try {
                const userId = jwtDecode(token).id;
                const response = await fetch(`http://localhost:5000/api/alumno/${userId}/curso/${cursoId}`, {
                    method: 'DELETE',
                    headers
                });

                if (response.ok) {
                    cargarCursos();
                } else {
                    const error = await response.json();
                    alert(error.mensaje);
                }
            } catch (error) {
                console.error('Error al desinscribirse del curso:', error);
            }
        }
    };

    return (
        <Container className="mt-4">
            <h2>Mis Cursos</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre del Curso</th>
                        <th>Instructor</th>
                        <th>Horario</th>
                        <th>Fecha de Creación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                                        {Array.isArray(cursos) && cursos.map(inscripcion => (
                        <tr key={inscripcion.Curso.IdCurso}>
                            <td>{inscripcion.Curso.NombreCurso}</td>
                            <td>{inscripcion.Curso.Profesor.NombreCompleto}</td>
                            <td>{inscripcion.Curso.Horario}</td>
                            <td>{new Date(inscripcion.Curso.FechaCreacion).toLocaleDateString()}</td>
                            <td>
                                <Button 
                                    variant="info" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleViewCourse(inscripcion.Curso)}
                                >
                                    Ver Curso
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleUnenroll(inscripcion.Curso.IdCurso)}
                                >
                                    Desinscribirse
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Curso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCurso && (
                        <div>
                            <h5>{selectedCurso.NombreCurso}</h5>
                            <p><strong>Instructor:</strong> {selectedCurso.Profesor.NombreCompleto}</p>
                            <p><strong>Horario:</strong> {selectedCurso.Horario}</p>
                            <p><strong>Fecha de Inicio:</strong> {new Date(selectedCurso.FechaInicio).toLocaleDateString()}</p>
                            <p><strong>Fecha de Fin:</strong> {new Date(selectedCurso.FechaFin).toLocaleDateString()}</p>
                            <p><strong>Fecha de Creación:</strong> {new Date(selectedCurso.FechaCreacion).toLocaleDateString()}</p>
                            <p><strong>Descripción:</strong> {selectedCurso.Descripcion}</p>
                            
                            <hr />
                            <h6>Materiales del Curso:</h6>
                            {materiales.length > 0 ? (
                                <ul className="list-unstyled">
                                    {materiales.map(material => (
                                        <li key={material.IdMaterial} className="mb-2">
                                            <strong>{material.Titulo}</strong><br />
                                            <a href={material.Enlace} target="_blank" rel="noopener noreferrer" className="btn btn-link">
                                                Ver Material
                                            </a>
                                            <small className="text-muted d-block">
                                                Publicado: {new Date(material.FechaPublicacion).toLocaleDateString()}
                                            </small>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">No hay materiales disponibles para este curso.</p>
                            )}
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default MisCursosAlumno;