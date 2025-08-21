import './Home.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSeo } from '../hooks/useSeo'
import { useState, useEffect } from 'react'
import { getFeaturedProducts } from '../services/productService'
import type { Product } from '../data/products'

function Home() {
  useSeo({
    title: 'Universal de Tornillos y Ferretería',
    description: 'Compra tornillos, tuercas y ferretería en Bogotá. Universal de Tornillos y Ferretería: calidad, variedad y asesoría experta. ¡Envíos rápidos y precios bajos!'
  })
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true)
        const products = await getFeaturedProducts()
        console.log('🌟 Productos destacados cargados:', products)
        setFeaturedProducts(products)
      } catch (error) {
        console.error('Error al cargar productos destacados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedProducts()
  }, [])

  // Auto-play del carrusel
  useEffect(() => {
    if (!isAutoPlaying || featuredProducts.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % Math.ceil(featuredProducts.length / getItemsPerSlide()))
    }, 4000) // Cambiar cada 4 segundos

    return () => clearInterval(interval)
  }, [featuredProducts.length, isAutoPlaying])

  // Función para determinar cuántos productos mostrar por slide según el tamaño de pantalla
  const getItemsPerSlide = () => {
    return 1 // Siempre 1 producto por slide para mejor presentación
  }

  const totalSlides = Math.ceil(featuredProducts.length / getItemsPerSlide())

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides)
    setIsAutoPlaying(false) // Pausar auto-play cuando el usuario interactúa
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const getCurrentSlideProducts = () => {
    const itemsPerSlide = getItemsPerSlide()
    const startIndex = currentSlide * itemsPerSlide
    return featuredProducts.slice(startIndex, startIndex + itemsPerSlide)
  }
  return (
    <div className="home">
      {/* H1 oculto solo para SEO y accesibilidad */}
      <h1 style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        Universal de Tornillos y Ferretería: tornillos, tuercas y ferretería en Bogotá
      </h1>
      <section className="hero">
        <div className="hero-content" style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)', borderRadius: 24, background: 'rgba(20,22,40,0.82)', padding: '3.5rem 2.5rem 3.5rem 2.5rem', maxWidth: 1800, margin: '0 auto', marginTop: 24 }}>
          {/* Subtítulo visible con palabras clave */}
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.85)', fontWeight: 600, marginBottom: 22, marginTop: 0, textAlign: 'center', letterSpacing: 0.2, fontFamily: 'Poppins, Inter, Arial, sans-serif' }}>
            Tu ferretería especializada en tornillos, tuercas y ferretería en Bogotá
          </p>
          <h1 style={{ fontSize: 44, fontWeight: 900, color: '#ffd700', margin: '0 0 18px 0', textAlign: 'center', fontFamily: 'Poppins, Inter, Arial, sans-serif', lineHeight: 1.1 }}>
            Bienvenido a Universal de Tornillos y Ferretería
          </h1>
          <p style={{ color: '#f5f7fa', fontSize: 20, margin: '0 0 32px 0', textAlign: 'center', fontWeight: 500, fontFamily: 'Inter, Arial, sans-serif' }}>
            Compra tornillos, tuercas y ferretería en Bogotá con calidad, variedad y asesoría experta.
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

      {/* Carrusel de Productos Destacados */}
      {featuredProducts.length > 0 && (
        <section className="featured-carousel-section">
          <div className="featured-header">
            <h2 className="featured-title">
              <span className="featured-icon">⭐</span>
              Productos Destacados
            </h2>
            <p className="featured-subtitle">
              Los mejores productos seleccionados especialmente para ti
            </p>
          </div>

          <div className="carousel-container">
            {loading ? (
              <div className="featured-loading">
                <div className="loading-spinner"></div>
                <p>Cargando productos destacados...</p>
              </div>
            ) : (
              <>
                {/* Botones de navegación */}
                {totalSlides > 1 && (
                  <>
                    <button 
                      className="carousel-btn carousel-btn-prev"
                      onClick={prevSlide}
                      aria-label="Producto anterior"
                    >
                      <span className="carousel-arrow">‹</span>
                    </button>
                    
                    <button 
                      className="carousel-btn carousel-btn-next"
                      onClick={nextSlide}
                      aria-label="Siguiente producto"
                    >
                      <span className="carousel-arrow">›</span>
                    </button>
                  </>
                )}

                {/* Carrusel de productos */}
                <div className="carousel-wrapper">
                  <div 
                    className="carousel-track"
                    style={{
                      transform: `translateX(-${currentSlide * 100}%)`,
                      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                      const slideProducts = featuredProducts.slice(
                        slideIndex * getItemsPerSlide(),
                        (slideIndex + 1) * getItemsPerSlide()
                      )
                      
                      return (
                        <div key={slideIndex} className="carousel-slide">
                          <div className="carousel-products-grid">
                            {slideProducts.map(product => (
                              <div 
                                key={product.id} 
                                className="carousel-product-card"
                                onClick={() => navigate(`/producto/${product.id}`)}
                              >
                                {/* Badge de destacado */}
                                <div className="carousel-badge">
                                  ⭐ Destacado
                                </div>

                                {/* Imagen del producto */}
                                <div className="carousel-product-image">
                                  {product.image ? (
                                    <img 
                                      src={product.image} 
                                      alt={product.name}
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="carousel-placeholder">
                                      <span className="carousel-category-icon">
                                        {product.category === 'Tornillos' ? '🔩' : 
                                         product.category === 'Tuercas' ? '⚙️' : 
                                         product.category === 'Herramientas' ? '🔨' : 
                                         product.category === 'Arandelas' ? '⭕' : '🛠️'}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Información del producto */}
                                <div className="carousel-product-info">
                                  <div className="carousel-category">
                                    {product.category}
                                  </div>
                                  <h3 className="carousel-product-name">
                                    {product.name}
                                  </h3>
                                  <p className="carousel-product-description">
                                    {product.description}
                                  </p>

                                  {/* Precios */}
                                  <div className="carousel-pricing">
                                    <div className="carousel-price-main">
                                      <span className="carousel-price-label">Desde</span>
                                      <span className="carousel-price-amount">
                                        {product.priceBulk.toLocaleString('es-CO', { 
                                          style: 'currency', 
                                          currency: 'COP', 
                                          maximumFractionDigits: 0 
                                        })}
                                      </span>
                                    </div>
                                    <div className="carousel-price-note">
                                      *Precio mayorista (50+ unidades)
                                    </div>
                                  </div>

                                  {/* Stock */}
                                  <div className={`carousel-stock ${product.stock <= 10 ? 'low' : 'good'}`}>
                                    <span className="stock-icon">
                                      {product.stock === 0 ? '❌' : product.stock <= 10 ? '⚠️' : '✅'}
                                    </span>
                                    <span className="stock-text">
                                      {product.stock === 0 ? 'Agotado' : 
                                       product.stock <= 10 ? `Últimas ${product.stock}` : 
                                       'Disponible'}
                                    </span>
                                  </div>

                                  {/* Botón de acción */}
                                  <button 
                                    className="carousel-cta-btn"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      navigate(`/producto/${product.id}`)
                                    }}
                                  >
                                    <span className="btn-icon">👀</span>
                                    <span className="btn-text">Ver Detalles</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Indicadores de puntos */}
                {totalSlides > 1 && (
                  <div className="carousel-indicators">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Ir al slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Controles de auto-play */}
                <div className="carousel-controls">
                  <button
                    className={`play-pause-btn ${isAutoPlaying ? 'playing' : 'paused'}`}
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    title={isAutoPlaying ? 'Pausar carrusel' : 'Reproducir carrusel'}
                  >
                    {isAutoPlaying ? '⏸️' : '▶️'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Link para ver todos los productos */}
          <div className="carousel-footer">
            <button 
              className="view-all-btn"
              onClick={() => navigate('/productos')}
            >
              <span>Ver Todos los Productos</span>
              <span className="arrow">→</span>
            </button>
          </div>
        </section>
      )}

      <section className="features">
        <h2>¿Por qué elegirnos?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Gran Variedad</h3>
            <p>Amplio catálogo de tornillos, tuercas y ferretería</p>
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