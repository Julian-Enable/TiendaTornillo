import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Toast from '../components/Toast'
import { useState, useEffect } from 'react'
import './Perfil.css'
import { useSeo } from '../hooks/useSeo'

function Perfil() {
  useSeo({
    title: 'Mi Perfil | Tienda de Tornillos',
    description: 'Consulta y edita la información de tu cuenta, revisa tu historial de compras y gestiona tus datos personales en nuestra tienda.'
  })
  const { user, logout } = useAuth()
  const { items, getTotalItems, getQuotations, restoreQuotation, deleteQuotation } = useCart()
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' })
  const [quotations, setQuotations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadQuotations = async () => {
      if (user?.email) {
        try {
          setLoading(true)
          const quotes = await getQuotations()
          setQuotations(quotes || [])
        } catch (error) {
          console.error('Error al cargar cotizaciones:', error)
          setQuotations([])
        } finally {
          setLoading(false)
        }
      }
    }

    loadQuotations()
  }, [user?.email, getQuotations])

  if (!user) {
    return (
      <div className="perfil-container">
        <div className="auth-required">
          <h2>Debes iniciar sesión para ver tu perfil</h2>
          <a href="/login" className="login-link">Iniciar Sesión</a>
        </div>
      </div>
    )
  }

  const handleRestore = async (id: string) => {
    try {
      await restoreQuotation(id)
      setToast({ show: true, message: 'Cotización restaurada al carrito' })
      // Recargar cotizaciones
      const quotes = await getQuotations()
      setQuotations(quotes || [])
    } catch (error) {
      setToast({ show: true, message: 'Error al restaurar cotización' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteQuotation(id)
      setToast({ show: true, message: 'Cotización eliminada' })
      // Recargar cotizaciones
      const quotes = await getQuotations()
      setQuotations(quotes || [])
    } catch (error) {
      setToast({ show: true, message: 'Error al eliminar cotización' })
    }
  }

  return (
    <div className="perfil-container">
      <Toast message={toast.message} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
      <div className="perfil-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu cuenta y revisa tu información</p>
      </div>
      <div className="perfil-content">
        <div className="perfil-section">
          <h2>Información Personal</h2>
          <div className="info-group">
            <span className="perfil-label">Nombre:</span>
            <span className="perfil-value">{user.name}</span>
          </div>
          <div className="info-group">
            <span className="perfil-label">Email:</span>
            <span className="perfil-value">{user.email}</span>
          </div>
          <div className="info-group">
            <span className="perfil-label">ID de Usuario:</span>
            <span className="perfil-value">{user.id}</span>
          </div>
        </div>
        <div className="perfil-section">
          <h2>Resumen de Actividad</h2>
          <div className="activity-summary">
            <div className="activity-item">
              <span className="perfil-label">Productos en Carrito:</span>
              <span className="perfil-value">{getTotalItems()}</span>
            </div>
            <div className="activity-item">
              <span className="perfil-label">Productos Diferentes:</span>
              <span className="perfil-value">{items.length}</span>
            </div>
          </div>
        </div>
        <div className="perfil-section">
          <h2>Acciones</h2>
          <div className="perfil-actions">
            <button className="action-btn primary">
              Editar Perfil
            </button>
            <button className="action-btn secondary">
              Cambiar Contraseña
            </button>
            <button className="action-btn danger" onClick={logout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
        <div className="perfil-section">
          <h2>Mis Cotizaciones Guardadas</h2>
          {loading ? (
            <div className="empty-history">
              <p>Cargando cotizaciones...</p>
            </div>
          ) : quotations.length === 0 ? (
            <div className="empty-history">
              <p>No tienes cotizaciones guardadas.</p>
            </div>
          ) : (
            <div className="quotations-list">
              {quotations.map(q => (
                <div key={q.id} className="quotation-item">
                  <div className="quotation-info">
                    <strong>{q.name}</strong>
                    <span className="quotation-date">{q.date}</span>
                    <span className="quotation-total">Total: ${q.total.toFixed(2)}</span>
                  </div>
                  <div className="quotation-actions">
                    <button className="restore-btn" onClick={() => handleRestore(q.id)}>
                      Restaurar al carrito
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(q.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Perfil 