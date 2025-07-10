import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './MainLayout.css'
import UniverseBackground from '../components/UniverseBackground'

function MainLayout() {
  return (
    <div className="layout">
      <UniverseBackground />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer glass-footer">
        <div className="footer-content">
          <nav className="footer-nav">
            <a href="/" className="footer-link">Inicio</a>
            <a href="/productos" className="footer-link">Productos</a>
            <a href="/contacto" className="footer-link">Contacto</a>
            <a href="/sobre-nosotros" className="footer-link">Sobre Nosotros</a>
            <a href="/ubicacion" className="footer-link">Ubicación</a>
          </nav>
          <div className="footer-contact-row">
            <span className="footer-contact-label">Contacto:</span>
            <a href="mailto:universal.tornillos@gmail.com" className="footer-link footer-contact-icon" title="Enviar correo">
              <span style={{marginRight: 4}}>📧</span>universal.tornillos@gmail.com
            </a>
            <span className="footer-contact-sep">|</span>
            <a href="https://wa.me/573208555718" className="footer-link footer-contact-icon" target="_blank" rel="noopener noreferrer" title="WhatsApp">
              <span style={{marginRight: 4}}>💬</span>WhatsApp
            </a>
          </div>
          <p className="footer-copy">&copy; 2025 Universal de Tornillos. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout 