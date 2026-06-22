import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  Users, CalendarDays, MapPin, Briefcase, ShieldCheck,
  Check, X, Pencil, Plus, RefreshCcw, Image as ImageIcon, Ticket
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  adminListarUsuarios, adminCambiarEstadoUsuario, adminCambiarRolUsuario, adminListarRoles,
  adminListarEventos, adminActualizarEvento, adminCrearEventoPublico,
  adminListarRecintos, adminCrearRecinto, adminActualizarRecinto, adminListarCiudades,
  adminListarServicios, adminListarCategoriasServicio, adminCrearServicio, adminActualizarServicio
} from '../../services/AdminService'
import './AdminPage.css'

const TABS = [
  { id: 'usuarios', label: 'Usuarios', icon: Users },
  { id: 'eventos', label: 'Eventos', icon: CalendarDays },
  { id: 'recintos', label: 'Recintos', icon: MapPin },
  { id: 'servicios', label: 'Servicios', icon: Briefcase },
]

export default function AdminPage() {
  const { usuario, token } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('usuarios')

  const esAdmin = (usuario?.nombre_rol || '').trim().toLowerCase() === 'administrador'

  useEffect(() => {
    if (!usuario) { navigate('/login'); return }
    if (!esAdmin) navigate('/')
  }, [usuario, esAdmin, navigate])

  if (!usuario || !esAdmin) return null

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <ShieldCheck size={22} />
          <span>Panel Admin</span>
        </div>
        <nav className="admin-sidebar-nav">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`admin-sidebar-link ${tab === id ? 'is-active' : ''}`}
              onClick={() => setTab(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <button className="admin-sidebar-back" onClick={() => navigate('/')}>
          ← Volver al sitio
        </button>
      </aside>

      <main className="admin-content">
        <header className="admin-content-header">
          <h1>{TABS.find(t => t.id === tab)?.label}</h1>
          <span className="admin-content-subtitle">Hola, {usuario.nombre_usuario}</span>
        </header>

        <div className="admin-panel-container">
          {tab === 'usuarios' && <PanelUsuarios token={token} />}
          {tab === 'eventos' && <PanelEventos token={token} />}
          {tab === 'recintos' && <PanelRecintos token={token} />}
          {tab === 'servicios' && <PanelServicios token={token} />}
        </div>
      </main>
    </div>
  )
}

// ─── PANEL USUARIOS ─────────────────────────────────────────────────────────

function PanelUsuarios({ token }) {
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargar = async (silencioso = false) => {
    if (!silencioso) setCargando(true)
    setError('')
    try {
      const [u, r] = await Promise.all([adminListarUsuarios(token), adminListarRoles(token)])
      setUsuarios(u)
      setRoles(r)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
    const intervalo = setInterval(() => cargar(true), 20000) // auto-actualiza cada 20s, en silencio
    return () => clearInterval(intervalo)
  }, [])

  const toggleEstado = async (u) => {
    const nuevo = (u.estado_usuario || '').toLowerCase() === 'activo' ? 'Inactivo' : 'Activo'
    try {
      const actualizado = await adminCambiarEstadoUsuario(u.id_usuario, nuevo, token)
      setUsuarios(prev => prev.map(x => x.id_usuario === u.id_usuario ? { ...x, estado_usuario: actualizado.estado_usuario } : x))
    } catch (err) { alert(err.message) }
  }

  const cambiarRol = async (u, id_rol) => {
    try {
      await adminCambiarRolUsuario(u.id_usuario, Number(id_rol), token)
      const rolNuevo = roles.find(r => r.id_rol === Number(id_rol))
      setUsuarios(prev => prev.map(x => x.id_usuario === u.id_usuario ? { ...x, id_rol: Number(id_rol), rol: rolNuevo } : x))
    } catch (err) { alert(err.message) }
  }

  if (cargando) return <EstadoCargando />
  if (error) return <EstadoError mensaje={error} reintentar={cargar} />

  return (
    <div className="admin-panel">
      <div className="admin-panel-toolbar">
        <span className="admin-panel-count">{usuarios.length} usuarios registrados</span>
        <button className="admin-btn-ghost" onClick={cargar}><RefreshCcw size={15} /> Actualizar</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id_usuario}>
                <td className="admin-cell-strong">{u.nombre_usuario}</td>
                <td>@{u.username}</td>
                <td>{u.correo}</td>
                <td>{u.telefono}</td>
                <td>
                  <select
                    className="admin-select-inline"
                    value={u.id_rol}
                    onChange={(e) => cambiarRol(u, e.target.value)}
                  >
                    {roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.nombre}</option>)}
                  </select>
                </td>
                <td>
                  <button
                    className={`admin-badge-toggle ${(u.estado_usuario || '').toLowerCase() === 'activo' ? 'is-active' : 'is-inactive'}`}
                    onClick={() => toggleEstado(u)}
                  >
                    {(u.estado_usuario || '').toLowerCase() === 'activo' ? <Check size={14} /> : <X size={14} />}
                    {u.estado_usuario}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── PANEL EVENTOS ──────────────────────────────────────────────────────────

