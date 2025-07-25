import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './css/detallecurso.css';

const DetalleCurso = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const curso = state?.curso;

    if (!curso) {
        return <div className="detalle-curso">No se encontró información del curso</div>;
    }

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const enviarSolicitud = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Debes iniciar sesión para inscribirte a un curso');
                return;
            }
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            await axios.post(
                `http://localhost:5000/api/cursos/${curso.IdCurso}/solicitud`,
                { alumnoId: decodedToken.id }
            );
            alert('Solicitud enviada correctamente');
            navigate('/alumno/cursos');
        } catch (err) {
            alert(err.response?.data?.mensaje || 'Error al enviar la solicitud');
            console.error('Error:', err);
        }
    };

    return (
        <div className="detalle-curso">
            <div className="detalle-content">
                <div className="detalle-header">
                    <h2>{curso.NombreCurso}</h2>
                </div>
                <div className="detalle-body">
                    <p><strong>Profesor:</strong> {curso.Profesor.NombreCompleto}</p>
                    <p><strong>Descripción:</strong> {curso.Descripcion}</p>
                    <p><strong>Fecha de inicio:</strong> {formatearFecha(curso.FechaInicio)}</p>
                    <p><strong>Fecha de fin:</strong> {formatearFecha(curso.FechaFin)}</p>
                    <p><strong>Horario:</strong> {curso.Horario}</p>
                    <div className="terminos">
                        <p><strong>Términos y condiciones:</strong></p>
                        <ul>
                            <li>La inscripción está sujeta a la aprobación del profesor.</li>
                            <li>El alumno debe comprometerse a asistir a las clases en los horarios establecidos.</li>
                            <li>El alumno debe mantener un comportamiento respetuoso durante las clases.</li>
                        </ul>
                    </div>
                </div>
                <div className="detalle-footer">
                    <button className="detalle-btn inscribir" onClick={enviarSolicitud}>
                        Inscribirme
                    </button>
                    <button className="detalle-btn cancelar" onClick={() => navigate('/alumno/cursos')}>
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetalleCurso;
