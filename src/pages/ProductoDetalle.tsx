import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import type { Product } from '../data/products'
import '../pages/Productos.css'

// Importar productos de prueba desde Productos.tsx (temporalmente, hasta que haya backend)
import { mockProducts } from '../data/mockProducts'

function ProductoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  // Buscar producto por id
  const product: Product | undefined = mockProducts.find(p => p.id === id)
  const [cantidad, setCantidad] = useState(1)
  const [mensaje, setMensaje] = useState('')

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
    <div className="productos-container" style={{maxWidth: 700, margin: '0 auto'}}>
      <button onClick={() => navigate(-1)} className="add-to-cart-btn" style={{margin: '2rem 0 1rem 0'}}>Volver</button>
      <div className="product-detail-card">
        <div className="product-image" style={{width: 180, height: 180, margin: '0 auto 1.5rem auto'}}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
          ) : (
            <div className="placeholder-image">{product.category.charAt(0)}</div>
          )}
        </div>
        <h2 style={{textAlign: 'center', color: '#fff', fontSize: '2rem', marginBottom: '0.5rem'}}>{product.name}</h2>
        <p className="product-description" style={{fontSize: '1.1rem', color: '#e0e0e0', textAlign: 'center', marginBottom: '1.2rem'}}>{product.description}</p>
        <div className="product-specs" style={{marginBottom: '1.2rem'}}>
          {product.specifications?.size && <div className="spec">Tamaño: {product.specifications.size}</div>}
          {product.specifications?.material && <div className="spec">Material: {product.specifications.material}</div>}
          {product.specifications?.type && <div className="spec">Tipo: {product.specifications.type}</div>}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.2rem', justifyContent: 'center'}}>
          <span className="price" style={{fontSize: '1.5rem'}}>{product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</span>
          <span className="stock">Stock: {product.stock}</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem'}}>
          <label htmlFor="cantidad" style={{color: '#fff'}}>Cantidad:</label>
          <input
            id="cantidad"
            type="number"
            min={1}
            max={product.stock}
            value={cantidad}
            onChange={e => setCantidad(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
            style={{width: 60, padding: '0.4rem', borderRadius: 6, border: '1.5px solid #ffd700', fontSize: '1.1rem'}}
          />
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0} style={{width: '100%', fontSize: '1.15rem'}}>
          {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
        </button>
        {mensaje && <div style={{marginTop: '1.2rem', color: '#ffd700', textAlign: 'center'}}>{mensaje}</div>}
      </div>
    </div>
  )
}

export default ProductoDetalle 