const ESTADOS_EVENTO = ['Próximo', 'Activo', 'Programado', 'En reserva', 'Confirmado', 'Cancelado', 'Finalizado', 'Agotado', 'Reprogramado']
const CATEGORIAS_EVENTO = ['Concierto', 'Festival', 'Teatro', 'Deportivo', 'Cultural', 'Conferencia', 'Otro']

const EVENTO_VACIO = {
  nombre_evento: '', categoria: 'Concierto', id_recinto: '',
  fecha_inicio: '', fecha_fin: '', hora_inicio: '18:00', hora_fin: '23:00',
  imagen_url: '', galeria: [], nuevaImagenGaleria: '',
  tipos_boleto: [{ nombre_tipo: '', precio: '', cantidad_total: '' }]
}

const EVENTO_EDITAR_VACIO = {
  nombre_evento: '', categoria: 'Concierto', id_recinto: '', imagen_url: '', estado_evento: ''
}

function PanelEventos({ token }) {
  const [eventos, setEventos] = useState([])
  const [recintos, setRecintos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [formEditar, setFormEditar] = useState(EVENTO_EDITAR_VACIO)
  const [form, setForm] = useState(EVENTO_VACIO)
  const [guardando, setGuardando] = useState(false)

  const cargar = async (silencioso = false) => {
    if (!silencioso) setCargando(true)
    setError('')
    try {
      const [e, r] = await Promise.all([adminListarEventos(token), adminListarRecintos(token)])
      setEventos(e)
      setRecintos(r)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
    const intervalo = setInterval(() => cargar(true), 20000)
    return () => clearInterval(intervalo)
  }, [])

  const abrirEditar = (ev) => {
    setEditando(ev)
    setFormEditar({
      nombre_evento: ev.nombre_evento ?? '',
      categoria: ev.categoria ?? 'Concierto',
      id_recinto: ev.id_recinto ?? '',
      imagen_url: ev.imagen_url ?? '',
      estado_evento: ev.estado_evento ?? ''
    })
  }

  const guardarEdicion = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      const cambios = {
        nombre_evento: formEditar.nombre_evento,
        categoria: formEditar.categoria,
        imagen_url: formEditar.imagen_url,
        estado_evento: formEditar.estado_evento,
      }
      if (formEditar.id_recinto) cambios.id_recinto = Number(formEditar.id_recinto)
      const actualizado = await adminActualizarEvento(editando.id_evento, cambios, token)
      setEventos(prev => prev.map(x => x.id_evento === editando.id_evento ? { ...x, ...actualizado } : x))
      setEditando(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const cancelarEvento = async (ev) => {
    if (!window.confirm(`¿Cancelar el evento "${ev.nombre_evento}"? Esta acción notificará al cliente.`)) return
    try {
      const actualizado = await adminActualizarEvento(ev.id_evento, { estado_evento: 'Cancelado' }, token)
      setEventos(prev => prev.map(x => x.id_evento === ev.id_evento ? { ...x, ...actualizado } : x))
    } catch (err) {
      alert(err.message)
    }
  }

  const agregarTipoBoleto = () => {
    setForm({ ...form, tipos_boleto: [...form.tipos_boleto, { nombre_tipo: '', precio: '', cantidad_total: '' }] })
  }

  const quitarTipoBoleto = (i) => {
    setForm({ ...form, tipos_boleto: form.tipos_boleto.filter((_, idx) => idx !== i) })
  }

  const cambiarTipoBoleto = (i, campo, valor) => {
    const copia = [...form.tipos_boleto]
    copia[i] = { ...copia[i], [campo]: valor }
    setForm({ ...form, tipos_boleto: copia })
  }

  const agregarImagenGaleria = () => {
    if (!form.nuevaImagenGaleria.trim()) return
    setForm({ ...form, galeria: [...form.galeria, form.nuevaImagenGaleria.trim()], nuevaImagenGaleria: '' })
  }

  const quitarImagenGaleria = (i) => {
    setForm({ ...form, galeria: form.galeria.filter((_, idx) => idx !== i) })
  }

  const guardarEvento = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      const payload = {
        nombre_evento: form.nombre_evento,
        categoria: form.categoria,
        id_recinto: Number(form.id_recinto),
        fecha_inicio: form.fecha_inicio,
        fecha_fin: form.fecha_fin,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        imagen_url: form.imagen_url,
        galeria: form.galeria,
        tipos_boleto: form.tipos_boleto
          .filter(t => t.nombre_tipo.trim())
          .map(t => ({ nombre_tipo: t.nombre_tipo, precio: Number(t.precio) || 0, cantidad_total: Number(t.cantidad_total) || 0 }))
      }
      const nuevo = await adminCrearEventoPublico(payload, token)
      setEventos(prev => [{ ...nuevo, recinto: recintos.find(r => r.id_recinto === payload.id_recinto) }, ...prev])
      setForm(EVENTO_VACIO)
      setMostrarForm(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) return <EstadoCargando />
  if (error) return <EstadoError mensaje={error} reintentar={cargar} />

  return (
    <div className="admin-panel">
      <div className="admin-panel-toolbar">
        <span className="admin-panel-count">{eventos.length} eventos</span>
        <div className="admin-panel-toolbar-actions">
          <button className="admin-btn-ghost" onClick={cargar}><RefreshCcw size={15} /> Actualizar</button>
          <button className="admin-btn-primary" onClick={() => { setMostrarForm(true); setEditando(null) }}><Plus size={16} /> Nuevo evento público</button>
        </div>
      </div>

      {editando && (
        <form className="admin-form-card" onSubmit={guardarEdicion}>
          <h3>Editar evento — {editando.nombre_evento}</h3>
          <div className="admin-form-grid">
            <Campo label="Nombre del evento">
              <input required value={formEditar.nombre_evento} onChange={e => setFormEditar({ ...formEditar, nombre_evento: e.target.value })} />
            </Campo>
            <Campo label="Categoría">
              <select value={formEditar.categoria} onChange={e => setFormEditar({ ...formEditar, categoria: e.target.value })}>
                {CATEGORIAS_EVENTO.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Campo>
            <Campo label="Recinto">
              <select value={formEditar.id_recinto} onChange={e => setFormEditar({ ...formEditar, id_recinto: e.target.value })}>
                <option value="">Sin cambiar</option>
                {recintos.map(r => <option key={r.id_recinto} value={r.id_recinto}>{r.nombre_recinto}</option>)}
              </select>
            </Campo>
            <Campo label="Estado">
              <select value={formEditar.estado_evento} onChange={e => setFormEditar({ ...formEditar, estado_evento: e.target.value })}>
                {ESTADOS_EVENTO.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Campo>
            <Campo label="Imagen principal (URL)" ancho>
              <input value={formEditar.imagen_url} onChange={e => setFormEditar({ ...formEditar, imagen_url: e.target.value })} placeholder="https://..." />
            </Campo>
          </div>
          <div className="admin-form-actions">
            <button type="button" className="admin-btn-ghost" onClick={() => setEditando(null)}>Cancelar</button>
            <button type="submit" className="admin-btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      )}

      {mostrarForm && !editando && (
        <form className="admin-form-card" onSubmit={guardarEvento}>
          <h3>Nuevo evento público</h3>
          <div className="admin-form-grid">
            <Campo label="Nombre del evento">
              <input required value={form.nombre_evento} onChange={e => setForm({ ...form, nombre_evento: e.target.value })} placeholder="Ej. Concierto de Rock" />
            </Campo>
            <Campo label="Categoría">
              <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                {CATEGORIAS_EVENTO.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Campo>
            <Campo label="Ubicación / Recinto">
              <select required value={form.id_recinto} onChange={e => setForm({ ...form, id_recinto: e.target.value })}>
                <option value="">Selecciona el lugar...</option>
                {recintos.map(r => <option key={r.id_recinto} value={r.id_recinto}>{r.nombre_recinto}</option>)}
              </select>
            </Campo>
            <Campo label="Fecha inicio">
              <input required type="date" value={form.fecha_inicio} onChange={e => setForm({ ...form, fecha_inicio: e.target.value })} />
            </Campo>
            <Campo label="Hora inicio">
              <input required type="time" value={form.hora_inicio} onChange={e => setForm({ ...form, hora_inicio: e.target.value })} />
            </Campo>
            <Campo label="Fecha fin">
              <input required type="date" value={form.fecha_fin} onChange={e => setForm({ ...form, fecha_fin: e.target.value })} />
            </Campo>
            <Campo label="Hora fin">
              <input required type="time" value={form.hora_fin} onChange={e => setForm({ ...form, hora_fin: e.target.value })} />
            </Campo>
            <Campo label="Imagen principal (URL)" ancho>
              <input value={form.imagen_url} onChange={e => setForm({ ...form, imagen_url: e.target.value })} placeholder="https://..." />
            </Campo>
          </div>

          <div className="admin-subseccion">
            <div className="admin-subseccion-titulo"><ImageIcon size={16} /> Galería de fotos</div>
            <div className="admin-galeria-input">
              <input placeholder="Pega una URL de imagen y dale Agregar" value={form.nuevaImagenGaleria} onChange={e => setForm({ ...form, nuevaImagenGaleria: e.target.value })} />
              <button type="button" className="admin-btn-ghost" onClick={agregarImagenGaleria}>+ Agregar</button>
            </div>
            {form.galeria.length > 0 && (
              <div className="admin-galeria-grid">
                {form.galeria.map((url, i) => (
                  <div className="admin-galeria-item" key={i}>
                    <img src={url} alt="" onError={(e) => { e.target.style.display = 'none' }} />
                    <button type="button" onClick={() => quitarImagenGaleria(i)}><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-subseccion">
            <div className="admin-subseccion-titulo"><Ticket size={16} /> Tipos de entrada</div>
            {form.tipos_boleto.map((t, i) => (
              <div className="admin-tipoboleto-row" key={i}>
                <input placeholder="Nombre (ej. General, VIP)" value={t.nombre_tipo} onChange={e => cambiarTipoBoleto(i, 'nombre_tipo', e.target.value)} />
                <input type="number" min="0" placeholder="Precio Bs" value={t.precio} onChange={e => cambiarTipoBoleto(i, 'precio', e.target.value)} />
                <input type="number" min="0" placeholder="Cantidad" value={t.cantidad_total} onChange={e => cambiarTipoBoleto(i, 'cantidad_total', e.target.value)} />
                {form.tipos_boleto.length > 1 && (
                  <button type="button" className="admin-btn-icon" onClick={() => quitarTipoBoleto(i)}><X size={14} /></button>
                )}
              </div>
            ))}
            <button type="button" className="admin-btn-ghost" onClick={agregarTipoBoleto}><Plus size={14} /> Agregar tipo de entrada</button>
          </div>

          <div className="admin-form-actions">
            <button type="button" className="admin-btn-ghost" onClick={() => { setForm(EVENTO_VACIO); setMostrarForm(false) }}>Cancelar</button>
            <button type="submit" className="admin-btn-primary" disabled={guardando}>
              {guardando ? 'Creando...' : 'Crear evento'}
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Recinto</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {eventos.map(ev => (
              <tr key={ev.id_evento}>
                <td className="admin-cell-strong">{ev.nombre_evento}</td>
                <td>{ev.recinto?.nombre_recinto ?? '—'}</td>
                <td>{ev.fecha_evento?.fecha_inicio ?? '—'}</td>
                <td>
                  <span className={`admin-tag ${ev.es_publico ? 'admin-tag--public' : 'admin-tag--private'}`}>
                    {ev.es_publico ? 'Público' : 'Privado'}
                  </span>
                </td>
                <td>
                  <span className={`admin-tag ${ev.estado_evento === 'Cancelado' ? 'admin-tag--private' : 'admin-tag--public'}`}>
                    {ev.estado_evento}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="admin-btn-icon" title="Editar" onClick={() => { setMostrarForm(false); abrirEditar(ev) }}>
                      <Pencil size={14} />
                    </button>
                    {ev.estado_evento !== 'Cancelado' && (
                      <button
                        className="admin-btn-icon"
                        title="Cancelar evento"
                        style={{ color: '#C0392B', borderColor: '#C0392B' }}
                        onClick={() => cancelarEvento(ev)}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── PANEL RECINTOS ─────────────────────────────────────────────────────────

const RECINTO_VACIO = {
  nombre_recinto: '', id_ciudad: '', direccion_recinto: '', tipo_recinto: 'Cerrado',
  descripcion_recinto: '', capacidad: '', estado_recinto: 'Disponible',
  link_ubicacion: '', precio_hora: '', imagen_url: '', nota: ''
}

function PanelRecintos({ token }) {
  const [recintos, setRecintos] = useState([])
  const [ciudades, setCiudades] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(RECINTO_VACIO)
  const [guardando, setGuardando] = useState(false)

  const cargar = async (silencioso = false) => {
    if (!silencioso) setCargando(true)
    setError('')
    try {
      const [r, c] = await Promise.all([adminListarRecintos(token), adminListarCiudades()])
      setRecintos(r)
      setCiudades(c)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
    const intervalo = setInterval(() => cargar(true), 20000) // auto-actualiza cada 20s, en silencio
    return () => clearInterval(intervalo)
  }, [])

  const abrirNuevo = () => { setEditando(null); setForm(RECINTO_VACIO); setMostrarForm(true) }
  const abrirEditar = (r) => {
    setEditando(r)
    setForm({
      nombre_recinto: r.nombre_recinto ?? '', id_ciudad: r.id_ciudad ?? '',
      direccion_recinto: r.direccion_recinto ?? '', tipo_recinto: r.tipo_recinto ?? 'Cerrado',
      descripcion_recinto: r.descripcion_recinto ?? '', capacidad: r.capacidad ?? '',
      estado_recinto: r.estado_recinto ?? 'Disponible', link_ubicacion: r.link_ubicacion ?? '',
      precio_hora: r.precio_hora ?? '', imagen_url: r.imagen_url ?? '', nota: r.nota ?? ''
    })
    setMostrarForm(true)
  }

  const guardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      const payload = {
        ...form,
        id_ciudad: Number(form.id_ciudad),
        capacidad: Number(form.capacidad) || 0,
        precio_hora: Number(form.precio_hora) || 0
      }
      if (editando) {
        const actualizado = await adminActualizarRecinto(editando.id_recinto, payload, token)
        setRecintos(prev => prev.map(x => x.id_recinto === editando.id_recinto ? { ...x, ...actualizado } : x))
      } else {
        const nuevo = await adminCrearRecinto(payload, token)
        setRecintos(prev => [nuevo, ...prev])
      }
      setMostrarForm(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) return <EstadoCargando />
  if (error) return <EstadoError mensaje={error} reintentar={cargar} />

  return (
    <div className="admin-panel">
      <div className="admin-panel-toolbar">
        <span className="admin-panel-count">{recintos.length} recintos</span>
        <div className="admin-panel-toolbar-actions">
          <button className="admin-btn-ghost" onClick={cargar}><RefreshCcw size={15} /> Actualizar</button>
          <button className="admin-btn-primary" onClick={abrirNuevo}><Plus size={16} /> Nuevo recinto</button>
        </div>
      </div>

      {mostrarForm && (
        <form className="admin-form-card" onSubmit={guardar}>
          <h3>{editando ? 'Editar recinto' : 'Nuevo recinto'}</h3>
          <div className="admin-form-grid">
            <Campo label="Nombre">
              <input required value={form.nombre_recinto} onChange={e => setForm({ ...form, nombre_recinto: e.target.value })} />
            </Campo>
            <Campo label="Ciudad">
              <select required value={form.id_ciudad} onChange={e => setForm({ ...form, id_ciudad: e.target.value })}>
                <option value="">Selecciona...</option>
                {ciudades.map(c => <option key={c.id_ciudad} value={c.id_ciudad}>{c.nombre_ciudad}</option>)}
              </select>
            </Campo>
            <Campo label="Dirección">
              <input value={form.direccion_recinto} onChange={e => setForm({ ...form, direccion_recinto: e.target.value })} />
            </Campo>
            <Campo label="Tipo">
              <select value={form.tipo_recinto} onChange={e => setForm({ ...form, tipo_recinto: e.target.value })}>
                <option value="Cerrado">Cerrado</option>
                <option value="Al aire libre">Al aire libre</option>
                <option value="Mixto">Mixto</option>
              </select>
            </Campo>
            <Campo label="Capacidad">
              <input type="number" min="0" value={form.capacidad} onChange={e => setForm({ ...form, capacidad: e.target.value })} />
            </Campo>
            <Campo label="Precio por hora (Bs)">
              <input type="number" min="0" value={form.precio_hora} onChange={e => setForm({ ...form, precio_hora: e.target.value })} />
            </Campo>
            <Campo label="Estado">
              <select value={form.estado_recinto} onChange={e => setForm({ ...form, estado_recinto: e.target.value })}>
                <option value="Disponible">Disponible</option>
                <option value="No disponible">No disponible</option>
              </select>
            </Campo>
            <Campo label="Imagen (URL)">
              <input value={form.imagen_url} onChange={e => setForm({ ...form, imagen_url: e.target.value })} />
            </Campo>
            <Campo label="Enlace al mapa">
              <input value={form.link_ubicacion} onChange={e => setForm({ ...form, link_ubicacion: e.target.value })} />
            </Campo>
            <Campo label="Descripción" ancho>
              <textarea rows={2} value={form.descripcion_recinto} onChange={e => setForm({ ...form, descripcion_recinto: e.target.value })} />
            </Campo>
            <Campo label="Nota interna" ancho>
              <textarea rows={2} value={form.nota} onChange={e => setForm({ ...form, nota: e.target.value })} />
            </Campo>
          </div>
          <div className="admin-form-actions">
            <button type="button" className="admin-btn-ghost" onClick={() => setMostrarForm(false)}>Cancelar</button>
            <button type="submit" className="admin-btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ciudad</th>
              <th>Tipo</th>
              <th>Capacidad</th>
              <th>Precio/hr</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recintos.map(r => (
              <tr key={r.id_recinto}>
                <td className="admin-cell-strong">{r.nombre_recinto}</td>
                <td>{r.ciudad?.nombre_ciudad ?? '—'}</td>
                <td>{r.tipo_recinto}</td>
                <td>{r.capacidad}</td>
                <td>Bs {r.precio_hora}</td>
                <td>
                  <span className={`admin-tag ${r.estado_recinto === 'Disponible' ? 'admin-tag--public' : 'admin-tag--private'}`}>
                    {r.estado_recinto}
                  </span>
                </td>
                <td>
                  <button className="admin-btn-icon" onClick={() => abrirEditar(r)}><Pencil size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── PANEL SERVICIOS ────────────────────────────────────────────────────────

const SERVICIO_VACIO = { nombre_servicio: '', categoria: '', estado: 'Activo' }

function PanelServicios({ token }) {
  const [servicios, setServicios] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(SERVICIO_VACIO)
  const [guardando, setGuardando] = useState(false)

  const cargar = async (silencioso = false) => {
    if (!silencioso) setCargando(true)
    setError('')
    try {
      const [s, c] = await Promise.all([adminListarServicios(token), adminListarCategoriasServicio(token)])
      setServicios(s)
      setCategorias(c)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
    const intervalo = setInterval(() => cargar(true), 20000) // auto-actualiza cada 20s, en silencio
    return () => clearInterval(intervalo)
  }, [])

  const abrirNuevo = () => { setEditando(null); setForm(SERVICIO_VACIO); setMostrarForm(true) }
  const abrirEditar = (s) => {
    setEditando(s)
    setForm({ nombre_servicio: s.nombre_servicio ?? '', categoria: s.categoria ?? '', estado: s.estado ?? 'Activo' })
    setMostrarForm(true)
  }

  const guardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      const payload = { ...form, categoria: Number(form.categoria) }
      if (editando) {
        const actualizado = await adminActualizarServicio(editando.id_servicio, payload, token)
        setServicios(prev => prev.map(x => x.id_servicio === editando.id_servicio ? { ...x, ...actualizado } : x))
      } else {
        const nuevo = await adminCrearServicio(payload, token)
        setServicios(prev => [nuevo, ...prev])
      }
      setMostrarForm(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) return <EstadoCargando />
  if (error) return <EstadoError mensaje={error} reintentar={cargar} />

  return (
    <div className="admin-panel">
      <div className="admin-panel-toolbar">
        <span className="admin-panel-count">{servicios.length} servicios</span>
        <div className="admin-panel-toolbar-actions">
          <button className="admin-btn-ghost" onClick={cargar}><RefreshCcw size={15} /> Actualizar</button>
          <button className="admin-btn-primary" onClick={abrirNuevo}><Plus size={16} /> Nuevo servicio</button>
        </div>
      </div>

      {mostrarForm && (
        <form className="admin-form-card" onSubmit={guardar}>
          <h3>{editando ? 'Editar servicio' : 'Nuevo servicio'}</h3>
          <div className="admin-form-grid">
            <Campo label="Nombre del servicio">
              <input required value={form.nombre_servicio} onChange={e => setForm({ ...form, nombre_servicio: e.target.value })} />
            </Campo>
            <Campo label="Categoría">
              <select required value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                <option value="">Selecciona...</option>
                {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>)}
              </select>
            </Campo>
            <Campo label="Estado">
              <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </Campo>
          </div>
          <div className="admin-form-actions">
            <button type="button" className="admin-btn-ghost" onClick={() => setMostrarForm(false)}>Cancelar</button>
            <button type="submit" className="admin-btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {servicios.map(s => (
              <tr key={s.id_servicio}>
                <td className="admin-cell-strong">{s.nombre_servicio}</td>
                <td>{s.categoria_servicio?.nombre_categoria ?? '—'}</td>
                <td>
                  <span className={`admin-tag ${s.estado === 'Activo' ? 'admin-tag--public' : 'admin-tag--private'}`}>
                    {s.estado}
                  </span>
                </td>
                <td>
                  <button className="admin-btn-icon" onClick={() => abrirEditar(s)}><Pencil size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── COMPONENTES AUXILIARES ─────────────────────────────────────────────────

function Campo({ label, children, ancho }) {
  return (
    <label className={`admin-field ${ancho ? 'admin-field--wide' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  )
}

function EstadoCargando() {
  return <div className="admin-panel-estado">Cargando...</div>
}

function EstadoError({ mensaje, reintentar }) {
  return (
    <div className="admin-panel-estado admin-panel-estado--error">
      <p>{mensaje}</p>
      <button className="admin-btn-ghost" onClick={reintentar}>Reintentar</button>
    </div>
  )
}
