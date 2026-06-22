export default class RecintoModel {
  constructor({
    id,
    nombre,
    tipo,
    capacidad,
    direccion,
    precioHora,
    ciudad,
    imagen,
    estado,
    googleMaps,
  }) {
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.capacidad = capacidad;
    this.direccion = direccion;
    this.precioHora = precioHora;
    this.ciudad = ciudad;
    this.imagen = imagen;
    this.estado = estado;
    this.googleMaps = googleMaps;
  }

  static fromJson(json) {
    return new RecintoModel({
      id: json.id,
      nombre: json.nombre,
      tipo: json.tipo,
      capacidad: json.capacidad,
      direccion: json.direccion,
      precioHora: json.precio_hora,
      ciudad: json.ciudad,
      imagen: json.imagen,
      estado: json.estado,
      googleMaps: json.google_maps,
    });
  }
}