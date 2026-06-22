import { MapPin, Users, Building2, CheckCircle, Wrench, Ban, ArrowRight, MapPinned } from "lucide-react";
import "./RecintoCard.css";

export default function RecintoCard({ recinto, onContratar }) {
  const getEstadoBadge = () => {
    const estado = recinto.estado || "Estado no definido";
    return {
      texto: estado,
      clase:
        estado === "Disponible" ? "disponible"
        : estado === "En Mantenimiento" ? "mantenimiento"
        : estado === "Clausurado" ? "clausurado"
        : "no-definido",
    };
  };

  const getEstadoIcon = () => {
    const estado = recinto.estado || "";
    if (estado === "Disponible") return <CheckCircle size={16} />;
    if (estado === "En Mantenimiento") return <Wrench size={16} />;
    if (estado === "Clausurado") return <Ban size={16} />;
    return null;
  };

  const badge = getEstadoBadge();
  const imagenUrl =
    recinto.imagen && recinto.imagen.trim()
      ? recinto.imagen
      : "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=800&h=500&fit=crop";

  const handleVerUbicacion = (e) => {
    e.stopPropagation();
    if (recinto.googleMaps) window.open(recinto.googleMaps, "_blank");
  };

  return (
    <div className="recinto-card">
      <div className="recinto-card-image-wrapper">
        <img
          src={imagenUrl}
          alt={recinto.nombre}
          className="recinto-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=800&h=500&fit=crop";
          }}
        />
        <div className="recinto-card-overlay" />
        <div className="recinto-card-badge">{recinto.tipo}</div>
      </div>

      <div className="recinto-card-content">
        <h3 className="recinto-card-title">{recinto.nombre}</h3>

        <div className="recinto-card-details">
          <div className="recinto-card-detail"><MapPin size={16} /><span>{recinto.ciudad}</span></div>
          <div className="recinto-card-detail"><Building2 size={16} /><span>{recinto.direccion}</span></div>
          <div className="recinto-card-detail"><Users size={16} /><span>{recinto.capacidad} personas</span></div>
          <div className="recinto-card-detail">
            <div className={`recinto-card-estado ${badge.clase}`}>
              {getEstadoIcon()}
              <span>{badge.texto}</span>
            </div>
          </div>
        </div>

        <div className="recinto-card-footer">
          <div className="recinto-card-prices">
            <span className="recinto-card-price-label">Desde</span>
            <span className="recinto-card-price">Bs {recinto.precioHora} / hora</span>
          </div>

          <div className="recinto-card-buttons">
            <button
              className="recinto-card-button recinto-card-button-primary"
              onClick={() => onContratar(recinto)}
              disabled={recinto.estado !== "Disponible"}
            >
              Reservar
              <ArrowRight size={16} />
            </button>
            {recinto.googleMaps && (
              <button
                className="recinto-card-button recinto-card-button-secondary"
                onClick={handleVerUbicacion}
              >
                <MapPinned size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}