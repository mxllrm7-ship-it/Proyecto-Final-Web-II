import { useNavigate } from "react-router";
import {
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Ticket,
} from "lucide-react";
import "./EventCard.css";

export default function EventCard({ event }) {
  const navigate = useNavigate();

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha por confirmar";

    return new Date(`${fecha}T12:00:00`).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleNavigate = () => {
    navigate(`/eventos/${event.idEvento}`);
  };

  return (
    <div className="event-card" onClick={handleNavigate}>
      <div className="event-card-image-wrapper">
        <img
          src={event.imagenUrl}
          alt={event.nombreEvento}
          className="event-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=500&fit=crop";
          }}
        />

        <div className="event-card-overlay" />

        <div className="event-card-badge">
          {event.categoria}
        </div>
      </div>

      <div className="event-card-content">
        <h3 className="event-card-title">
          {event.nombreEvento}
        </h3>

        <div className="event-card-details">
          <div className="event-card-detail">
            <Calendar size={16} />
            <span>{formatearFecha(event.fechaInicio)}</span>
          </div>

          <div className="event-card-detail">
            <Clock size={16} />
            <span>
              {event.horaInicio?.slice(0, 5)} -{" "}
              {event.horaFin?.slice(0, 5)}
            </span>
          </div>

          <div className="event-card-detail">
            <MapPin size={16} />
            <span>
              {event.nombreRecinto} · {event.nombreCiudad}
            </span>
          </div>

          <div className="event-card-detail">
            <Ticket size={16} />
            <span>
              {event.totalDisponible} disponibles
            </span>
          </div>
        </div>

        <div className="event-card-footer">
          <div className="event-card-prices">
            <span className="event-card-price-label">
              Desde
            </span>

            <span className="event-card-price">
              Bs {event.precioMinimo}
            </span>
          </div>

          <button
            className="event-card-button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/eventos/${event.idEvento}`);
            }}
          >
            Ver boletos
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}