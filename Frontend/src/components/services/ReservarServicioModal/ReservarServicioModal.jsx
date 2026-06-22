import { useEffect, useState } from 'react';
import { X, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { obtenerItemsDeServicio, reservarServicioSolo, obtenerMisEventosActivos } from '../../../services/MisReservasService';
import PasoPago from '../../MisReservas/PasoPago';
import './ReservarServicioModal.css';

export default function ReservarServicioModal({ servicio, onClose }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [idDetalle, setIdDetalle] = useState('');
  const [idEvento, setIdEvento] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [nota, setNota] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [reservaCreada, setReservaCreada] = useState(null);
  const [pagoHecho, setPagoHecho] = useState(false);

  useEffect(() => {
    Promise.all([
      obtenerItemsDeServicio(servicio.id, token),
      obtenerMisEventosActivos(token),
    ]).then(([itemsData, eventosData]) => {
      setItems(itemsData);
      setEventos(eventosData);
      if (itemsData.length > 0) setIdDetalle(itemsData[0].id);
    }).catch(() => setError('No se pudieron cargar las opciones del servicio.'))
      .finally(() => setCargando(false));
  }, [servicio.id, token]);

  const itemSeleccionado = items.find((i) => i.id === Number(idDetalle));

  const handleReservar = async () => {
    if (!idDetalle) { setError('Selecciona un proveedor/ítem.'); return; }
    setEnviando(true);
    setError('');
    try {
      const resultado = await reservarServicioSolo({
        id_servicio: servicio.id,
        id_detalle: Number(idDetalle),
        cantidad: Number(cantidad) || 1,
        nota,
        id_evento: idEvento || null,
      }, token);
      setReservaCreada(resultado);
    } catch (err) {
      setError(err.message || 'No se pudo reservar el servicio.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="rsm-container" onClick={(e) => e.stopPropagation()}>
        <button className="rsm-close" onClick={onClose}><X size={18} /></button>

        <div className="rsm-header">
          <Briefcase size={20} />
          <div>
            <h2>Reservar servicio</h2>
            <p>{servicio.nombre}</p>
          </div>
        </div>

        {reservaCreada ? (
          <div className="rsm-exito">
            <CheckCircle size={48} color="var(--c1)" />
            <h3>¡Servicio reservado!</h3>
            {!pagoHecho ? (
              <>
                <p>Total a pagar: <strong>Bs {Number(reservaCreada.monto_total).toFixed(2)}</strong></p>
                <PasoPago
                  idOrden={reservaCreada.id_orden}
                  montoTotal={Number(reservaCreada.monto_total)}
                  onPagado={() => setPagoHecho(true)}
                />
              </>
            ) : (
              <p>¡Pago registrado! Revisa el detalle en "Mis Reservas".</p>
            )}
            <button className="rsm-btn-primary" onClick={onClose} style={{ marginTop: 14 }}>Cerrar</button>
          </div>
        ) : cargando ? (
          <div className="rsm-cargando">Cargando opciones...</div>
        ) : (
          <div className="rsm-body">
            <label className="rsm-label">Proveedor / ítem</label>
            <select className="rsm-select" value={idDetalle} onChange={(e) => setIdDetalle(e.target.value)}>
              {items.length === 0 && <option value="">Sin ítems disponibles</option>}
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.nombre_item} — {it.proveedor?.nombre_comercial} — Bs {it.precio_item}
                </option>
              ))}
            </select>

            <label className="rsm-label">Cantidad</label>
            <input
              type="number"
              min="1"
              className="rsm-input"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />

            <label className="rsm-label">Evento (opcional)</label>
            <select className="rsm-select" value={idEvento} onChange={(e) => setIdEvento(e.target.value)}>
              <option value="">Sin vincular a un evento</option>
              {eventos.map((ev) => (
                <option key={ev.id_evento} value={ev.id_evento}>{ev.nombre_evento}</option>
              ))}
            </select>

            <label className="rsm-label">Nota (opcional)</label>
            <textarea
              className="rsm-textarea"
              rows={2}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Detalles adicionales para el proveedor..."
            />

            {itemSeleccionado && (
              <div className="rsm-resumen">
                Total estimado: <strong>Bs {(itemSeleccionado.precio_item * (Number(cantidad) || 1)).toFixed(2)}</strong>
              </div>
            )}

            {error && (
              <div className="rsm-error"><AlertCircle size={14} /> {error}</div>
            )}

            <div className="rsm-actions">
              <button className="rsm-btn-secondary" onClick={onClose}>Cancelar</button>
              <button className="rsm-btn-primary" onClick={handleReservar} disabled={enviando || items.length === 0}>
                {enviando ? 'Reservando...' : 'Reservar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
