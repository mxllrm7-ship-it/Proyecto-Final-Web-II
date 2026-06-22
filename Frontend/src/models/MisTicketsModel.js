export class Ticket {
  constructor(data = {}) {
    this.orden = {
      idOrden: data.orden?.id_orden ?? null,
      fechaOrden: data.orden?.fecha_orden ?? null,
      estadoOrden: data.orden?.estado_orden ?? "",
      descuentoOrden: data.orden?.descuento_orden ?? 0
    }

    this.evento = {
      idEvento: data.evento?.id_evento ?? null,
      nombreEvento: data.evento?.nombre_evento ?? "",
      categoria: data.evento?.categoria ?? "",
      estadoEvento: data.evento?.estado_evento ?? "",
      imagenUrl: data.evento?.imagen_url ?? ""
    }

    this.fecha = {
      fechaInicio: data.fecha?.fecha_inicio ?? null,
      fechaFin: data.fecha?.fecha_fin ?? null,
      horaInicio: data.fecha?.hora_inicio ?? null,
      horaFin: data.fecha?.hora_fin ?? null
    }

    this.recinto = {
      idRecinto: data.recinto?.id_recinto ?? null,
      nombreRecinto: data.recinto?.nombre_recinto ?? "",
      direccionRecinto: data.recinto?.direccion_recinto ?? "",
      linkUbicacion: data.recinto?.link_ubicacion ?? ""
    }

    this.ciudad = {
      idCiudad: data.ciudad?.id_ciudad ?? null,
      nombreCiudad: data.ciudad?.nombre_ciudad ?? ""
    }

    this.boleto = {
      idBoleto: data.boleto?.id_boleto ?? null,
      codigo: data.boleto?.codigo ?? "",
      fila: data.boleto?.fila ?? null,
      asiento: data.boleto?.asiento ?? null,
      precioBoleto: data.boleto?.precio_boleto ?? 0,
      estadoValidacion: data.boleto?.estado_validacion ?? ""
    }

    this.tipoBoleto = {
      idTipoBoleto: data.tipo_boleto?.id_tipo_boleto ?? null,
      nombreTipo: data.tipo_boleto?.nombre_tipo ?? "",
      descripcion: data.tipo_boleto?.descripcion ?? "",
      precio: data.tipo_boleto?.precio ?? 0
    }

    this.pago = {
      idPago: data.pago?.id_pago ?? null,
      montoPago: data.pago?.monto_pago ?? 0,
      moneda: data.pago?.moneda ?? "",
      estadoPago: data.pago?.estado_pago ?? "",
      fechaPago: data.pago?.fecha_pago ?? null
    }
  }
}

export default class MisTicketsModel {
  constructor(data = []) {
    this.tickets = data.map(ticket => new Ticket(ticket))
  }
}