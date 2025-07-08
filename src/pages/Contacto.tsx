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
      <h1>Contacto</h1>
      <div className="contacto-info">
        <p><strong>Teléfono:</strong> +57 3208555718</p>
        <p><strong>Email:</strong> contacto@tutienda.com</p>
        <p><strong>Dirección:</strong> Cl. 7 #28 09, Los Mártires, Bogotá, Cundinamarca</p>
        <p><strong>Horario:</strong> Lunes a Viernes, 8:00am - 6:00pm</p>
      </div>
      <form className="contacto-form" onSubmit={handleSubmit} autoComplete="off">
        <h2>Envíanos un mensaje</h2>
        <input type="text" placeholder="Nombre" name="nombre" required />
        <input type="email" placeholder="Correo electrónico" name="email" required />
        <textarea placeholder="Escribe tu mensaje aquí..." name="mensaje" rows={5} required />
        <button type="submit" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'Enviando...' : 'Enviar'}
        </button>
        {estado === 'exito' && <p style={{color:'#1a8a3a',marginTop:8}}>¡Mensaje enviado correctamente!</p>}
        {estado === 'error' && <p style={{color:'#b00020',marginTop:8}}>{error}</p>}
      </form>
    </div>
  )
}
export default Contacto 