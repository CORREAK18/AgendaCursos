import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Inicio from "./Inicio";
import Footer from "./Footer";
import Header from "./Header";
import Menu from './Menu';
import Login from './Login';
import RegistrarUsuario from './RegistrarUsuario';
import Principal from '../App';
import ProfesorCursos from './ProfesorCursos';
import CursosDisponibles from './CursosDisponibles';
import DetalleCurso from './DetalleCurso';
import SolicitudesAlumnos from './SolicitudesAlumnos';
import DetalleSolicitud from './DetalleSolicitud';
import GestionUsuarios from './GestionUsuarios';
import { jwtDecode } from 'jwt-decode';
import MisCursosAlumno from './MisCursosAlumno';


function App() {
    const isAuthenticated = localStorage.getItem('token');

    const checkRole = (allowedRoles) => {
        if (!isAuthenticated) return false;
        try {
            const decodedToken = jwtDecode(isAuthenticated);
            return allowedRoles.includes(decodedToken.rol);
        } catch (error) {
            console.error('Error verificando rol:', error);
            return false;
        }
    };

    const isAdmin = () => checkRole(['Administrador']);
    const isProfesor = () => checkRole(['Profesor']);
    const isAlumno = () => checkRole(['Alumno']);

    return (
        <Router>
            {isAuthenticated && <Header />}
            {isAuthenticated && <Menu />}
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={isAuthenticated ? <Navigate to="/inicio" /> : <Login />} />
                <Route path="/registro" element={isAuthenticated ? <Navigate to="/inicio" /> : <RegistrarUsuario />} />
                <Route path="/inicio" element={isAuthenticated ? <Inicio /> : <Navigate to="/" />} />
                <Route path="/menu" element={isAuthenticated ? <Principal /> : <Navigate to="/" />} />
                
                {/* Rutas para Profesor */}
                <Route path="/profesor/cursos" element={isProfesor() ? <ProfesorCursos /> : <Navigate to="/" />} />
                <Route path="/profesor/solicitudes" element={isProfesor() ? <SolicitudesAlumnos /> : <Navigate to="/" />} />
                <Route path="/profesor/solicitud/detalle" element={isProfesor() ? <DetalleSolicitud /> : <Navigate to="/" />} />
                
                {/* Rutas para Alumno */}
                <Route path="/cursos/disponibles" element={isAlumno() ? <CursosDisponibles /> : <Navigate to="/" />} />
                <Route path="/alumno/curso/detalle" element={isAlumno() ? <DetalleCurso /> : <Navigate to="/" />} />
                <Route path="/alumno/cursosM" element={isAlumno() ? <MisCursosAlumno /> : <Navigate to="/" />} />
                
                {/* Rutas para Admin */}
                <Route path="/admin/usuarios" element={isAdmin() ? <GestionUsuarios /> : <Navigate to="/" />} />
            </Routes>
            {isAuthenticated && <Footer />}
        </Router>
    );
}

export default App;


