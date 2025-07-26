import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/cursosdisponibles.css';

const CursosDisponibles = () => {
    const navigate = useNavigate();
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarCursos();
    }, []);

    const cargarCursos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/cursos/disponibles');
            
            console.log('Respuesta del servidor:', response.data);
            setCursos(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error detallado:', {
                mensaje: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(err.response?.data?.mensaje || 'Error al cargar los cursos disponibles');
            setLoading(false);
        }
    };

    const verDetalleCurso = (curso) => {
        navigate('/alumno/curso/detalle', { state: { curso } });
    };

    if (loading) return <div className="cursos-disponibles">Cargando cursos...</div>;
    if (error) return <div className="cursos-disponibles">Error: {error}</div>;

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="cursos-disponibles">
            <h2>Cursos Disponibles</h2>
            <div className="cursos-grid">
                {cursos.map((curso) => (
                    <div key={curso.IdCurso} className="curso-card">
                        <h3>{curso.NombreCurso}</h3>
                        <div className="curso-info">
                            <p>Profesor: {curso.Profesor.NombreCompleto}</p>
                            <p>Inicio: {formatearFecha(curso.FechaInicio)}</p>
                            <p>Fin: {formatearFecha(curso.FechaFin)}</p>
                        </div>
                        <button 
                            className="curso-btn"
                            onClick={() => verDetalleCurso(curso)}
                        >
                            Ver Detalles
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CursosDisponibles;
