import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './AdminLogin.css'
import { useNavigate } from 'react-router-dom'

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    // Simulación: solo permite admin@admin.com
    const ok = await login(username, password)
    if (ok && isAdmin) {
      navigate('/admin')
    } else {
      setError('Usuario o clave incorrectos o no tienes permisos de administrador')
    }
  }

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>Acceso Administrador</h2>
        {error && <div className="admin-error">{error}</div>}
        <input
          type="text"
          placeholder="Correo de administrador"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Clave"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}

export default AdminLogin 