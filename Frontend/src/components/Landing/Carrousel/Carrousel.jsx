import "../../../styles/styles.css";
import "./Carrousel.css";
import { Link } from "react-router";
import React, { useEffect, useState } from "react";
import { obtenerEventos } from "../../../services/EventoService";

const ImageCarousel = () => {
  const [eventos, setEventos] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const data = await obtenerEventos();
        setEventos(data);
      } catch (error) {
        console.error(error);
      }
    };

    cargarEventos();
  }, []);

  const handlePreviousClick = () => {
    setCurrentImageIndex(
      currentImageIndex === 0
        ? eventos.length - 1
        : currentImageIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex(
      (currentImageIndex + 1) % eventos.length
    );
  };

  useEffect(() => {
    if (eventos.length === 0) return;

    const timer = setTimeout(() => {
      handleNextClick();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentImageIndex, eventos]);

  if (eventos.length === 0) {
    return (
      <section className="carousel-section">
        <div className="image-container">
          <h2>Cargando eventos...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="carousel-section">
      <div className="image-container">
        <button
          className="nav-button left"
          onClick={handlePreviousClick}
        >
          &lt;
        </button>

        {eventos.map((evento, index) => (
          <div
            key={evento.idEvento}
            className={
              currentImageIndex === index
                ? "slide active"
                : "slide"
            }
          >
            <img
              src={evento.imagenUrl}
              alt={evento.nombreEvento}
            />

            <div className="overlay">
              <h1>{evento.nombreEvento}</h1>

              <Link
                to={`/eventos/${evento.idEvento}`}
                className="ticket-button"
              >
                Ver evento
              </Link>
            </div>
          </div>
        ))}

        <button
          className="nav-button right"
          onClick={handleNextClick}
        >
          &gt;
        </button>
      </div>
    </section>
  );
};

export default ImageCarousel;