import { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, Check, ShoppingBag, CalendarDays, AlertTriangle, BellRing } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import { obtenerNotificaciones, marcarNotificacionLeida, marcarTodasLeidas } from '../../../services/NotificacionService'
import './NotificationBell.css'

const ICONOS = {
  compra_confirmada: ShoppingBag,
  pre_orden: ShoppingBag,
  orden_cancelada: AlertTriangle,
  evento_creado: CalendarDays,
  evento_cancelado: AlertTriangle,
  evento_finalizado: CalendarDays,
  evento_agotado: BellRing,
  saldo_pendiente: AlertTriangle,
}

const formatearFecha = (fecha) => {
  const f = new Date(fecha)
  const ahora = new Date()
  const diffMin = Math.floor((ahora - f) / 60000)
  if (diffMin < 1) return 'ahora mismo'
  if (diffMin < 60) return `hace ${diffMin} min`
  const diffHoras = Math.floor(diffMin / 60)
  if (diffHoras < 24) return `hace ${diffHoras} h`
  return f.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

export default function NotificationBell() {
  const { usuario, token } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const [notificaciones, setNotificaciones] = useState([])
  const [noLeidas, setNoLeidas] = useState(0)
  const panelRef = useRef(null)

  const cargar = useCallback(async () => {
    if (!token) return
    try {
      const data = await obtenerNotificaciones(token)
      setNotificaciones(data.notificaciones)
      setNoLeidas(data.noLeidas)
    } catch {
      // Si falla un ciclo de polling no rompemos la interfaz, se reintenta solo
    }
  }, [token])

  // Carga inicial + actualización automática cada 15s (casi en tiempo real)
  useEffect(() => {
    if (!usuario) return
    cargar()
    const intervalo = setInterval(cargar, 15000)
    return () => clearInterval(intervalo)
  }, [usuario, cargar])

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setAbierto(false)
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  if (!usuario) return null

  const handleClickNotificacion = async (n) => {
    if (n.estado_notificacion === 'No leida') {
      try {
        await marcarNotificacionLeida(n.id_notificacion, token)
        setNotificaciones(prev => prev.map(x => x.id_notificacion === n.id_notificacion ? { ...x, estado_notificacion: 'Leida' } : x))
        setNoLeidas(prev => Math.max(0, prev - 1))
      } catch { /* noop */ }
    }
  }

  const handleMarcarTodas = async () => {
    try {
      await marcarTodasLeidas(token)
      setNotificaciones(prev => prev.map(x => ({ ...x, estado_notificacion: 'Leida' })))
      setNoLeidas(0)
    } catch { /* noop */ }
  }

  return (
    <div className="notif-wrap" ref={panelRef}>
      <button className="notif-btn" onClick={() => setAbierto(!abierto)} aria-label="Notificaciones">
        <Bell size={18} />
        {noLeidas > 0 && <span className="notif-badge">{noLeidas > 9 ? '9+' : noLeidas}</span>}
      </button>

      {abierto && (
        <div className="notif-panel">
          <div className="notif-panel-header">
            <span>Notificaciones</span>
            {noLeidas > 0 && (
              <button className="notif-marcar-todas" onClick={handleMarcarTodas}>
                <Check size={13} /> Marcar todas
              </button>
            )}
          </div>

          <div className="notif-lista">
            {notificaciones.length === 0 ? (
              <div className="notif-vacio">No tienes notificaciones todavía.</div>
            ) : (
              notificaciones.map(n => {
                const Icono = ICONOS[n.tipo_notificacion] || Bell
                const noLeida = n.estado_notificacion === 'No leida'
                return (
                  <button
                    key={n.id_notificacion}
                    className={`notif-item ${noLeida ? 'notif-item--nueva' : ''}`}
                    onClick={() => handleClickNotificacion(n)}
                  >
                    <span className="notif-item-icono"><Icono size={15} /></span>
                    <span className="notif-item-cuerpo">
                      <span className="notif-item-mensaje">{n.mensaje}</span>
                      <span className="notif-item-fecha">{formatearFecha(n.fecha_envio)}</span>
                    </span>
                    {noLeida && <span className="notif-item-dot" />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
