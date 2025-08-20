import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import type { Product } from '../data/products'
import '../pages/Productos.css'
import { useSeo } from '../hooks/useSeo'

// Importar servicio de productos
import { getProductById } from '../services/productService'

function ProductoDetalle() {
  useSeo({
    title: 'Detalle de Producto | Tienda de Tornillos',
    description: 'Consulta las características, especificaciones y precios de nuestros productos. Compra tornillos, herramientas y más con envío rápido.'
  })
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [cantidad, setCantidad] = useState(1)
  const [mensaje, setMensaje] = useState('')

  // Cargar producto desde Firestore
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return
      try {
        setLoading(true)
        const productData = await getProductById(id)
        setProduct(productData)
      } catch (error) {
        console.error('Error al cargar producto:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  if (loading) {
    return (
      <div className="productos-container">
        <div className="no-products">
          <h2>Cargando producto...</h2>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="productos-container">
        <div className="no-products">
          <h2>Producto no encontrado</h2>
          <button onClick={() => navigate(-1)} className="add-to-cart-btn" style={{marginTop: '2rem'}}>Volver</button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setMensaje('Debes iniciar sesión para agregar productos al carrito')
      return
    }
    addToCart(product, cantidad)
    setMensaje('Producto añadido al carrito')
  }

  return (
    <div className="product-detail-container">
      {/* Header con navegación */}
      <div className="detail-header">
        <button 
          onClick={() => navigate(-1)} 
          className="back-button"
          aria-label="Volver a productos"
        >
          <span className="back-icon">←</span>
          <span className="back-text">Volver</span>
        </button>
        
        {/* Badge de categoría */}
        <div className="category-badge">
          <span className="category-emoji">
            {product.category === 'Tornillos' ? '🔩' : 
             product.category === 'Tuercas' ? '⚙️' : 
             product.category === 'Herramientas' ? '🔨' : 
             product.category === 'Arandelas' ? '⭕' : '🛠️'}
          </span>
          {product.category}
        </div>
      </div>

      <div className="product-detail-layout">
        {/* Sección principal de imagen - PROTAGONISTA */}
        <div className="product-hero">
          <div className="hero-image-container">
            {/* Badges de estado */}
            {product.stock <= 10 && product.stock > 0 && (
              <div className="hero-badge low-stock">
                ⚡ ¡Últimas {product.stock} unidades!
              </div>
            )}
            {product.stock === 0 && (
              <div className="hero-badge out-of-stock">
                😔 Agotado
              </div>
            )}
            
            {/* Imagen principal */}
            <div className="hero-image-wrapper">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="hero-image"
                  loading="eager"
                />
              ) : (
                <div className="hero-placeholder">
                  <span className="hero-category-icon">
                    {product.category === 'Tornillos' ? '🔩' : 
                     product.category === 'Tuercas' ? '⚙️' : 
                     product.category === 'Herramientas' ? '🔨' : 
                     product.category === 'Arandelas' ? '⭕' : '🛠️'}
                  </span>
                </div>
              )}
            </div>
            
            {/* Indicador de zoom */}
            <div className="zoom-indicator">
              🔍 Click para ampliar
            </div>
          </div>
        </div>

        {/* Información del producto */}
        <div className="product-info-section">
          {/* Título y descripción */}
          <div className="product-header-info">
            <h1 className="product-title-main">{product.name}</h1>
            <p className="product-description-main">{product.description}</p>
          </div>

          {/* Especificaciones */}
          <div className="specifications-section">
            <h3 className="section-title">📋 Especificaciones</h3>
            <div className="specs-grid">
              {product.specifications?.size && (
                <div className="spec-item-detail">
                  <span className="spec-icon">📏</span>
                  <div className="spec-content">
                    <span className="spec-label">Tamaño</span>
                    <span className="spec-value">{product.specifications.size}</span>
                  </div>
                </div>
              )}
              {product.specifications?.material && (
                <div className="spec-item-detail">
                  <span className="spec-icon">🔗</span>
                  <div className="spec-content">
                    <span className="spec-label">Material</span>
                    <span className="spec-value">{product.specifications.material}</span>
                  </div>
                </div>
              )}
              {product.specifications?.type && (
                <div className="spec-item-detail">
                  <span className="spec-icon">⚙️</span>
                  <div className="spec-content">
                    <span className="spec-label">Tipo</span>
                    <span className="spec-value">{product.specifications.type}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sección de precios prominente */}
          <div className="pricing-section-detail">
            <h3 className="section-title">💰 Precios</h3>
            <div className="pricing-cards-detail">
              <div className="price-card-detail unit-price-detail">
                <div className="price-header">
                  <span className="price-icon">🏪</span>
                  <span className="price-type">Precio Unitario</span>
                </div>
                <div className="price-amount">
                  {(product.priceUnit || 0).toLocaleString('es-CO', { 
                    style: 'currency', 
                    currency: 'COP', 
                    maximumFractionDigits: 0 
                  })}
                </div>
                <div className="price-description">Por unidad</div>
              </div>
              
              <div className="price-vs">VS</div>
              
              <div className="price-card-detail bulk-price-detail">
                <div className="price-header">
                  <span className="price-icon">📦</span>
                  <span className="price-type">Precio Mayorista</span>
                </div>
                <div className="price-amount">
                  {(product.priceBulk || 0).toLocaleString('es-CO', { 
                    style: 'currency', 
                    currency: 'COP', 
                    maximumFractionDigits: 0 
                  })}
                </div>
                <div className="price-description">50+ unidades</div>
                <div className="savings-badge">
                  ¡Ahorra {Math.round(((product.priceUnit - product.priceBulk) / product.priceUnit) * 100)}%!
                </div>
              </div>
            </div>
          </div>

          {/* Stock y disponibilidad */}
          <div className="stock-section-detail">
            <div className={`stock-display ${product.stock <= 10 ? 'low' : 'good'}`}>
              <span className="stock-icon">
                {product.stock === 0 ? '❌' : product.stock <= 10 ? '⚠️' : '✅'}
              </span>
              <div className="stock-info">
                <span className="stock-label">Disponibilidad</span>
                <span className="stock-amount">
                  {product.stock === 0 ? 'Sin stock' : 
                   product.stock <= 10 ? `Quedan ${product.stock} unidades` : 
                   `${product.stock} unidades disponibles`}
                </span>
              </div>
            </div>
          </div>

          {/* Sección de compra */}
          <div className="purchase-section">
            <div className="quantity-selector">
              <label htmlFor="cantidad" className="quantity-label">
                📦 Cantidad:
              </label>
              <div className="quantity-input-wrapper">
                <button 
                  className="quantity-btn minus"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  disabled={cantidad <= 1}
                >
                  −
                </button>
                <input
                  id="cantidad"
                  type="number"
                  min={1}
                  max={product.stock}
                  value={cantidad}
                  onChange={e => setCantidad(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                  className="quantity-input"
                />
                <button 
                  className="quantity-btn plus"
                  onClick={() => setCantidad(Math.min(product.stock, cantidad + 1))}
                  disabled={cantidad >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Indicador de tipo de compra */}
            <div className={`purchase-type-indicator ${cantidad >= 50 ? 'bulk' : 'unit'}`}>
              <span className="indicator-icon">
                {cantidad >= 50 ? '📦' : '🏪'}
              </span>
              <span className="indicator-text">
                {cantidad >= 50 ? 
                  `Compra mayorista - Precio: ${product.priceBulk.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })} c/u` : 
                  `Compra unitaria - Precio: ${product.priceUnit.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })} c/u`
                }
              </span>
            </div>

            {/* Total calculado */}
            <div className="total-calculation">
              <span className="total-label">Total a pagar:</span>
              <span className="total-amount">
                {((cantidad >= 50 ? product.priceBulk : product.priceUnit) * cantidad).toLocaleString('es-CO', { 
                  style: 'currency', 
                  currency: 'COP', 
                  maximumFractionDigits: 0 
                })}
              </span>
            </div>

            {/* Botón de acción principal */}
            <button 
              className={`add-to-cart-btn-detail ${product.stock === 0 ? 'disabled' : ''}`}
              onClick={handleAddToCart} 
              disabled={product.stock === 0}
              aria-label={product.stock === 0 ? 'Producto agotado' : `Agregar ${cantidad} ${product.name} al carrito`}
            >
              <span className="btn-icon-detail">
                {product.stock === 0 ? '😞' : '🛒'}
              </span>
              <span className="btn-text-detail">
                {product.stock === 0 ? 'Producto Agotado' : 'Agregar al Carrito'}
              </span>
            </button>
            
            {mensaje && (
              <div className="success-message">
                ✅ {mensaje}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductoDetalle 