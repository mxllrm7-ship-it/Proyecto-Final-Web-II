import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Ticket,
  Calendar,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { obtenerMisTickets } from "../../../services/MisTicketsService";
import "./MyTickets.css";
import "../../../styles/styles.css";

function formatDate(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatPurchaseDate(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isUpcoming(dateStr) {
  if (!dateStr) return false;

  return new Date(dateStr + "T23:59:59") >= new Date();
}

function TicketCard({ ticket, expanded, onExpand }) {
  const upcoming = isUpcoming(ticket.fecha.fechaInicio);

  return (
    <div
      className={`mt-ticket ${
        ticket.boleto.estadoValidacion !== "VIGENTE" ? "used" : ""
      } ${expanded ? "expanded" : ""}`}
    >
      <div className="mt-ticket-top">
        <div
          className="mt-ticket-img"
          style={{
            backgroundImage: `url(${ticket.evento.imagenUrl})`,
          }}
        >
          <div className="mt-ticket-img-overlay" />

          <span
            className={`mt-ticket-status-badge ${
              ticket.boleto.estadoValidacion === "VIGENTE"
                ? "valid"
                : "used"
            }`}
          >
            {ticket.boleto.estadoValidacion === "VIGENTE" && upcoming ? (
              <>
                <CheckCircle size={14} />
                Válido
              </>
            ) : (
              <>
                <Clock size={14} />
                Utilizado
              </>
            )}
          </span>
        </div>

        <div className="mt-ticket-main">
          <div className="mt-ticket-meta-row">
            <span className="mt-ticket-category">
              {ticket.evento.categoria}
            </span>

            <span className="mt-ticket-purchase-date">
              Comprado el {formatPurchaseDate(ticket.orden.fechaOrden)}
            </span>
          </div>

          <h3 className="mt-ticket-title">
            {ticket.evento.nombreEvento}
          </h3>

          <div className="mt-ticket-info-grid">
            <div className="mt-ticket-info-item">
              <span className="mt-ticket-info-label">
                <Calendar size={16} />
                Fecha
              </span>

              <span className="mt-ticket-info-value">
                {formatDate(ticket.fecha.fechaInicio)} ·{" "}
                {ticket.fecha.horaInicio}
              </span>
            </div>

            <div className="mt-ticket-info-item">
              <span className="mt-ticket-info-label">
                <MapPin size={16} />
                Recinto
              </span>

              <span className="mt-ticket-info-value">
                {ticket.recinto.nombreRecinto} —{" "}
                {ticket.ciudad.nombreCiudad}
              </span>
            </div>

            <div className="mt-ticket-info-item">
              <span className="mt-ticket-info-label">
                <Ticket size={16} />
                Tipo
              </span>

              <span className="mt-ticket-info-value">
                {ticket.tipoBoleto.nombreTipo}
              </span>
            </div>

            <div className="mt-ticket-info-item">
              <span className="mt-ticket-info-label">
                <CreditCard size={16} />
                Precio
              </span>

              <span className="mt-ticket-info-value">
                Bs {ticket.tipoBoleto.precio}
              </span>
            </div>
          </div>

          <button
            className="mt-ticket-toggle"
            onClick={() => onExpand(ticket.boleto.codigo)}
          >
            {expanded ? (
              <>
                Ocultar código <ChevronUp size={16} />
              </>
            ) : (
              <>
                Ver código <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-ticket-code-area">
          <div className="mt-ticket-perforations">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="mt-perf-dot" />
            ))}
          </div>

          <div className="mt-ticket-code-body">
            <p className="mt-code-label">
              CÓDIGO DEL TICKET
            </p>

            <p className="mt-code-value">
              {ticket.boleto.codigo}
            </p>

            <p className="mt-code-total">
              Total pagado:{" "}
              <strong>
                Bs {ticket.pago.montoPago}
              </strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("all");
  const [expandedCode, setExpandedCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarTickets = async () => {
      try {
        setLoading(true);

        const data = await obtenerMisTickets();

        setTickets(data.tickets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarTickets();
  }, []);

  const filtered = tickets.filter((ticket) => {
    if (filter === "upcoming") {
      return (
        isUpcoming(ticket.fecha.fechaInicio) &&
        ticket.boleto.estadoValidacion === "VIGENTE"
      );
    }

    if (filter === "used") {
      return (
        !isUpcoming(ticket.fecha.fechaInicio) ||
        ticket.boleto.estadoValidacion !== "VIGENTE"
      );
    }

    return true;
  });

  const handleExpand = (code) => {
    setExpandedCode((prev) =>
      prev === code ? null : code
    );
  };

  if (loading) {
    return (
      <div className="mt-page">
        <div className="mt-empty">
          <h3 className="mt-empty-title">
            Cargando tickets...
          </h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-page">
        <div className="mt-empty">
          <h3 className="mt-empty-title">
            Error al cargar tickets
          </h3>

          <p className="mt-empty-sub">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-page">
      <div className="mt-header">
        <div className="mt-header-content">
          <div className="mt-header-text">
            <Ticket size={36} />

            <div>
              <h1 className="mt-title">
                Mis Tickets
              </h1>

              <p className="mt-subtitle">
                {tickets.length} boleto
                {tickets.length !== 1 ? "s" : ""}
                {" "}en tu cuenta
              </p>
            </div>
          </div>

          <button
            className="mt-explore-btn"
            onClick={() => navigate("/eventos")}
          >
            Explorar Eventos
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="mt-filters-bar">
        <div className="mt-filters">
          {[
            { key: "all", label: "Todos" },
            { key: "upcoming", label: "Próximos" },
            { key: "used", label: "Pasados" },
          ].map((filtro) => (
            <button
              key={filtro.key}
              className={`mt-filter-btn ${
                filter === filtro.key ? "active" : ""
              }`}
              onClick={() => setFilter(filtro.key)}
            >
              {filtro.label}
            </button>
          ))}
        </div>

        <span className="mt-filter-count">
          {filtered.length} resultado
          {filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-content">
        {filtered.length === 0 ? (
          <div className="mt-empty">
            <Ticket size={48} />

            <h3 className="mt-empty-title">
              No hay tickets aquí
            </h3>

            <p className="mt-empty-sub">
              No tienes tickets para mostrar.
            </p>

            <button
              className="mt-explore-btn"
              onClick={() => navigate("/eventos")}
            >
              Ver Eventos
            </button>
          </div>
        ) : (
          <div className="mt-list">
            {filtered.map((ticket) => (
              <TicketCard
                key={ticket.boleto.idBoleto}
                ticket={ticket}
                expanded={
                  expandedCode === ticket.boleto.codigo
                }
                onExpand={handleExpand}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}