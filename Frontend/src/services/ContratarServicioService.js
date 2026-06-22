const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/contratar-servicio`

class ContratarServicioService {
  async contratar(data) {
    const token = localStorage.getItem("token")

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })

    const resultado = await response.json()

    if (!response.ok) {
      throw new Error(resultado.mensaje || "Error al contratar servicio")
    }

    return resultado
  }
}

export default new ContratarServicioService()