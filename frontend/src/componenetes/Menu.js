import React from "react";
import { Nav } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom';

function Menu() {
    const getMenuItems = () => {
        const token = localStorage.getItem('token');
        if (!token) return [];

        try {
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.rol;
            console.log('Rol detectado:', userRole);

            // Menú base (compartido por todos los roles)
            const baseMenu = [
                { path: "/inicio", text: "Inicio" },
                { path: "/menu", text: "Menú Principal" }
            ];

            // Menú específico para cada rol
            switch (userRole) {
                case 'Profesor':
                    return [
                        ...baseMenu,
                        { path: "/profesor/cursos", text: "Mis Cursos" },
                        { path: "/profesor/solicitudes", text: "Solicitudes Pendientes" }
                    ];
                case 'Alumno':
                    return [
                        ...baseMenu,
                        { path: "/alumno/cursos", text: "Cursos Disponibles" },
                        { path: "/alumno/miscursos", text: "Mis Cursos" }
                    ];
                case 'Administrador':
                    return [
                        ...baseMenu,
                        { path: "/admin/usuarios", text: "Gestión de Usuarios" },
                        { path: "/solicitudes-profesores", text: "Solicitudes de Profesores" },
                        { path: "/admin/SolcicitudesActivacion", text: "Solicitudes de Activacion" }
                    ];
                default:
                    return baseMenu;
            }
        } catch (error) {
            console.error('Error decodificando el token:', error);
            return [];
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <Nav className="menu" defaultActiveKey="/inicio">
            {getMenuItems().map((item, index) => (
                <Nav.Link as={Link} to={item.path} key={index}>
                    {item.text}
                </Nav.Link>
            ))}
            <Nav.Link onClick={handleLogout}>
                Cerrar sesión
            </Nav.Link>
        </Nav>
    );
}

export default Menu;