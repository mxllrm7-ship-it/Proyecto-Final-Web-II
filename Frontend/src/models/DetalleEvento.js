export default class DetalleEvento {
  constructor(data = {}) {
    this.evento = {
      idEvento: data.evento?.id_evento ?? null,
      nombreEvento: data.evento?.nombre_evento ?? "",
      categoria: data.evento?.categoria ?? "",
      estadoEvento: data.evento?.estado_evento ?? "",
      nombreReservante: data.evento?.nombre_reservante ?? "",
      esPublico: data.evento?.es_publico ?? false,
      imagenUrl: data.evento?.imagen_url ?? "",
      descuento: data.evento?.descuento ?? 0,
      topeReserva: data.evento?.tope_reserva ?? 0
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
      tipoRecinto: data.recinto?.tipo_recinto ?? "",
      descripcionRecinto: data.recinto?.descripcion_recinto ?? "",
      capacidad: data.recinto?.capacidad ?? 0,
      linkUbicacion: data.recinto?.link_ubicacion ?? ""
    }

    this.ciudad = {
      idCiudad: data.ciudad?.id_ciudad ?? null,
      nombreCiudad: data.ciudad?.nombre_ciudad ?? ""
    }

    this.organizador = {
      idUsuario: data.organizador?.id_usuario ?? null,
      nombreUsuario: data.organizador?.nombre_usuario ?? "",
      fotoPerfil: data.organizador?.foto_perfil ?? ""
    }

    this.media = (data.media ?? []).map(item => ({
      id: item.id,
      url: item.url,
      orden: item.orden
    }))

    this.invitados = (data.invitados ?? []).map(item => ({
      idInvitado: item.id_invitado,
      nombreInvitado: item.nombre_invitado,
      tipoInvitado: item.tipo_invitado,
      estadoInvitado: item.estado_invitado
    }))

    this.tiposBoleto = (data.tipos_boleto ?? []).map(item => ({
      id: item.id,
      nombreTipo: item.nombre_tipo,
      precio: item.precio,
      cantidadTotal: item.cantidad_total,
      cantidadDisponible: item.cantidad_disponible,
      descripcion: item.descripcion,
      imagenUrl: item.imagen_url
    }))

    this.estadisticas = {
      tiposBoletos: data.estadisticas?.tipos_boletos ?? 0,
      totalDisponible: data.estadisticas?.total_disponible ?? 0,
      precioMinimo: data.estadisticas?.precio_minimo ?? 0,
      precioMaximo: data.estadisticas?.precio_maximo ?? 0
    }
  }
}