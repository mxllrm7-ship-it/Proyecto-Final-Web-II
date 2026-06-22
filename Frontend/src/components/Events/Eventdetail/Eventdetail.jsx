import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerDetalleEvento } from "../../../services/EventoService";
import { realizarCompra } from "../../../services/PagoService";
import { useAuth } from "../../../context/AuthContext";
import "./Eventdetail.css";
import "./ModalPago.css";

function QRSection() {
  const [qrListo, setQrListo] = useState(false);

  useEffect(() => {
    setQrListo(false);
    const timer = setTimeout(() => setQrListo(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mp-qr-seccion">
      {!qrListo ? (
        <div className="mp-qr-cargando">
          <div className="mp-qr-spinner-ring"></div>
          <span className="mp-qr-texto-carga">Generando QR...</span>
        </div>
      ) : (
        <div className="mp-qr-wrapper">
          <img src="/qr.png" alt="QR de pago" className="mp-qr-imagen" />
          <p className="mp-qr-instruccion">
            Escanea el QR para realizar el pago
          </p>
        </div>
      )}
    </div>
  );
}

export default function EventPay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carrito, setCarrito] = useState({});
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [metodoPago, setMetodoPago] = useState(2);
  const [compradorNombre, setCompradorNombre] = useState("");
  const [compradorCorreo, setCompradorCorreo] = useState("");
  const [compradorCelular, setCompradorCelular] = useState("");
  const [compradorNit, setCompradorNit] = useState("");
  const [pagando, setPagando] = useState(false);
  const [errorPago, setErrorPago] = useState("");

  const METODOS_PAGO = [
    { id: 2, nombre: "QR", icono: "ti-qrcode", comision: 0 },
  ];

  useEffect(() => {
    const cargarDetalles = async () => {
      try {
        setLoading(true);
        const datos = await obtenerDetalleEvento(id);
        setEvento(datos);
        if (datos.evento.imagenUrl) {
          setImagenPrincipal(datos.evento.imagenUrl);
        } else if (datos.media && datos.media.length > 0) {
          setImagenPrincipal(datos.media[0].url);
        }
      } catch (err) {
        setError(err.message || "Error al cargar el evento");
      } finally {
        setLoading(false);
      }
    };
    cargarDetalles();
  }, [id]);

  useEffect(() => {
    if (usuario) {
      setCompradorNombre(usuario.nombre_usuario || "");
      setCompradorCorreo(usuario.correo || "");
      setCompradorCelular(usuario.telefono || "");
    }
  }, [usuario]);

  const actualizarCarrito = (tipoBoletoId, cantidad) => {
    setCarrito((prev) => {
      const nuevo = { ...prev };
      if (cantidad > 0) nuevo[tipoBoletoId] = cantidad;
      else delete nuevo[tipoBoletoId];
      return nuevo;
    });
  };

  const calcularTotales = () => {
    if (!evento) return { subtotal: 0, comision: 0, total: 0 };
    let subtotal = 0;
    Object.entries(carrito).forEach(([tipoBoletoId, cantidad]) => {
      const tipo = evento.tiposBoleto.find(
        (t) => t.id.toString() === tipoBoletoId.toString(),
      );
      if (tipo) subtotal += tipo.precio * cantidad;
    });
    const descuento = (subtotal * (evento.evento.descuento || 0)) / 100;
    const subtotalConDescuento = subtotal - descuento;
    const metodo = METODOS_PAGO.find((m) => m.id === metodoPago);
    const comision = (subtotalConDescuento * (metodo?.comision || 0)) / 100;
    const total = subtotalConDescuento + comision;
    return { subtotal, descuento, subtotalConDescuento, comision, total };
  };

  const cantidadBoletos = Object.values(carrito).reduce(
    (sum, qty) => sum + qty,
    0,
  );
  const { subtotal, descuento, subtotalConDescuento, comision, total } =
    calcularTotales();

  const abrirModal = () => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    setErrorPago("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (pagando) return;
    setModalAbierto(false);
    setErrorPago("");
  };

  const handlePagar = async () => {
    if (!compradorNombre || !compradorCorreo || !compradorCelular) {
      setErrorPago("Nombre, correo y celular son obligatorios.");
      return;
    }
    const primeraEntrada = Object.entries(carrito)[0];
    if (!primeraEntrada) return;
    const [idTipoBoleto, cantidad] = primeraEntrada;
    setPagando(true);
    setErrorPago("");
    try {
      await realizarCompra({
        idTipoBoleto: parseInt(idTipoBoleto),
        cantidad,
        idMetodoPago: metodoPago,
        compradorNombre,
        compradorCorreo,
        compradorCelular,
        compradorNit: compradorNit || null,
      });
      navigate("/mis-eventos");
    } catch (err) {
      setErrorPago(err.message || "Error al procesar el pago.");
    } finally {
      setPagando(false);
    }
  };

  if (loading)
    return (
      <div className="ep-container ep-loading">
        <div className="ep-spinner"></div>
        <p>Cargando evento...</p>
      </div>
    );

  if (error)
    return (
      <div className="ep-container ep-error">
        <div className="ep-error-content">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );

  if (!evento)
    return (
      <div className="ep-container ep-error">
        <div className="ep-error-content">
          <h2>Evento no encontrado</h2>
        </div>
      </div>
    );

  const {
    evento: eventoData,
    fecha,
    recinto,
    ciudad,
    organizador,
    media,
    invitados,
    tiposBoleto,
  } = evento;

  return (
    <div className="ep-page">
      {modalAbierto && (
        <div className="mp-overlay" onClick={cerrarModal}>
          <div className="mp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mp-header">
              <h2>Confirmar compra</h2>
              <button
                className="mp-close"
                onClick={cerrarModal}
                disabled={pagando}
              >
                <i className="ti ti-x"></i>
              </button>
            </div>

            <div className="mp-resumen">
              <h3>Resumen</h3>
              {tiposBoleto.map((tipo) => {
                const cantidad = carrito[tipo.id];
                if (!cantidad) return null;
                return (
                  <div key={tipo.id} className="mp-item">
                    <span>
                      {tipo.nombreTipo} x{cantidad}
                    </span>
                    <span>Bs. {(tipo.precio * cantidad).toFixed(2)}</span>
                  </div>
                );
              })}
              {(evento.evento.descuento || 0) > 0 && (
                <div className="mp-item mp-descuento">
                  <span>Descuento ({eventoData.descuento}%)</span>
                  <span>-Bs. {descuento.toFixed(2)}</span>
                </div>
              )}
              <div className="mp-item mp-comision">
                <span>Comisión método de pago</span>
                <span>Bs. {comision.toFixed(2)}</span>
              </div>
              <div className="mp-item mp-total">
                <span>Total</span>
                <span>Bs. {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mp-seccion">
              <h3>Método de pago</h3>
              <div className="mp-metodos">
                {METODOS_PAGO.map((m) => (
                  <button
                    key={m.id}
                    className={`mp-metodo ${metodoPago === m.id ? "mp-metodo--activo" : ""}`}
                    onClick={() => setMetodoPago(m.id)}
                  >
                    <i className={`ti ${m.icono}`}></i>
                    <span>{m.nombre}</span>
                    {m.comision > 0 && <small>+{m.comision}%</small>}
                  </button>
                ))}
              </div>
            </div>

            {metodoPago === 2 && <QRSection />}

            <div className="mp-seccion">
              <h3>Datos del comprador</h3>
              <div className="mp-campo">
                <label>Nombre completo</label>
                <input
                  type="text"
                  value={compradorNombre}
                  onChange={(e) => setCompradorNombre(e.target.value)}
                  placeholder="Tu nombre completo"
                  disabled={pagando}
                />
              </div>
              <div className="mp-campo">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  value={compradorCorreo}
                  onChange={(e) => setCompradorCorreo(e.target.value)}
                  placeholder="tu@email.com"
                  disabled={pagando}
                />
              </div>
              <div className="mp-campo">
                <label>Celular</label>
                <input
                  type="tel"
                  value={compradorCelular}
                  onChange={(e) => setCompradorCelular(e.target.value)}
                  placeholder="70012345"
                  disabled={pagando}
                />
              </div>
              <div className="mp-campo">
                <label>
                  NIT <span className="mp-opcional">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={compradorNit}
                  onChange={(e) => setCompradorNit(e.target.value)}
                  placeholder="Tu NIT para factura"
                  disabled={pagando}
                />
              </div>
            </div>

            {errorPago && <p className="mp-error">{errorPago}</p>}

            <button
              className="mp-btn-pagar"
              onClick={handlePagar}
              disabled={pagando}
            >
              {pagando ? "Procesando..." : `Pagar Bs. ${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}

      <div
        className="ep-hero"
        style={{ backgroundImage: `url(${imagenPrincipal})` }}
      >
        <div className="ep-hero-overlay"></div>
        <div className="ep-hero-content">
          <div className="ep-breadcrumb">
            {ciudad && <span>{ciudad.nombreCiudad}</span>}
            <span className="ep-separator">•</span>
            {eventoData.categoria && <span>{eventoData.categoria}</span>}
          </div>
          <h1 className="ep-titulo-principal">{eventoData.nombreEvento}</h1>
        </div>
      </div>

      <div className="ep-content">
        <main className="ep-main">
          <section className="ep-section">
            <h2>Fecha y Horario</h2>
            <div className="ep-grid-2">
              <div className="ep-info-block">
                <span className="ep-label">Inicio</span>
                <div className="ep-value">{fecha.fechaInicio}</div>
                <div className="ep-value-secondary">{fecha.horaInicio}</div>
              </div>
              <div className="ep-info-block">
                <span className="ep-label">Finalización</span>
                <div className="ep-value">{fecha.fechaFin}</div>
                <div className="ep-value-secondary">{fecha.horaFin}</div>
              </div>
            </div>
          </section>
          <section className="ep-section">
            <h2>Selecciona tus Boletos</h2>
            <div className="ep-boletos-grid">
              {tiposBoleto &&
                tiposBoleto.map((tipo) => (
                  <div key={tipo.id} className="ep-boleto-card">
                    <div className="ep-boleto-header">
                      <h3>{tipo.nombreTipo}</h3>
                      <div className="ep-precio-grande">Bs. {tipo.precio}</div>
                    </div>
                    {tipo.imagenUrl && (
                      <img
                        src={tipo.imagenUrl}
                        alt={tipo.nombreTipo}
                        className="ep-boleto-imagen"
                      />
                    )}
                    {tipo.descripcion && (
                      <p className="ep-boleto-descripcion">
                        {tipo.descripcion}
                      </p>
                    )}
                    <div className="ep-disponibilidad">
                      <span className="ep-disponibles">
                        {tipo.cantidadDisponible} disponibles
                      </span>
                    </div>
                    <div className="ep-selector-cantidad">
                      <button
                        className="ep-btn-cantidad"
                        onClick={() =>
                          actualizarCarrito(
                            tipo.id,
                            (carrito[tipo.id] || 0) - 1,
                          )
                        }
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="0"
                        max={tipo.cantidadDisponible}
                        value={carrito[tipo.id] || 0}
                        onChange={(e) =>
                          actualizarCarrito(
                            tipo.id,
                            Math.max(0, parseInt(e.target.value) || 0),
                          )
                        }
                        className="ep-input-cantidad"
                      />
                      <button
                        className="ep-btn-cantidad"
                        onClick={() =>
                          actualizarCarrito(
                            tipo.id,
                            (carrito[tipo.id] || 0) + 1,
                          )
                        }
                        disabled={
                          tipo.cantidadDisponible <= (carrito[tipo.id] || 0)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
          <section className="ep-section">
            <h2>Ubicación</h2>
            <div className="ep-recinto-info">
              <h3>{recinto.nombreRecinto}</h3>
              <p className="ep-direccion">{recinto.direccionRecinto}</p>
              <div className="ep-grid-2">
                <div className="ep-info-item">
                  <span className="ep-label">Tipo</span>
                  <span className="ep-value">{recinto.tipoRecinto}</span>
                </div>
                <div className="ep-info-item">
                  <span className="ep-label">Capacidad</span>
                  <span className="ep-value">{recinto.capacidad} personas</span>
                </div>
              </div>
              {recinto.descripcionRecinto && (
                <p className="ep-descripcion">{recinto.descripcionRecinto}</p>
              )}
              {recinto.linkUbicacion && (
                <a
                  href={recinto.linkUbicacion}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ep-link-ubicacion"
                >
                  Ver en mapa
                </a>
              )}
            </div>
          </section>

          {eventoData.descuento > 0 && (
            <section className="ep-section ep-descuento-banner">
              <span className="ep-badge-descuento">
                ¡Descuento de {eventoData.descuento}%!
              </span>
            </section>
          )}

          <section className="ep-section">
            <h2>Organizador</h2>
            <div className="ep-organizador">
              {organizador.fotoPerfil && (
                <img
                  src={organizador.fotoPerfil}
                  alt={organizador.nombreUsuario}
                  className="ep-foto-perfil"
                />
              )}
              <div>
                <h4>{organizador.nombreUsuario}</h4>
              </div>
            </div>
          </section>

          {media && media.length > 0 && (
            <section className="ep-section">
              <h2>Galería</h2>
              <div className="ep-galeria">
                {media.map((m) => (
                  <div key={m.id} className="ep-galeria-item">
                    <img src={m.url} alt={`Imagen ${m.orden}`} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {invitados && invitados.length > 0 && (
            <section className="ep-section">
              <h2>Invitados</h2>
              <div className="ep-invitados-lista">
                {invitados.map((inv) => (
                  <div key={inv.idInvitado} className="ep-invitado-card">
                    <h4>{inv.nombreInvitado}</h4>
                    <div className="ep-invitado-info">
                      <span className="ep-badge">{inv.tipoInvitado}</span>
                      <span className="ep-estado">{inv.estadoInvitado}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className="ep-sidebar">
          <div className="ep-carrito-resumen">
            <h3>Resumen de Compra</h3>
            {cantidadBoletos > 0 && (
              <div className="ep-carrito-items">
                {tiposBoleto.map((tipo) => {
                  const cantidad = carrito[tipo.id];
                  if (!cantidad) return null;
                  return (
                    <div key={tipo.id} className="ep-carrito-item">
                      <span className="ep-item-nombre">{tipo.nombreTipo}</span>
                      <span className="ep-item-cantidad">x{cantidad}</span>
                      <span className="ep-item-precio">
                        Bs. {(tipo.precio * cantidad).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <div
              className={`ep-carrito-totales ${cantidadBoletos > 0 ? "ep-tiene-items" : ""}`}
            >
              <div className="ep-total-row">
                <span>Subtotal</span>
                <span>Bs. {subtotal.toFixed(2)}</span>
              </div>
              {(eventoData.descuento || 0) > 0 && (
                <div className="ep-total-row ep-descuento">
                  <span>Descuento ({eventoData.descuento}%)</span>
                  <span>-Bs. {descuento.toFixed(2)}</span>
                </div>
              )}
              <div className="ep-total-row ep-total">
                <span>Total estimado</span>
                <span>Bs. {subtotalConDescuento.toFixed(2)}</span>
              </div>
              <button
                className="ep-btn-comprar"
                disabled={cantidadBoletos === 0}
                onClick={abrirModal}
              >
                {cantidadBoletos > 0
                  ? `Comprar ${cantidadBoletos} ${cantidadBoletos === 1 ? "boleto" : "boletos"}`
                  : "Selecciona boletos"}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
