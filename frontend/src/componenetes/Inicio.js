import React from "react";
import "../componenetes/css/inicio.css";

const Inicio = () => {
  return (
    <section className="history">
      <div className="history-content">
        <h1>
          Bienvenidos a <span className="brand-name">EducaPro</span>
        </h1>
        <p className="slogan">
          ¡Impulsa tu enseñanza! Promociona tus cursos digitales y conecta con más estudiantes.
        </p>
        <img
          src="./imagenes/imgINICIO.jpeg"
          alt="Plataforma EducaPro"
          className="history-image"
        />
        <div className="history-text">
          <p>
            Desde nuestra fundación en <strong>1990</strong>, hemos trabajado con pasión y dedicación para ofrecer soluciones innovadoras a la comunidad educativa. Gracias a nuestra plataforma, los profesores pueden <strong>promocionar sus cursos</strong> de forma digital y los estudiantes pueden encontrar la mejor oferta formativa para su desarrollo profesional.
          </p>
          <p>
            <span className="vision">Nuestra visión:</span> <b>Crear un futuro mejor conectando docentes y estudiantes, brindando oportunidades de aprendizaje accesibles, modernas y de calidad.</b>
          </p>
        </div>
        
      </div>
    </section>
  );
};

export default Inicio;
