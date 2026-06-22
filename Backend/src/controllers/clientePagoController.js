import { realizarCompraModel } from "../models/pagoTicketModel.js"
import { crearNotificacionModel } from "../models/notificacionModel.js"

export const realizarCompra = async (req, res) => {
  const {
    id_tipo_boleto,
    cantidad,
    id_metodo_pago,
    comprador_nombre,
    comprador_correo,
    comprador_celular,
    comprador_nit
  } = req.body

  const id_usuario = req.usuario.id_usuario

  if (!id_tipo_boleto || !cantidad || !id_metodo_pago || !comprador_nombre || !comprador_correo || !comprador_celular) {
    return res.status(400).json({ ok: false, mensaje: "Faltan campos obligatorios." })
  }

  if (cantidad < 1) {
    return res.status(400).json({ ok: false, mensaje: "La cantidad debe ser al menos 1." })
  }

  try {
    const resultado = await realizarCompraModel({
      id_usuario,
      id_tipo_boleto,
      cantidad,
      id_metodo_pago,
      comprador_nombre,
      comprador_correo,
      comprador_celular,
      comprador_nit
    })

    if (!resultado.success) {
      return res.status(400).json({ ok: false, mensaje: "No se pudo procesar la compra." })
    }

    try {
      await crearNotificacionModel({
        id_usuario,
        mensaje: `Tu compra de ${cantidad}x boleto(s) fue confirmada.`,
        tipo_notificacion: "compra_confirmada"
      })
    } catch {
      // Si falla la notificación no debe tumbar la compra ya realizada
    }

    return res.status(201).json({ ok: true, compra: resultado })
  } catch (error) {
    if (error.message?.includes("No existe disponibilidad suficiente")) {
      return res.status(409).json({ ok: false, mensaje: error.message })
    }
    if (error.message?.includes("Tipo de boleto no encontrado")) {
      return res.status(404).json({ ok: false, mensaje: error.message })
    }
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: error.message })
  }
}