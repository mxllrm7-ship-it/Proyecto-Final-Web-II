export default class Evento {
  constructor(data = {}) {
    this.idEvento = data.id_evento
    this.nombreEvento = data.nombre_evento
    this.categoria = data.categoria
    this.estadoEvento = data.estado_evento
    this.esPublico = data.es_publico
    this.imagenUrl = data.imagen_url
    this.descuento = data.descuento
    this.topeReserva = data.tope_reserva
    this.nombreRecinto = data.nombre_recinto
    this.direccionRecinto = data.direccion_recinto
    this.nombreCiudad = data.nombre_ciudad
    this.fechaInicio = data.fecha_inicio
    this.fechaFin = data.fecha_fin
    this.horaInicio = data.hora_inicio
    this.horaFin = data.hora_fin
  }
}