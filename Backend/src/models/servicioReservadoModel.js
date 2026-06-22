import { supabase } from "../config/supabase.js"

export const listarMisServiciosReservadosModel = async (id_usuario) => {
  const { data, error } = await supabase.rpc(
    "obtener_mis_servicios_reservados",
    {
      p_id_usuario: id_usuario
    }
  )

  if (error) {
    throw error
  }

  return data || []
}

export const listarItemsDeServicioModel = async (id_servicio) => {
  const { data, error } = await supabase
    .from("detalle_proveedor_servicio")
    .select(`
      id,
      nombre_item,
      precio_item,
      imagen_url,
      nota,
      proveedor (
        nit_proveedor,
        nombre_comercial,
        telefono_comercial
      )
    `)
    .eq("id_servicio", id_servicio)

  if (error) {
    throw error
  }

  return data
}

export const crearServicioReservadoModel = async ({
  id_usuario,
  id_servicio,
  id_detalle,
  cantidad,
  nota,
  id_evento
}) => {
  const { data: detalle, error: errorDetalle } = await supabase
    .from("detalle_proveedor_servicio")
    .select(`
      id,
      id_proveedor,
      precio_item
    `)
    .eq("id", id_detalle)
    .single()

  if (errorDetalle) {
    throw errorDetalle
  }

  const cantidadFinal = cantidad || 1
  const montoTotal = Number(detalle.precio_item || 0) * cantidadFinal

  const { data: reserva, error: errorReserva } = await supabase
    .from("servicio_reservado")
    .insert({
      id_usuario,
      id_proveedor: detalle.id_proveedor,
      id_servicio,
      id_detalle,
      cantidad: cantidadFinal,
      precio_unitario: detalle.precio_item,
      estado: "Reservado",
      nota: nota || null,
      id_evento: id_evento || null
    })
    .select()
    .single()

  if (errorReserva) {
    throw errorReserva
  }

  const { data: orden, error: errorOrden } = await supabase
    .from("orden")
    .insert({
      id_usuario,
      id_servicio_reservado: reserva.id,
      fecha_orden: new Date().toISOString(),
      estado_orden: "Reservado",
      descuento_orden: 0,
      monto_total: montoTotal
    })
    .select()
    .single()

  if (errorOrden) {
    throw errorOrden
  }

  return {
    reserva,
    orden
  }
}