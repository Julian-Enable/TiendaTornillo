import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Toast from '../components/Toast'
import { useState } from 'react'
import './Perfil.css'

function Perfil() {
  const { user, logout } = useAuth()
  const { items, getTotalItems, getQuotations, restoreQuotation, deleteQuotation } = useCart()
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' })

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

  const quotations = getQuotations(user.email)

  const handleRestore = (id: string) => {
    restoreQuotation(user.email, id)
    setToast({ show: true, message: 'Cotización restaurada al carrito' })
  }

  const handleDelete = (id: string) => {
    deleteQuotation(user.email, id)
    setToast({ show: true, message: 'Cotización eliminada' })
  }

  return (
    <div className="perfil-container">
      <Toast message={toast.message} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
      <div className="perfil-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu cuenta y revisa tu información</p>
      </div>
      <div className="perfil-content">
        <div className="perfil-card">
          <h2>Información Personal</h2>
          <div className="info-group">
            <label>Nombre:</label>
            <span>{user.name}</span>
          </div>
          <div className="info-group">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="info-group">
            <label>ID de Usuario:</label>
            <span>{user.id}</span>
          </div>
        </div>
        <div className="perfil-card">
          <h2>Resumen de Actividad</h2>
          <div className="activity-summary">
            <div className="activity-item">
              <span className="activity-label">Productos en Carrito:</span>
              <span className="activity-value">{getTotalItems()}</span>
            </div>
            <div className="activity-item">
              <span className="activity-label">Productos Diferentes:</span>
              <span className="activity-value">{items.length}</span>
            </div>
          </div>
        </div>
        <div className="perfil-card">
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
        <div className="perfil-card">
          <h2>Mis Cotizaciones Guardadas</h2>
          {quotations.length === 0 ? (
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