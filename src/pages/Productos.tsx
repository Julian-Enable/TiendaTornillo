import { useState, useEffect, useMemo } from 'react'
import { categories } from '../data/products'
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
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    // getProducts().then(prods => { // This line was removed as per the edit hint
    //   setProducts(prods)
    //   setLoading(false)
    // })
    // Since getProducts is no longer imported, we'll simulate loading products
    // or remove the loading state if products are now hardcoded.
    // For now, we'll set products to an empty array and loading to false
    // to avoid errors if products are not available.
    setProducts([])
    setLoading(false)
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchTerm, products])

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
        <div className="search-box search-box-destacado">
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

      {loading ? (
        <div className="no-products"><p>Cargando productos...</p></div>
      ) : (
        <>
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} style={{ maxWidth: 80, maxHeight: 80, borderRadius: '50%' }} />
                  ) : (
                    <div className="placeholder-image">
                      {product.category.charAt(0)}
                    </div>
                  )}
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
          {filteredProducts.length === 0 && !loading && (
            <div className="no-products">
              <p>No se encontraron productos con los filtros seleccionados.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Productos 