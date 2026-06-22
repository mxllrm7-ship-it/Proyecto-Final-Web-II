export default class SearchModel {
  constructor({
    id_evento,
    nombre_evento,
    categoria,
    fecha,
    nombre_recinto,
    nombre_ciudad,
    imagen_url,
  }) {
    this.idEvento = id_evento;
    this.nombreEvento = nombre_evento;
    this.categoria = categoria;
    this.fecha = fecha;
    this.nombreRecinto = nombre_recinto;
    this.nombreCiudad = nombre_ciudad;
    this.imagenUrl = imagen_url;
  }

  static fromJson(json) {
    return new SearchModel(json);
  }
}