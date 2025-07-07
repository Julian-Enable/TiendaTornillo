import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './MainLayout.css'

function MainLayout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Tienda de Tornillos. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout 