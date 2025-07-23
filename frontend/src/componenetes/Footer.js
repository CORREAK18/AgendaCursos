import React from "react";
import "../componenetes/css/footer.css";

const Footer = () => {
  return (
    <footer className="footer"> 
      <p>&copy; {new Date().getFullYear()} Mi Aplicación Web. Todos los derechos reservados.</p>
      <nav>
        <ul>
          <li><a href="#privacidad">Política de Privacidad</a></li>
          <li><a href="#terminos">Términos y Condiciones</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
      </nav>
    </footer>
  );
};



export default Footer;