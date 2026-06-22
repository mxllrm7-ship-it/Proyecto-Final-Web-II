import { Globe, Camera, ArrowRight, Music } from 'lucide-react'
import './Footer.css'
import '../../../styles/styles.css'
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-branding">
          <div className="brand-icon">
            <Music size={32} />
          </div>
          <h2 className="brand-name">Nodus</h2>
          <p className="brand-description">La plataforma líder para descubrir, organizar y vivir experiencias inolvidables.</p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Comprar Entradas</h3>
          <ul className="footer-links">
            <li><a href="#conciertos">Conciertos Musicales</a></li>
            <li><a href="#deportes">Eventos Deportivos</a></li>
            <li><a href="#festivales">Festivales</a></li>
            <li><a href="#teatro">Teatro y Shows</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Ayuda y Soporte</h3>
          <ul className="footer-links">
            <li><a href="#faq">Preguntas Frecuentes</a></li>
            <li><a href="#contacto">Contactar Soporte</a></li>
            <li><a href="#reembolsos">Política de Reembolsos</a></li>
            <li><a href="#privacidad">Privacidad</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Empresa</h3>
          <ul className="footer-links">
            <li><a href="#sobre">Sobre Nosotros</a></li>
            <li><a href="#carreras">Carreras</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#terminos">Términos de Uso</a></li>
          </ul>
        </div>

        <div className="footer-section newsletter-section">
          <h3 className="footer-title">Suscribirse</h3>
          <p className="newsletter-text">Recibe las mejores ofertas en tu email</p>
          <div className="newsletter-input-group">
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className="newsletter-input"
            />
            <button className="newsletter-button" aria-label="Suscribirse">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-socials">
          <a href="#facebook" className="social-link" aria-label="Facebook">
            <Globe size={20} />
          </a>
          <a href="#instagram" className="social-link" aria-label="Instagram">
            <Camera size={20} />
          </a>
        </div>
        <p className="footer-copyright">© 2026 Nodus. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}