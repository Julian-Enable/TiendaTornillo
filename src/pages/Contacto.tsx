import './Contacto.css'
import { useState } from 'react'

function Contacto() {
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'exito' | 'error'>('idle')
  const [error, setError] = useState('')

  // Cambia este endpoint por el tuyo de Formspree
  const FORMSPREE_URL = 'https://formspree.io/f/mwpbdqbr'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEstado('enviando')
    setError('')
    const form = e.currentTarget
    const data = {
      nombre: form.nombre.value,
      email: form.email.value,
      mensaje: form.mensaje.value
    }
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        setEstado('exito')
        form.reset()
      } else {
        setEstado('error')
        setError('No se pudo enviar el mensaje. Intenta más tarde.')
      }
    } catch {
      setEstado('error')
      setError('No se pudo enviar el mensaje. Intenta más tarde.')
    }
  }

  return (
    <div className="contacto-container">
      <div className="contacto-header">
        <h1>Contacto</h1>
        <p>Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.</p>
      </div>

      <div className="contacto-content">
        <div className="contacto-info-card">
          <h2>Información de Contacto</h2>
          <div className="contacto-info-grid">
            <div className="contacto-info-item">
              <div className="contacto-icon">📞</div>
              <div>
                <h3>Teléfono</h3>
                <p>+57 3208555718</p>
              </div>
            </div>
            <div className="contacto-info-item">
              <div className="contacto-icon">✉️</div>
              <div>
                <h3>Email</h3>
                <p>universal.tornillos@gmail.com</p>
              </div>
            </div>
            <div className="contacto-info-item">
              <div className="contacto-icon">📍</div>
              <div>
                <h3>Dirección</h3>
                <p>Cl. 7 #28 09, Los Mártires, Bogotá, Cundinamarca</p>
              </div>
            </div>
            <div className="contacto-info-item">
              <div className="contacto-icon">🕒</div>
              <div>
                <h3>Horario</h3>
                <p>Lunes a Viernes, 8:00am - 6:00pm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contacto-form-card">
          <h2>Envíanos un mensaje</h2>
          <form className="contacto-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input 
                type="text" 
                id="nombre"
                placeholder="Tu nombre completo" 
                name="nombre" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input 
                type="email" 
                id="email"
                placeholder="tu@email.com" 
                name="email" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea 
                id="mensaje"
                placeholder="Escribe tu mensaje aquí..." 
                name="mensaje" 
                rows={5} 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="contacto-submit-btn"
              disabled={estado === 'enviando'}
            >
              {estado === 'enviando' ? 'Enviando...' : 'Enviar mensaje'}
            </button>
            
            {estado === 'exito' && (
              <div className="contacto-message success">
                <span>✓</span>
                <p>¡Mensaje enviado correctamente! Te responderemos pronto.</p>
              </div>
            )}
            
            {estado === 'error' && (
              <div className="contacto-message error">
                <span>✗</span>
                <p>{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contacto 