import { contratarRecintoModel } from "../models/contratarRecintoModel.js"
import { crearNotificacionModel } from "../models/notificacionModel.js"

export const contratarRecinto = async (req, res) => {
  const { id_recinto, nombre_reservante, fecha_inicio, fecha_fin, hora_inicio, hora_fin } = req.body

  if (!id_recinto || !nombre_reservante || !fecha_inicio || !fecha_fin || !hora_inicio || !hora_fin) {
    return res.status(400).json({ ok: false, mensaje: "Todos los campos son obligatorios." })
  }

  try {
    const resultado = await contratarRecintoModel({
      id_recinto,
      nombre_reservante,
      fecha_inicio,
      fecha_fin,
      hora_inicio,
      hora_fin,
      id_usuario: req.usuario.id_usuario // ← el cliente real que inició sesión
    })

    try {
      await crearNotificacionModel({
        id_usuario: req.usuario.id_usuario,
        mensaje: `Tu reserva de recinto para "${nombre_reservante}" fue registrada. Estado: Programado.`,
        tipo_notificacion: "evento_creado"
      })
    } catch {
      // No interrumpir si falla la notificación
    }

    return res.status(201).json({ ok: true, reserva: resultado })
  } catch (error) {
    if (error.message?.includes("no está disponible")) {
      return res.status(409).json({ ok: false, mensaje: error.message })
    }
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}