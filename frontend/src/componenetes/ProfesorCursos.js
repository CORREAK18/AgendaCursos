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

    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedCursoId, setSelectedCursoId] = useState(null);
    const [viewCurso, setViewCurso] = useState(null);
    const [materiales, setMateriales] = useState([]);
    const [materialData, setMaterialData] = useState({ titulo: '', enlace: '' });
    const [editingMaterial, setEditingMaterial] = useState(null);

    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const cargarCursos = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/profesor/${jwtDecode(token).id}/cursos`, {
                headers
            });
            
            if (!response.ok) {
                const error = await response.json();
                console.error("Error al cargar cursos:", error);
                alert(error.mensaje || "Error al cargar cursos");
                return;
            }

            const data = await response.json();
            setCursos(data);
        } catch (error) {
            console.error('Error de red al cargar cursos:', error);
            alert("No se pudieron cargar los cursos.");
        }
    };

    useEffect(() => {
        cargarCursos();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleShowModal = async (curso = null) => {
        if (curso) {
            // Formatear las fechas al formato YYYY-MM-DD para el input date
            const formatearFecha = (fecha) => {
                const d = new Date(fecha);
                return d.toISOString().split('T')[0];
            };
            
            setFormData({
                nombreCurso: curso.NombreCurso,
                descripcion: curso.Descripcion || '',
                fechaInicio: formatearFecha(curso.FechaInicio),
                fechaFin: formatearFecha(curso.FechaFin),
                horario: curso.Horario
            });
            setEditingCurso(curso);
            await cargarMateriales(curso.IdCurso);
        } else {
            setFormData({
                nombreCurso: '',
                descripcion: '',
                fechaInicio: '',
                fechaFin: '',
                horario: ''
            });
            setEditingCurso(null);
            setMateriales([]);
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingCurso
                ? `http://localhost:5000/api/cursos/${editingCurso.IdCurso}`
                : 'http://localhost:5000/api/cursos';
            const method = editingCurso ? 'PUT' : 'POST';

            // Ajustar las fechas para que se guarden correctamente considerando la zona horaria local
            const adjustedFormData = {
                ...formData,
                fechaInicio: new Date(formData.fechaInicio + 'T00:00:00-05:00').toISOString(),
                fechaFin: new Date(formData.fechaFin + 'T00:00:00-05:00').toISOString()
            };

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(adjustedFormData)
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

    const cargarMateriales = async (cursoId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/cursos/${cursoId}/materiales`, {
                headers
            });
            if (response.ok) {
                const data = await response.json();
                setMateriales(data);
            }
        } catch (error) {
            console.error('Error al cargar materiales:', error);
        }
    };

    const handleViewCurso = async (curso) => {
        setViewCurso(curso);
        await cargarMateriales(curso.IdCurso);
        setShowViewModal(true);
    };

    const handleOpenMaterialModal = (cursoId, material = null) => {
        setSelectedCursoId(cursoId);
        if (material) {
            setMaterialData({ titulo: material.Titulo, enlace: material.Enlace });
            setEditingMaterial(material);
        } else {
            setMaterialData({ titulo: '', enlace: '' });
            setEditingMaterial(null);
        }
        setShowMaterialModal(true);
    };

    const handleMaterialInputChange = (e) => {
        const { name, value } = e.target;
        setMaterialData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Función para manejar el cierre del modal de materiales
    const handleCloseMaterialModal = () => {
        setShowMaterialModal(false);
        setMaterialData({ titulo: '', enlace: '' });
        setEditingMaterial(null);
        // Recargar los materiales al cerrar el modal
        if (selectedCursoId) {
            cargarMateriales(selectedCursoId);
        }
    };

    const handleUploadMaterial = async (e) => {
        e.preventDefault();
        const url = editingMaterial
            ? `http://localhost:5000/api/materiales/${editingMaterial.IdMaterial}`
            : 'http://localhost:5000/api/materiales';
        const method = editingMaterial ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify({
                    titulo: materialData.titulo,
                    enlace: materialData.enlace,
                    cursoId: selectedCursoId
                })
            });

            if (response.ok) {
                // Cerrar el modal de material
                setShowMaterialModal(false);
                
                // Recargar los materiales del curso
                await cargarMateriales(selectedCursoId);
                
                // Mostrar mensaje de éxito
                alert(editingMaterial ? 'Material actualizado correctamente' : 'Material agregado correctamente');
                
                // Limpiar el formulario
                setMaterialData({ titulo: '', enlace: '' });
                setEditingMaterial(null);
            } else {
                const error = await response.json();
                alert(error.mensaje);
            }
        } catch (error) {
            console.error('Error al subir material:', error);
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
                            <td>{new Date(curso.FechaInicio.split('T')[0] + 'T00:00:00-05:00').toLocaleDateString()}</td>
                            <td>{new Date(curso.FechaFin.split('T')[0] + 'T00:00:00-05:00').toLocaleDateString()}</td>
                            <td>{curso.Horario}</td>
                            <td>
                                <Button variant="info" size="sm" className="me-2" onClick={() => handleShowModal(curso)}>
                                    Editar
                                </Button>
                                <Button variant="success" size="sm" className="me-2" onClick={() => handleViewCurso(curso)}>
                                    Ver
                                </Button>
                                <Button variant="secondary" size="sm" className="me-2" onClick={() => handleOpenMaterialModal(curso.IdCurso)}>
                                    Subir Material
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(curso.IdCurso)}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal Crear/Editar Curso */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingCurso ? 'Editar Curso' : 'Crear Nuevo Curso'}</Modal.Title>
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

                    {editingCurso && (
                        <>
                            <hr />
                            <h5>Materiales del Curso</h5>
                            <div className="mb-3">
                                <Button variant="success" size="sm" onClick={() => handleOpenMaterialModal(editingCurso.IdCurso)}>
                                    Agregar Material
                                </Button>
                            </div>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Enlace</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {materiales.map(material => (
                                        <tr key={material.IdMaterial}>
                                            <td>{material.Titulo}</td>
                                            <td>
                                                <a href={material.Enlace} target="_blank" rel="noopener noreferrer">
                                                    {material.Enlace}
                                                </a>
                                            </td>
                                            <td>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    onClick={() => handleOpenMaterialModal(editingCurso.IdCurso, material)}
                                                >
                                                    Editar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}
                </Modal.Body>
            </Modal>            {/* Modal Subir Material */}
            <Modal show={showMaterialModal} onHide={handleCloseMaterialModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingMaterial ? 'Editar Material' : 'Subir Material al Curso'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUploadMaterial}>
                        <Form.Group className="mb-3">
                            <Form.Label>Título del Material</Form.Label>
                            <Form.Control
                                type="text"
                                name="titulo"
                                value={materialData.titulo}
                                onChange={handleMaterialInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Enlace URL</Form.Label>
                            <Form.Control
                                type="url"
                                name="enlace"
                                value={materialData.enlace}
                                onChange={handleMaterialInputChange}
                                required
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={handleCloseMaterialModal}>Cancelar</Button>
                            <Button variant="primary" type="submit" className="ms-2">
                                {editingMaterial ? 'Guardar Cambios' : 'Subir'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal Ver Curso y Materiales */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Curso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {viewCurso && (
                        <>
                            <h5>Información del Curso</h5>
                            <Table bordered>
                                <tbody>
                                    <tr>
                                        <th>Nombre</th>
                                        <td>{viewCurso.NombreCurso}</td>
                                    </tr>
                                    <tr>
                                        <th>Descripción</th>
                                        <td>{viewCurso.Descripcion}</td>
                                    </tr>
                                    <tr>
                                        <th>Fecha Inicio</th>
                                        <td>{new Date(viewCurso.FechaInicio.split('T')[0] + 'T00:00:00-05:00').toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <th>Fecha Fin</th>
                                        <td>{new Date(viewCurso.FechaFin.split('T')[0] + 'T00:00:00-05:00').toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <th>Horario</th>
                                        <td>{viewCurso.Horario}</td>
                                    </tr>
                                </tbody>
                            </Table>

                            <h5 className="mt-4">Materiales del Curso</h5>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Enlace</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {materiales.map(material => (
                                        <tr key={material.IdMaterial}>
                                            <td>{material.Titulo}</td>
                                            <td>
                                                <a href={material.Enlace} target="_blank" rel="noopener noreferrer">
                                                    {material.Enlace}
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default ProfesorCursos;
