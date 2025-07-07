import { useState, useMemo } from 'react'
import { products, categories } from '../data/products'
import type { Product } from '../data/products'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import './Productos.css'

function Productos() {
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' })
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchTerm])

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      setToast({ show: true, message: 'Debes iniciar sesión para agregar productos al carrito' })
      return
    }
    addToCart(product)
    setToast({ show: true, message: 'Producto añadido al carrito' })
  }

  return (
    <div className="productos-container">
      <Toast message={toast.message} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
      <div className="productos-header">
        <h1>Nuestros Productos</h1>
        <p>Encuentra los tornillos y herramientas que necesitas</p>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <div className="placeholder-image">
                {product.category.charAt(0)}
              </div>
            </div>
            
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              {product.specifications && (
                <div className="product-specs">
                  {product.specifications.size && (
                    <span className="spec">Tamaño: {product.specifications.size}</span>
                  )}
                  {product.specifications.material && (
                    <span className="spec">Material: {product.specifications.material}</span>
                  )}
                </div>
              )}
              
              <div className="product-footer">
                <div className="product-price">
                  <span className="price">${product.price.toFixed(2)}</span>
                  <span className="stock">Stock: {product.stock}</span>
                </div>
                
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>No se encontraron productos con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  )
}

export default Productos 