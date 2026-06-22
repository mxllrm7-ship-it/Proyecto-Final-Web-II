export default class PagoModel {
  constructor(data = {}) {
    this.success = data.success ?? false
    this.idOrden = data.id_orden ?? null
    this.idPago = data.id_pago ?? null
    this.cantidad = data.cantidad ?? 0
    this.totalPagado = data.total_pagado ?? 0
    this.boletos = (data.boletos ?? []).map(boleto => ({
      idBoleto: boleto.id_boleto,
      codigo: boleto.codigo
    }))
  }
}