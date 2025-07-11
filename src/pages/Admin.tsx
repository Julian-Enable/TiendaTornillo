import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import AdminLogin from '../admin/AdminLogin'
import AdminPanel from '../admin/AdminPanel'
import UniverseBackground from '../components/UniverseBackground'
import Toast from '../components/Toast'
import { useState } from 'react'

function AdminPage() {
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' })

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <UniverseBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {isAuthenticated && isAdmin ? (
          <div>
            <AdminPanel onLogout={handleLogout} setToast={setToast} />
            <div style={{ marginBottom: 24 }}>
              <Link to="/agregar-producto" style={{ background: '#ffd700', color: '#222', fontWeight: 600, padding: '8px 24px', border: 'none', borderRadius: 6, textDecoration: 'none' }}>
                Agregar nuevo producto
              </Link>
            </div>
            <div style={{ position: 'fixed', top: '2rem', right: 'calc(50vw - 450px)', zIndex: 10000 }}>
              <Toast message={toast.message} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
            </div>
          </div>
        ) : !isAuthenticated ? (
          <AdminLogin />
        ) : null}
      </div>
    </div>
  )
}

export default AdminPage 