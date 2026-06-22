import { useState, useEffect } from "react";
import { X, MapPin, Users, Clock, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import contratarRecintoModel from "../../../models/contratarRecintoModel";
import PasoPago from "../../MisReservas/PasoPago";
import "./ReservaModal.css";

export default function ReservaModal({ recinto, onClose }) {
  const { usuario, token } = useAuth();
  const [form, setForm] = useState({
    nombre_reservante: usuario?.nombre_usuario ?? "",
    fecha_inicio: "",
    fecha_fin: "",
    hora_inicio: "",
    hora_fin: "",
  });
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState("");
  const [reservaCreada, setReservaCreada] = useState(null); // { id_orden, monto_total }
  const [pagoHecho, setPagoHecho] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const validar = () => {
    if (!form.nombre_reservante.trim()) return "El nombre del reservante es obligatorio.";
    if (!form.fecha_inicio) return "La fecha de inicio es obligatoria.";
    if (!form.fecha_fin) return "La fecha de fin es obligatoria.";
    if (form.fecha_fin < form.fecha_inicio) return "La fecha de fin no puede ser anterior a la de inicio.";
    if (!form.hora_inicio) return "La hora de inicio es obligatoria.";
    if (!form.hora_fin) return "La hora de fin es obligatoria.";
    if (form.fecha_inicio === form.fecha_fin && form.hora_fin <= form.hora_inicio)
      return "La hora de fin debe ser posterior a la de inicio.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mensajeError = validar();
    if (mensajeError) { setError(mensajeError); return; }

    if (!token) { setError("Debes iniciar sesión para reservar."); return; }

    setCargando(true);
    setError("");
    try {
      const reserva = await contratarRecintoModel(
        recinto.id,
        form.nombre_reservante,
        form.fecha_inicio,
        form.fecha_fin,
        form.hora_inicio,
        form.hora_fin,
        token
      );
      setReservaCreada(reserva);
      setExito(true);
    } catch (err) {
      setError(err.message || "Error al procesar la reserva.");
    } finally {
      setCargando(false);
    }
  };

  const hoy = new Date().toISOString().split("T")[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </button>

        {exito ? (
          <div className="modal-exito">
            <div className="modal-exito-icon"><CheckCircle size={56} /></div>
            <h2 className="modal-exito-titulo">¡Reserva registrada!</h2>
            <p className="modal-exito-desc">
              Tu reserva para <strong>{recinto.nombre}</strong> quedó guardada.
            </p>

            {!pagoHecho ? (
              <>
                <p className="modal-exito-desc" style={{ marginTop: 4 }}>
                  Total a pagar: <strong>Bs {Number(reservaCreada?.monto_total ?? 0).toFixed(2)}</strong>
                </p>
                <PasoPago
                  idOrden={reservaCreada?.id_orden}
                  montoTotal={Number(reservaCreada?.monto_total ?? 0)}
                  onPagado={() => setPagoHecho(true)}
                />
              </>
            ) : (
              <p className="modal-exito-desc">
                ¡Pago registrado! Puedes ver el detalle y el saldo en "Mis Reservas".
              </p>
            )}

            <button className="modal-btn-primary" onClick={onClose} style={{ marginTop: 14 }}>Cerrar</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div className="modal-header-img-wrapper">
                <img
                  src={recinto.imagen || "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=800&h=500&fit=crop"}
                  alt={recinto.nombre}
                  className="modal-header-img"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=800&h=500&fit=crop"; }}
                />
                <div className="modal-header-overlay" />
                <div className="modal-header-info">
                  <span className="modal-header-tipo">{recinto.tipo}</span>
                  <h2 className="modal-header-nombre">{recinto.nombre}</h2>
                  <div className="modal-header-meta">
                    <span><MapPin size={13} /> {recinto.ciudad}</span>
                    <span><Users size={13} /> {recinto.capacidad} personas</span>
                    <span><Clock size={13} /> Bs {recinto.precioHora} / hora</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <h3 className="modal-section-title">Datos de la reserva</h3>

              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="modal-field">
                  <label className="modal-label">Nombre del reservante</label>
                  <input
                    type="text"
                    name="nombre_reservante"
                    className="modal-input"
                    value={form.nombre_reservante}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="modal-row">
                  <div className="modal-field">
                    <label className="modal-label"><Calendar size={13} /> Fecha inicio</label>
                    <input
                      type="date"
                      name="fecha_inicio"
                      className="modal-input"
                      value={form.fecha_inicio}
                      onChange={handleChange}
                      min={hoy}
                    />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label"><Calendar size={13} /> Fecha fin</label>
                    <input
                      type="date"
                      name="fecha_fin"
                      className="modal-input"
                      value={form.fecha_fin}
                      onChange={handleChange}
                      min={form.fecha_inicio || hoy}
                    />
                  </div>
                </div>

                <div className="modal-row">
                  <div className="modal-field">
                    <label className="modal-label"><Clock size={13} /> Hora inicio</label>
                    <input
                      type="time"
                      name="hora_inicio"
                      className="modal-input"
                      value={form.hora_inicio}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="modal-field">
                    <label className="modal-label"><Clock size={13} /> Hora fin</label>
                    <input
                      type="time"
                      name="hora_fin"
                      className="modal-input"
                      value={form.hora_fin}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {error && (
                  <div className="modal-error">
                    <AlertCircle size={15} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" className="modal-btn-secondary" onClick={onClose}>
                    Cancelar
                  </button>
                  <button type="submit" className="modal-btn-primary" disabled={cargando}>
                    {cargando ? <span className="modal-spinner" /> : null}
                    {cargando ? "Reservando..." : "Confirmar reserva"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}