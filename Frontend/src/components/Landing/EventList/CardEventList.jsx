import './CardEventList.css'
import { Link } from 'react-router'

export default function CardEventList({
  idEvento,
  titulo,
  imagen,
  artista
}) {
  return (
    <Link
      to={`/eventos/${idEvento}`}
      className="card-evento-link"
    >
      <div className="card-evento">
        <div className="card-evento-imagen">
          <img src={imagen} alt={titulo} />
        </div>

        <div className="card-evento-contenido">
          <h3 className="card-evento-titulo">{titulo}</h3>
          <p className="card-evento-artista">{artista}</p>
        </div>
      </div>
    </Link>
  )
}