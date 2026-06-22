import './Events.css'
import EventList from './EventList'
import { obtenerEventos } from '../../../services/EventoService'
import { useEffect, useState } from 'react'

export default function Events() {
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const data = await obtenerEventos()
        setEventos(data)
      } catch (error) {
        console.error(error)
      }
    }

    cargarEventos()
  }, [])

  return (
    <main className="events-main">
      <div className="events-container">
        <EventList titulo="Eventos Disponibles" eventos={eventos} />
      </div>
    </main>
  )
}