import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './AdminLogin.css'

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Solo permite admin:admin
    if (username === 'admin' && password === 'admin') {
      await login('admin@admin.com', 'admin')
    } else {
      setError('Usuario o clave incorrectos')
    }
  }

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>Acceso Administrador</h2>
        {error && <div className="admin-error">{error}</div>}
        <input
          type="text"
          placeholder="Usuario"
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