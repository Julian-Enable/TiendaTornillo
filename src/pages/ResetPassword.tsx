import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'
import { useSeo } from '../hooks/useSeo'

function ResetPassword() {
  useSeo({
    title: 'Restablecer Contraseña | Tienda de Tornillos',
    description: 'Restablece tu contraseña de forma segura en la Tienda de Tornillos.'
  })
  
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const success = await resetPassword(email)
      if (success) {
        setSuccess('Se ha enviado un email con instrucciones para restablecer tu contraseña. Revisa tu bandeja de entrada y carpeta de spam.')
        setEmail('')
      } else {
        setError('No se pudo enviar el email. Verifica que el email esté registrado.')
      }
    } catch (err) {
      setError('Error al procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Restablecer Contraseña</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Email'}
          </button>
        </form>
        
        <p className="auth-footer">
          <a href="/login">Volver al login</a>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword
