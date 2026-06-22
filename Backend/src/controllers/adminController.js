import { supabase } from "../config/supabase.js"
import {
  listarUsuariosModel,
  cambiarEstadoUsuarioModel,
  cambiarRolUsuarioModel,
  listarRolesModel,
  listarEventosAdminModel,
  actualizarEventoModel,
  crearEventoPublicoModel,
  listarRecintosAdminModel,
  crearRecintoModel,
  actualizarRecintoModel,
  listarServiciosAdminModel,
  listarCategoriasServicioModel,
  crearServicioModel,
  actualizarServicioModel
} from "../models/adminModel.js"
import { crearNotificacionModel } from "../models/notificacionModel.js"

const manejarError = (res, error) => {
  return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
}

// ─── USUARIOS ───────────────────────────────────────────────────────────────

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await listarUsuariosModel()
    return res.status(200).json({ ok: true, usuarios })
  } catch (error) {
    return manejarError(res, error)
  }
}

export const cambiarEstadoUsuario = async (req, res) => {
  const id_usuario = parseInt(req.params.id)
  const { estado_usuario } = req.body

  if (!estado_usuario) {
    return res.status(400).json({ ok: false, mensaje: "estado_usuario es obligatorio." })
  }

  try {
    const usuario = await cambiarEstadoUsuarioModel(id_usuario, estado_usuario)
    return res.status(200).json({ ok: true, usuario })
  } catch (error) {
    return manejarError(res, error)
  }
}

export const cambiarRolUsuario = async (req, res) => {
  const id_usuario = parseInt(req.params.id)
  const { id_rol } = req.body

  if (!id_rol) {
    return res.status(400).json({ ok: false, mensaje: "id_rol es obligatorio." })
  }

  try {
    const usuario = await cambiarRolUsuarioModel(id_usuario, id_rol)
    return res.status(200).json({ ok: true, usuario })
  } catch (error) {
    return manejarError(res, error)
  }
}

export const listarRoles = async (req, res) => {
  try {
    const roles = await listarRolesModel()
    return res.status(200).json({ ok: true, roles })
  } catch (error) {
    return manejarError(res, error)
  }
}

// ─── EVENTOS ────────────────────────────────────────────────────────────────

export const listarEventosAdmin = async (req, res) => {
  try {
    const eventos = await listarEventosAdminModel()
    return res.status(200).json({ ok: true, eventos })
  } catch (error) {
    return manejarError(res, error)
  }
}

const CAMPOS_EVENTO_EDITABLES = ["nombre_evento", "categoria", "estado_evento", "es_publico", "imagen_url", "id_recinto"]

export const crearEventoPublico = async (req, res) => {
  const {
    nombre_evento, categoria, id_recinto,
    fecha_inicio, fecha_fin, hora_inicio, hora_fin,
    imagen_url, galeria, tipos_boleto
  } = req.body

  if (!nombre_evento || !categoria || !id_recinto || !fecha_inicio || !fecha_fin || !hora_inicio || !hora_fin) {
    return res.status(400).json({ ok: false, mensaje: "Faltan campos obligatorios del evento." })
  }

  if (!Array.isArray(tipos_boleto) || tipos_boleto.length === 0) {
    return res.status(400).json({ ok: false, mensaje: "Agrega al menos un tipo de entrada." })
  }

  try {
    const evento = await crearEventoPublicoModel({
      nombre_evento, categoria, id_recinto,
      id_organizador: req.usuario.id_usuario,
      fecha_inicio, fecha_fin, hora_inicio, hora_fin,
      imagen_url, galeria, tipos_boleto
    })

    try {
      await crearNotificacionModel({
        id_usuario: req.usuario.id_usuario,
        mensaje: `Se publicó el evento "${nombre_evento}" — estado: ${evento.estado_evento}.`,
        tipo_notificacion: "evento_creado"
      })
    } catch {
      // No interrumpir si falla la notificación
    }

    return res.status(201).json({ ok: true, evento })
  } catch (error) {
    return manejarError(res, error)
  }
}

