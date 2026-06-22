import PagoModel from "../models/PagoModel"

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/pagos/comprar`

export const realizarCompra = async ({
  idTipoBoleto,
  cantidad,
  idMetodoPago,
  compradorNombre,
  compradorCorreo,
  compradorCelular,
  compradorNit
}) => {
  const token = localStorage.getItem("token")

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      id_tipo_boleto: idTipoBoleto,
      cantidad,
      id_metodo_pago: idMetodoPago,
      comprador_nombre: compradorNombre,
      comprador_correo: compradorCorreo,
      comprador_celular: compradorCelular,
      comprador_nit: compradorNit
    })
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.mensaje || "Error al realizar la compra")
  }

  return new PagoModel(result.compra)
}