import { useState, useEffect } from 'react';
import { Ticket, MapPin, Briefcase, Calendar, Clock, RefreshCcw, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import MyTickets from '../Events/MyTickets/MyTickets';
import { obtenerMisReservasRecinto, obtenerMisServiciosReservados } from '../../services/MisReservasService';
import PasoPago from './PasoPago';
import './MisReservas.css';

const TABS = [
  { id: 'boletos', label: 'Boletos', icon: Ticket },
  { id: 'recintos', label: 'Recintos', icon: MapPin },
  { id: 'servicios', label: 'Servicios', icon: Briefcase },
];

export default function MisReservas() {
  const [tab, setTab] = useState('boletos');

  return (
    <div className="misreservas-wrap">
      <div className="misreservas-header">
        <h1>Mis Reservas</h1>
        <div className="misreservas-tabs">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`misreservas-tab ${tab === id ? 'is-active' : ''}`}
              onClick={() => setTab(id)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === 'boletos' && <MyTickets />}
      {tab === 'recintos' && <PanelRecintos />}
      {tab === 'servicios' && <PanelServicios />}
    </div>
  );
}

function PanelRecintos() {
  const { token } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [pagandoId, setPagandoId] = useState(null);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      setReservas(await obtenerMisReservasRecinto(token));
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  if (cargando) return <EstadoCargando />;
  if (error) return <EstadoError mensaje={error} reintentar={cargar} />;
  if (reservas.length === 0) {
    return <EstadoVacio icono={MapPin} titulo="No tienes recintos reservados" subtitulo="Reserva un salón desde la sección Recintos." />;
  }

  return (
    <div className="misreservas-grid">
      {reservas.map((ev) => (
        <div className="misreservas-card" key={ev.id_evento}>
          <div
            className="misreservas-card-img"
            style={ev.imagen_url ? { backgroundImage: `url(${ev.imagen_url})` } : undefined}
          >
            {!ev.imagen_url && <MapPin size={28} />}
          </div>
          <div className="misreservas-card-body">
            <h3>{ev.nombre_evento}</h3>
            {ev.recinto?.nombre_recinto && (
              <p className="misreservas-card-sub"><MapPin size={13} /> {ev.recinto.nombre_recinto}</p>
            )}
            {ev.fecha_evento?.fecha_inicio && (
              <p className="misreservas-card-sub">
                <Calendar size={13} /> {ev.fecha_evento.fecha_inicio}
                {ev.fecha_evento.hora_inicio && <> <Clock size={13} /> {ev.fecha_evento.hora_inicio}</>}
              </p>
            )}
            <span className={`misreservas-badge ${claseEstado(ev.estado_evento)}`}>
              {ev.estado_evento}
            </span>

            {ev.saldo_pendiente > 0 && (
              pagandoId === ev.id_orden ? (
                <div className="misreservas-pago-inline">
                  <PasoPago
                    idOrden={ev.id_orden}
                    montoTotal={Number(ev.monto_total)}
                    onPagado={() => { setPagandoId(null); cargar(); }}
                  />
                </div>
              ) : (
                <>
                  <p className="misreservas-saldo">Saldo pendiente: Bs {Number(ev.saldo_pendiente).toFixed(2)} de Bs {Number(ev.monto_total).toFixed(2)}</p>
                  <button className="misreservas-btn-pagar" onClick={() => setPagandoId(ev.id_orden)}>
                    <CreditCard size={14} /> Completar pago
                  </button>
                </>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function PanelServicios() {
  const { token } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [pagandoId, setPagandoId] = useState(null);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      setServicios(await obtenerMisServiciosReservados(token));
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  if (cargando) return <EstadoCargando />;
  if (error) return <EstadoError mensaje={error} reintentar={cargar} />;
  if (servicios.length === 0) {
    return <EstadoVacio icono={Briefcase} titulo="No tienes servicios reservados" subtitulo="Reserva un servicio desde la sección Servicios." />;
  }

  return (
    <div className="misreservas-grid">
      {servicios.map((s) => (
        <div className="misreservas-card" key={s.id}>
          <div className="misreservas-card-img misreservas-card-img--icon">
            <Briefcase size={28} />
          </div>
          <div className="misreservas-card-body">
            <h3>{s.detalle_proveedor_servicio?.nombre_item ?? s.servicio?.nombre_servicio ?? 'Servicio'}</h3>
            <p className="misreservas-card-sub">Cantidad: {s.cantidad}</p>
            {s.proveedor?.nombre_comercial && (
              <p className="misreservas-card-sub">Proveedor: {s.proveedor.nombre_comercial}</p>
            )}
            {s.evento?.nombre_evento && (
              <p className="misreservas-card-sub">Evento: {s.evento.nombre_evento}</p>
            )}
            {s.nota && <p className="misreservas-card-nota">{s.nota}</p>}
            <span className={`misreservas-badge ${claseEstado(s.estado)}`}>{s.estado}</span>

            {s.saldo_pendiente > 0 && (
              pagandoId === s.id_orden ? (
                <div className="misreservas-pago-inline">
                  <PasoPago
                    idOrden={s.id_orden}
                    montoTotal={Number(s.monto_total)}
                    onPagado={() => { setPagandoId(null); cargar(); }}
                  />
                </div>
              ) : (
                <>
                  <p className="misreservas-saldo">Saldo pendiente: Bs {Number(s.saldo_pendiente).toFixed(2)} de Bs {Number(s.monto_total).toFixed(2)}</p>
                  <button className="misreservas-btn-pagar" onClick={() => setPagandoId(s.id_orden)}>
                    <CreditCard size={14} /> Completar pago
                  </button>
                </>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function claseEstado(estado) {
  const e = (estado || '').trim().toLowerCase();
  if (e === 'cancelado') return 'misreservas-badge--rojo';
  if (e === 'finalizado') return 'misreservas-badge--gris';
  return 'misreservas-badge--verde';
}

function EstadoCargando() {
  return <div className="misreservas-estado">Cargando...</div>;
}

function EstadoError({ mensaje, reintentar }) {
  return (
    <div className="misreservas-estado misreservas-estado--error">
      <p>{mensaje}</p>
      <button className="misreservas-btn-reintentar" onClick={reintentar}>
        <RefreshCcw size={14} /> Reintentar
      </button>
    </div>
  );
}

function EstadoVacio({ icono: Icono, titulo, subtitulo }) {
  return (
    <div className="misreservas-estado">
      <Icono size={40} />
      <p className="misreservas-estado-titulo">{titulo}</p>
      <p className="misreservas-estado-sub">{subtitulo}</p>
    </div>
  );
}
