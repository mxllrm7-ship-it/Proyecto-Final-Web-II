import ContratarServicioService from "../services/ContratarServicioService"

class ContratarServicioModel {
  async contratar(idEvento, idServicio, cantidad = 1) {
    return await ContratarServicioService.contratar({
      id_evento: idEvento,
      id_servicio: idServicio,
      cantidad
    })
  }
}

export default new ContratarServicioModel()