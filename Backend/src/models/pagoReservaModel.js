import { supabase } from "../config/supabase.js"

const PORCENTAJE_ADELANTO = 0.15

export const pagarReservaModel = async ({ id_orden, id_usuario, tipo_pago, id_metodo_pago }) => {
  const { data: orden, error: errorOrden } = await supabase
    .from("orden")
    .select("id_orden, id_usuario, monto_total, estado_orden")
    .eq("id_orden", id_orden)
    .single()
  if (errorOrden) throw errorOrden

  if (orden.id_usuario !== id_usuario) {
    throw new Error("Esta orden no te pertenece.")
  }

  const { data: pagosPrevios, error: errorPagos } = await supabase
    .from("pago")
    .select("monto_pago")
    .eq("id_orden", id_orden)
  if (errorPagos) throw errorPagos

  const totalPagado = (pagosPrevios || []).reduce((s, p) => s + Number(p.monto_pago || 0), 0)
  const montoTotal = Number(orden.monto_total || 0)
  const saldoPendiente = Math.max(0, montoTotal - totalPagado)

  if (saldoPendiente <= 0) {
    throw new Error("Esta reserva ya no tiene saldo pendiente.")
  }

  const monto = tipo_pago === "adelanto"
    ? Math.min(saldoPendiente, Math.round(montoTotal * PORCENTAJE_ADELANTO * 100) / 100)
    : saldoPendiente

  const { error: errorPago } = await supabase
    .from("pago")
    .insert({
      id_orden,
      id_metodo_pago: id_metodo_pago || null,
      monto_pago: monto,
      moneda: "BOB",
      fecha_pago: new Date().toISOString(),
      estado_pago: "pagado",
      tipo_pago: tipo_pago === "adelanto" ? "adelanto" : "total"
    })
  if (errorPago) throw errorPago

  const saldoRestante = saldoPendiente - monto
  const nuevoEstado = saldoRestante <= 0.009 ? "pagado" : "Adelanto"

  const { error: errorUpdate } = await supabase
    .from("orden")
    .update({ estado_orden: nuevoEstado })
    .eq("id_orden", id_orden)
  if (errorUpdate) throw errorUpdate

  return { montoPagado: monto, saldoRestante: Math.max(0, saldoRestante), estadoOrden: nuevoEstado }
}
