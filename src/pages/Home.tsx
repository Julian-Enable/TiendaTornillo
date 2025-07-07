import './Home.css'

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido a Tienda de Tornillos</h1>
          <p>Tu proveedor confiable de tornillos, herramientas y materiales de construcción</p>
          <button className="cta-button">Ver Productos</button>
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