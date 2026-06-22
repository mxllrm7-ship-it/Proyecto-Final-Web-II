export class EventoCatalogo {
  constructor(data = {}) {
    this.idEvento = data.id_evento ?? null
    this.nombreEvento = data.nombre_evento ?? ""
    this.categoria = data.categoria ?? ""
    this.estadoEvento = data.estado_evento ?? ""
    this.imagenUrl = data.imagen_url ?? ""
    this.fechaInicio = data.fecha_inicio ?? null
    this.fechaFin = data.fecha_fin ?? null
    this.horaInicio = data.hora_inicio ?? null
    this.horaFin = data.hora_fin ?? null
    this.nombreRecinto = data.nombre_recinto ?? ""
    this.nombreCiudad = data.nombre_ciudad ?? ""
    this.precioMinimo = Number(data.precio_minimo ?? 0)
    this.precioMaximo = Number(data.precio_maximo ?? 0)
    this.totalDisponible = Number(data.total_disponible ?? 0)
    this.totalTiposBoleto = Number(data.total_tipos_boleto ?? 0)
  }
}

export class CategoriaEvento {
  constructor(data = {}) {
    this.categoria = data.categoria ?? ""
    this.cantidadEventos = Number(data.cantidad_eventos ?? 0)
  }
}