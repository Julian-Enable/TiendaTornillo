import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Navbar.css'

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6"/></svg>
  )
}
function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>
  )
}
function LogoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  )
}

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { getTotalItems } = useCart()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Tienda de Tornillos
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Inicio</Link>
          </li>
          <li className="nav-item">
            <Link to="/productos" className="nav-link">Productos</Link>
          </li>
          <li className="nav-item">
            <Link to="/contacto" className="nav-link">Contacto</Link>
          </li>
          <li className="nav-item">
            <Link to="/sobre-nosotros" className="nav-link">Sobre Nosotros</Link>
          </li>
          <li className="nav-item">
            <Link to="/ubicacion" className="nav-link">Ubicación</Link>
          </li>
        </ul>

        <div className="nav-auth">
          <Link to={isAuthenticated ? "/perfil" : "/login"} className="nav-link" title="Mi Perfil">
            <UserIcon />
          </Link>
          <Link to="/carrito" className="nav-link" title="Carrito">
            <CartIcon />
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <span className="user-name">Hola, {user?.name}</span>
              <button onClick={logout} className="nav-link logout-btn" title="Cerrar Sesión">
                <LogoutIcon />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Iniciar Sesión</Link>
              <Link to="/registro" className="nav-link register-btn">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar 