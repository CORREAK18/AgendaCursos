import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ReporteVentas from './ReporteVentas'
import Inicio from "./Inicio";
import Footer from "./Footer";
import Header from "./Header";
import Menu from './Menu';
import Login from './Login';
import RegistrarUsuario from './RegistrarUsuario';
import Precios from './Precios';
import Principal from '../App';
import ProfesorCursos from './ProfesorCursos';
import { jwtDecode } from 'jwt-decode';

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
                
                {/* Rutas para Alumno */}
                <Route path="/alumno/cursos" element={isAlumno() ? <Precios /> : <Navigate to="/" />} />
                
                {/* Rutas para Admin */}
                <Route path="/admin/usuarios" element={isAdmin() ? <ReporteVentas /> : <Navigate to="/" />} />

                {/* Rutas heredadas del sistema anterior */}
                <Route path="/Precios" element={isAuthenticated ? <Precios /> : <Navigate to="/" />} />
                <Route path="/ReporteVentas" element={isAuthenticated ? <ReporteVentas /> : <Navigate to="/" />} />
            </Routes>
            {isAuthenticated && <Footer />}
        </Router>
    );
}

export default App;


