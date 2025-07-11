import './Home.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSeo } from '../hooks/useSeo'

function Home() {
  useSeo({
    title: 'Tornillos en Bogotá | Universal de Tornillos y Herramientas',
    description: 'Compra tornillos, tuercas y herramientas en Bogotá. Universal de Tornillos y Herramientas: calidad, variedad y asesoría experta. ¡Envíos rápidos y precios bajos!'
  })
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  return (
    <div className="home">
      {/* H1 oculto solo para SEO y accesibilidad */}
      <h1 style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        Universal de Tornillos y Herramientas: tornillos, tuercas y herramientas en Bogotá
      </h1>
      <section className="hero">
        <div className="hero-content" style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)', borderRadius: 24, background: 'rgba(20,22,40,0.82)', padding: '3.5rem 2.5rem 3.5rem 2.5rem', maxWidth: 700, margin: '0 auto', marginTop: 24 }}>
          {/* Subtítulo visible con palabras clave */}
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.85)', fontWeight: 600, marginBottom: 22, marginTop: 0, textAlign: 'center', letterSpacing: 0.2, fontFamily: 'Poppins, Inter, Arial, sans-serif' }}>
            Tu ferretería especializada en tornillos, tuercas y herramientas en Bogotá
          </p>
          <h1 style={{ fontSize: 44, fontWeight: 900, color: '#ffd700', margin: '0 0 18px 0', textAlign: 'center', fontFamily: 'Poppins, Inter, Arial, sans-serif', lineHeight: 1.1 }}>
            Bienvenido a Universal de Tornillos y Herramientas
          </h1>
          <p style={{ color: '#f5f7fa', fontSize: 20, margin: '0 0 32px 0', textAlign: 'center', fontWeight: 500, fontFamily: 'Inter, Arial, sans-serif' }}>
            Compra tornillos, tuercas y herramientas en Bogotá con calidad, variedad y asesoría experta.
          </p>
          <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 18 }}>
            <button className="cta-button" style={{ fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 700, fontSize: 20, transition: 'background 0.2s, color 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.background = '#ffe066'; e.currentTarget.style.color = '#1a1a2e'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#ffd700'; e.currentTarget.style.color = '#1a1a2e'; }}
              onClick={() => navigate('/productos')}
            >
              Ver Productos
            </button>
            {isAdmin && (
              <button className="cta-button" style={{ background: '#ffd700', color: '#1a1a2e', fontWeight: 700, fontFamily: 'Poppins, Inter, Arial, sans-serif', fontSize: 20 }} onClick={() => navigate('/admin')}>
                Administrar productos
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <h2>¿Por qué elegirnos?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Gran Variedad</h3>
            <p>Amplio catálogo de tornillos, tuercas y herramientas</p>
          </div>
          <div className="feature-card">
            <h3>Calidad Garantizada</h3>
            <p>Productos de primera calidad para tus proyectos</p>
          </div>
          <div className="feature-card">
            <h3>Atención Personalizada</h3>
            <p>Asesoramiento experto para encontrar lo que necesitas</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 