import './EventList.css'
import CardEventList from './CardEventList'

export default function EventList({ titulo, eventos }) {
  return (
    <section className="event-list-section">
      <h2 className="event-list-titulo">{titulo}</h2>

      <div className="event-list-carrusel">
        <div className="carrusel-container">
          {eventos.map((evento) => (
            <div key={evento.idEvento} className="carrusel-item">
              <CardEventList
                idEvento={evento.idEvento}
                titulo={evento.nombreEvento}
                imagen={evento.imagenUrl}
                artista={evento.nombreCiudad}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}