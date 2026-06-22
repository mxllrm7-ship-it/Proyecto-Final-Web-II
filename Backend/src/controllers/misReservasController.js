import { supabase } from "../config/supabase.js"
import { listarMisReservasRecintoModel, listarMisEventosActivosModel } from "../models/reservaModel.js"
import {
  listarMisServiciosReservadosModel,
  listarItemsDeServicioModel,
  crearServicioReservadoModel
} from "../models/servicioReservadoModel.js"
import { pagarReservaModel } from "../models/pagoReservaModel.js"
import { crearNotificacionModel } from "../models/notificacionModel.js"

const manejarError = (res, error) => {
  return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
}

export const listarMisReservasRecinto = async (req, res) => {
  try {
    const reservas = await listarMisReservasRecintoModel(req.usuario.id_usuario)
    return res.status(200).json({ ok: true, reservas })
  } catch (error) {
    return manejarError(res, error)
  }
}

// Eventos propios activos (no cancelados/finalizados, sin contar reservas de
// solo-recinto) — usados en el selector opcional del modal "Reservar servicio".
export const listarMisEventosActivos = async (req, res) => {
  try {
    const eventos = await listarMisEventosActivosModel(req.usuario.id_usuario)
    return res.status(200).json({ ok: true, eventos })
  } catch (error) {
    return manejarError(res, error)
  }
}

export const listarMisServiciosReservados = async (req, res) => {
  try {
    const servicios = await listarMisServiciosReservadosModel(req.usuario.id_usuario)
    return res.status(200).json({ ok: true, servicios })
  } catch (error) {
    return manejarError(res, error)
  }
}

// Ítems con precio de un servicio, para elegir proveedor + precio antes de reservar
export const listarItemsDeServicio = async (req, res) => {
  const id_servicio = parseInt(req.params.id)
  if (isNaN(id_servicio)) {
    return res.status(400).json({ ok: false, mensaje: "id_servicio inválido." })
  }
  try {
    const items = await listarItemsDeServicioModel(id_servicio)
    return res.status(200).json({ ok: true, items })
  } catch (error) {
    return manejarError(res, error)
  }
}

export const crearServicioReservado = async (req, res) => {
  const { id_servicio, id_detalle, cantidad, nota, id_evento } = req.body
  if (!id_servicio || !id_detalle) {
    return res.status(400).json({ ok: false, mensaje: "Selecciona un proveedor/ítem para el servicio." })
  }

  try {
    const resultado = await crearServicioReservadoModel({
      id_usuario: req.usuario.id_usuario,
      id_servicio,
      id_detalle,
      cantidad,
      nota,
      id_evento: id_evento || null
    })

    try {
      await crearNotificacionModel({
        id_usuario: req.usuario.id_usuario,
        mensaje: `Reservaste un servicio por Bs ${resultado.orden.monto_total}. Completa el pago desde "Mis Reservas".`,
        tipo_notificacion: "evento_creado"
      })
    } catch {
      // no interrumpir si falla la notificación
    }

    return res.status(201).json({ ok: true, reserva: resultado.reserva, id_orden: resultado.orden.id_orden, monto_total: resultado.orden.monto_total })
  } catch (error) {
    return manejarError(res, error)
  }
}

// Pago genérico (adelanto 15% o total) para cualquier orden de reserva
// (recinto o servicio) que le pertenezca al usuario logueado.
export const listarMetodosPago = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("metodo_pago")
      .select("id_metodo_pago, nombre, icono_url")
      .eq("estado", "Activo")
    if (error) throw error
    return res.status(200).json({ ok: true, metodos: data })
  } catch (error) {
    return manejarError(res, error)
  }
}

export const pagarReserva = async (req, res) => {
  const { id_orden, tipo_pago, id_metodo_pago } = req.body
  if (!id_orden || !tipo_pago) {
    return res.status(400).json({ ok: false, mensaje: "id_orden y tipo_pago son obligatorios." })
  }

  try {
    const resultado = await pagarReservaModel({
      id_orden,
      id_usuario: req.usuario.id_usuario,
      tipo_pago,
      id_metodo_pago
    })

    try {
      await crearNotificacionModel({
        id_usuario: req.usuario.id_usuario,
        mensaje:
          resultado.estadoOrden === "pagado"
            ? `Tu pago quedó completo. Orden #${id_orden}.`
            : `Registramos tu adelanto de Bs ${resultado.montoPagado.toFixed(2)}. Saldo pendiente: Bs ${resultado.saldoRestante.toFixed(2)}.`,
        tipo_notificacion: "compra_confirmada"
      })
    } catch {
      // no interrumpir si falla la notificación
    }

    return res.status(200).json({ ok: true, ...resultado })
  } catch (error) {
    return manejarError(res, error)
  }
}
