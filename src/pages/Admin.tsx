import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import AdminLogin from '../admin/AdminLogin'
import AdminPanel from '../admin/AdminPanel'

function AdminPage() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return isAuthenticated ? (
    <div>
      <AdminPanel onLogout={handleLogout} />
      <div style={{ marginBottom: 24 }}>
        <Link to="/agregar-producto" style={{ background: '#ffd700', color: '#222', fontWeight: 600, padding: '8px 24px', border: 'none', borderRadius: 6, textDecoration: 'none' }}>
          Agregar nuevo producto
        </Link>
      </div>
    </div>
  ) : (
    <AdminLogin />
  )
}

export default AdminPage 