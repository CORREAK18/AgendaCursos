import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

function ProfesorCursos() {
    const [cursos, setCursos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCurso, setEditingCurso] = useState(null);
    const [formData, setFormData] = useState({
        nombreCurso: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        horario: ''
    });

    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Cargar cursos del profesor
    const cargarCursos = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/profesor/${jwtDecode(token).id}/cursos`, {
                headers
            });
            const data = await response.json();
            setCursos(data);
        } catch (error) {
            console.error('Error al cargar cursos:', error);
        }
    };

    useEffect(() => {
        cargarCursos();
    }, []);

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Abrir modal para crear/editar
    const handleShowModal = (curso = null) => {
        if (curso) {
            setFormData({
                nombreCurso: curso.NombreCurso,
                descripcion: curso.Descripcion || '',
                fechaInicio: curso.FechaInicio,
                fechaFin: curso.FechaFin,
                horario: curso.Horario
            });
            setEditingCurso(curso);
        } else {
            setFormData({
                nombreCurso: '',
                descripcion: '',
                fechaInicio: '',
                fechaFin: '',
                horario: ''
            });
            setEditingCurso(null);
        }
        setShowModal(true);
    };

    // Guardar curso (crear o editar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingCurso 
                ? `http://localhost:5000/api/cursos/${editingCurso.IdCurso}`
                : 'http://localhost:5000/api/cursos';
            
            const method = editingCurso ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowModal(false);
                cargarCursos();
            } else {
                const error = await response.json();
                alert(error.mensaje);
            }
        } catch (error) {
            console.error('Error al guardar curso:', error);
        }
    };

    // Eliminar curso
    const handleDelete = async (cursoId) => {
        if (window.confirm('¿Estás seguro de eliminar este curso?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/cursos/${cursoId}`, {
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
                console.error('Error al eliminar curso:', error);
            }
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Mis Cursos</h2>
                <Button variant="primary" onClick={() => handleShowModal()}>
                    Crear Nuevo Curso
                </Button>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre del Curso</th>
                        <th>Descripción</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Horario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cursos.map(curso => (
                        <tr key={curso.IdCurso}>
                            <td>{curso.NombreCurso}</td>
                            <td>{curso.Descripcion}</td>
                            <td>{new Date(curso.FechaInicio).toLocaleDateString()}</td>
                            <td>{new Date(curso.FechaFin).toLocaleDateString()}</td>
                            <td>{curso.Horario}</td>
                            <td>
                                <Button 
                                    variant="info" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleShowModal(curso)}
                                >
                                    Editar
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleDelete(curso.IdCurso)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingCurso ? 'Editar Curso' : 'Crear Nuevo Curso'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre del Curso</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombreCurso"
                                value={formData.nombreCurso}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Fecha de Inicio</Form.Label>
                            <Form.Control
                                type="date"
                                name="fechaInicio"
                                value={formData.fechaInicio}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Fecha de Fin</Form.Label>
                            <Form.Control
                                type="date"
                                name="fechaFin"
                                value={formData.fechaFin}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Horario</Form.Label>
                            <Form.Control
                                type="text"
                                name="horario"
                                value={formData.horario}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                {editingCurso ? 'Guardar Cambios' : 'Crear Curso'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default ProfesorCursos;
