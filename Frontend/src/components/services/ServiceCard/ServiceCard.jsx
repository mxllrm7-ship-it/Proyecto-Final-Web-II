import { useState } from "react";
import { Briefcase, Users, Phone, ArrowRight } from "lucide-react";
import "./ServiceCard.css";
import ContratarModal from "../ContratarModal/ContratarModal";
import ReservarServicioModal from "../ReservarServicioModal/ReservarServicioModal";
import { useAuth } from "../../../context/AuthContext";

export default function ServiceCard({ service }) {
  const { usuario } = useAuth();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalReservaAbierto, setModalReservaAbierto] = useState(false);

  const proveedoresVisibles = service.proveedores?.slice(0, 3) || [];
  const proveedoresRestantes = (service.proveedores?.length || 0) - proveedoresVisibles.length;

  const handleReservarSolo = () => {
    if (!usuario) {
      alert("Debes iniciar sesión para reservar.");
      return;
    }
    setModalReservaAbierto(true);
  };

  return (
    <>
      <div className="service-card">
        <div className="service-card-header">
          <div className="service-card-header-icon">
            <Briefcase size={24} />
          </div>
          <div className="service-card-badge">{service.categoria}</div>
        </div>

        <div className="service-card-content">
          <h3 className="service-card-title">{service.nombre}</h3>

          <div className="service-card-info">
            <div className="service-card-info-item">
              <span className="service-card-label">Categoría</span>
              <span className="service-card-value">{service.categoria}</span>
            </div>
            <div className="service-card-info-item">
              <Users size={16} />
              <span className="service-card-value">
                {service.proveedores?.length || 0} proveedore{service.proveedores?.length !== 1 ? "s" : ""} disponible{service.proveedores?.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="service-card-providers">
            {proveedoresVisibles.map((proveedor, index) => (
              <div key={index} className="service-card-provider">
                <div className="service-card-provider-name">{proveedor.nombre}</div>
                <div className="service-card-provider-phone">
                  <Phone size={14} />
                  <span>{proveedor.telefono}</span>
                </div>
              </div>
            ))}
            {proveedoresRestantes > 0 && (
              <div className="service-card-provider-more">
                +{proveedoresRestantes} proveedore{proveedoresRestantes !== 1 ? "s" : ""} más
              </div>
            )}
          </div>
        </div>

        <div className="service-card-footer">
          <button
            className="service-card-button service-card-button--ghost"
            onClick={handleReservarSolo}
          >
            Reservar (sin evento)
          </button>
          <button className="service-card-button" onClick={() => setModalAbierto(true)}>
            Contratar servicio
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {modalAbierto && (
        <ContratarModal
          servicio={service}
          onClose={() => setModalAbierto(false)}
        />
      )}

      {modalReservaAbierto && (
        <ReservarServicioModal
          servicio={service}
          onClose={() => setModalReservaAbierto(false)}
        />
      )}
    </>
  );
}