export const actualizarEvento = async (req, res) => {
  const id_evento = parseInt(req.params.id)
  const cambios = {}
  for (const campo of CAMPOS_EVENTO_EDITABLES) {
    if (req.body[campo] !== undefined) cambios[campo] = req.body[campo]
  }

  if (Object.keys(cambios).length === 0) {
    return res.status(400).json({ ok: false, mensaje: "No se enviaron campos para actualizar." })
  }

  try {
    const evento = await actualizarEventoModel(id_evento, cambios)

    // Si cambió el estado, notificar al cliente dueño (no al admin)
    if (cambios.estado_evento) {
      try {
        // Buscar quién es el cliente dueño de esta reserva
        const { data: ordenEvento } = await supabase
          .from("orden")
          .select("id_usuario")
          .eq("id_evento", id_evento)
          .limit(1)
          .single()

        const idClienteDestino = ordenEvento?.id_usuario ?? evento.id_organizador

        if (idClienteDestino && idClienteDestino !== req.usuario.id_usuario) {
          await crearNotificacionModel({
            id_usuario: idClienteDestino,
            mensaje: `Tu reserva "${evento.nombre_evento}" cambió de estado a: ${cambios.estado_evento}.`,
            tipo_notificacion: "evento_creado"
          })
        }
      } catch {
        // No interrumpir si falla la notificación
      }
    }

    return res.status(200).json({ ok: true, evento })
  } catch (error) {
    return manejarError(res, error)
  }
}

// ─── RECINTOS ───────────────────────────────────────────────────────────────

export const listarRecintosAdmin = async (req, res) => {
  try {
    const recintos = await listarRecintosAdminModel()
    return res.status(200).json({ ok: true, recintos })
  } catch (error) {
    return manejarError(res, error)
  }
}

export const crearRecinto = async (req, res) => {
  const {
    nombre_recinto, id_ciudad, direccion_recinto, tipo_recinto,
    descripcion_recinto, capacidad, estado_recinto, link_ubicacion,
    precio_hora, imagen_url, nota
  } = req.body

  if (!nombre_recinto || !id_ciudad) {
    return res.status(400).json({ ok: false, mensaje: "nombre_recinto e id_ciudad son obligatorios." })
  }

  try {
    const recinto = await crearRecintoModel({
      nombre_recinto, id_ciudad, direccion_recinto, tipo_recinto,
      descripcion_recinto, capacidad: capacidad ?? 0, estado_recinto: estado_recinto ?? "Disponible",
      link_ubicacion, precio_hora: precio_hora ?? 0, imagen_url, nota
    })
    return res.status(201).json({ ok: true, recinto })
  } catch (error) {
    return manejarError(res, error)
  }
}

const CAMPOS_RECINTO_EDITABLES = [
  "nombre_recinto", "id_ciudad", "direccion_recinto", "tipo_recinto",
  "descripcion_recinto", "capacidad", "estado_recinto", "link_ubicacion",
  "precio_hora", "imagen_url", "nota"
]

export const actualizarRecinto = async (req, res) => {
  const id_recinto = parseInt(req.params.id)
  const cambios = {}
  for (const campo of CAMPOS_RECINTO_EDITABLES) {
    if (req.body[campo] !== undefined) cambios[campo] = req.body[campo]
  }

  if (Object.keys(cambios).length === 0) {
    return res.status(400).json({ ok: false, mensaje: "No se enviaron campos para actualizar." })
  }

  try {
    const recinto = await actualizarRecintoModel(id_recinto, cambios)
    return res.status(200).json({ ok: true, recinto })
  } catch (error) {
    return manejarError(res, error)
  }
}

// ─── SERVICIOS ──────────────────────────────────────────────────────────────

export const listarServiciosAdmin = async (req, res) => {
  try {
    const servicios = await listarServiciosAdminModel()
    return res.status(200).json({ ok: true, servicios })
  } catch (error) {
    return manejarError(res, error)
  }
}

export const listarCategoriasServicio = async (req, res) => {
  try {
    const categorias = await listarCategoriasServicioModel()
    return res.status(200).json({ ok: true, categorias })
  } catch (error) {
    return manejarError(res, error)
  }
}

export const crearServicio = async (req, res) => {
  const { nombre_servicio, categoria, estado } = req.body

  if (!nombre_servicio || !categoria) {
    return res.status(400).json({ ok: false, mensaje: "nombre_servicio y categoria son obligatorios." })
  }

  try {
    const servicio = await crearServicioModel({
      nombre_servicio, categoria, estado: estado ?? "Activo"
    })
    return res.status(201).json({ ok: true, servicio })
  } catch (error) {
    return manejarError(res, error)
  }
}

const CAMPOS_SERVICIO_EDITABLES = ["nombre_servicio", "categoria", "estado"]

export const actualizarServicio = async (req, res) => {
  const id_servicio = parseInt(req.params.id)
  const cambios = {}
  for (const campo of CAMPOS_SERVICIO_EDITABLES) {
    if (req.body[campo] !== undefined) cambios[campo] = req.body[campo]
  }

  if (Object.keys(cambios).length === 0) {
    return res.status(400).json({ ok: false, mensaje: "No se enviaron campos para actualizar." })
  }

  try {
    const servicio = await actualizarServicioModel(id_servicio, cambios)
    return res.status(200).json({ ok: true, servicio })
  } catch (error) {
    return manejarError(res, error)
  }
}
