import { useState, useEffect, useMemo } from 'react'
import { categories } from '../data/products'
import type { Product } from '../data/products'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import './Productos.css'
import { useNavigate } from 'react-router-dom'
import { mockProducts } from '../data/mockProducts'

export const products = [
  {
    id: '1',
    name: 'Tornillo Allen M6x20',
    price: 2.5,
    category: 'Tornillos',
    description: 'Tornillo de acero inoxidable, cabeza Allen, tamaño M6x20mm.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80',
    stock: 120,
    specifications: {
      size: 'M6x20',
      material: 'Acero inoxidable',
      type: 'Allen'
    }
  },
  {
    id: '2',
    name: 'Tuerca Hexagonal M6',
    price: 1.2,
    category: 'Tuercas',
    description: 'Tuerca hexagonal estándar para tornillos M6.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80',
    stock: 200,
    specifications: {
      size: 'M6',
      material: 'Acero galvanizado'
    }
  },
  {
    id: '3',
    name: 'Destornillador Phillips',
    price: 5.9,
    category: 'Herramientas',
    description: 'Destornillador punta Phillips, mango ergonómico.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=80&q=80',
    stock: 35,
    specifications: {
      material: 'Acero templado',
      type: 'Phillips'
    }
  },
  {
    id: '4',
    name: 'Arandela Plana M6',
    price: 0.5,
    category: 'Arandelas',
    description: 'Arandela plana para tornillo M6, acero zincado.',
    stock: 500,
    specifications: {
      size: 'M6',
      material: 'Acero zincado'
    }
  },
  {
    id: '5',
    name: 'Juego de Llaves Allen',
    price: 12.0,
    category: 'Herramientas',
    description: 'Set de 9 llaves Allen de diferentes tamaños.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80',
    stock: 15,
    specifications: {
      material: 'Acero al cromo-vanadio'
    }
  },
  {
    id: '6',
    name: 'Tornillo Phillips M4x16',
    price: 1.8,
    category: 'Tornillos',
    description: 'Tornillo cabeza Phillips, acero niquelado, M4x16mm.',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=80&q=80',
    stock: 80,
    specifications: {
      size: 'M4x16',
      material: 'Acero niquelado',
      type: 'Phillips'
    }
  },
  {
    id: '7',
    name: 'Tuerca Mariposa M8',
    price: 2.1,
    category: 'Tuercas',
    description: 'Tuerca tipo mariposa para ajustes manuales, M8.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80',
    stock: 60,
    specifications: {
      size: 'M8',
      material: 'Acero inoxidable'
    }
  },
  {
    id: '8',
    name: 'Arandela Grower M6',
    price: 0.7,
    category: 'Arandelas',
    description: 'Arandela de presión tipo grower para tornillo M6.',
    stock: 300,
    specifications: {
      size: 'M6',
      material: 'Acero templado'
    }
  },
  {
    id: '9',
    name: 'Martillo Carpintero',
    price: 14.5,
    category: 'Herramientas',
    description: 'Martillo de carpintero con mango de fibra y cabeza de acero.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80',
    stock: 22,
    specifications: {
      material: 'Acero y fibra',
      type: 'Carpintero'
    }
  },
  {
    id: '10',
    name: 'Cinta Métrica 5m',
    price: 6.8,
    category: 'Accesorios',
    description: 'Cinta métrica retráctil de 5 metros, carcasa plástica.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=80&q=80',
    stock: 40,
    specifications: {
      size: '5m',
      material: 'Plástico y metal'
    }
  },
  {
    id: '11',
    name: 'Tornillo Rosca Chapa 3.5x25',
    price: 0.9,
    category: 'Tornillos',
    description: 'Tornillo para chapa, rosca gruesa, 3.5x25mm.',
    stock: 150,
    specifications: {
      size: '3.5x25',
      material: 'Acero zincado'
    }
  },
  {
    id: '12',
    name: 'Llave Inglesa 8"',
    price: 11.5,
    category: 'Herramientas',
    description: 'Llave ajustable de 8 pulgadas, acero forjado.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80',
    stock: 18,
    specifications: {
      size: '8"',
      material: 'Acero forjado'
    }
  },
  {
    id: '13',
    name: 'Caja Organizadora',
    price: 8.9,
    category: 'Accesorios',
    description: 'Caja plástica con divisiones para tornillos y tuercas.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=80&q=80',
    stock: 25,
    specifications: {
      material: 'Plástico resistente'
    }
  },
  {
    id: '14',
    name: 'Tornillo Allen M8x30',
    price: 3.2,
    category: 'Tornillos',
    description: 'Tornillo Allen de alta resistencia, M8x30mm.',
    stock: 90,
    specifications: {
      size: 'M8x30',
      material: 'Acero aleado',
      type: 'Allen'
    }
  },
  {
    id: '15',
    name: 'Tuerca Ciega M10',
    price: 2.7,
    category: 'Tuercas',
    description: 'Tuerca ciega para acabados estéticos, M10.',
    stock: 70,
    specifications: {
      size: 'M10',
      material: 'Acero cromado'
    }
  }
]

function Productos() {
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' })
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [productsState, setProducts] = useState<Product[]>(mockProducts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const filteredProducts = useMemo(() => {
    return productsState.filter(product => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchTerm, productsState])

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
              <div key={product.id} className="product-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: 440, padding: '8px 0 0 0' }}>
                <div className="product-image" style={{ alignSelf: 'center', marginTop: 0, marginBottom: 0, cursor: 'pointer' }} onClick={() => navigate(`/producto/${product.id}`)}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} style={{ maxWidth: 110, maxHeight: 110, borderRadius: '50%', objectFit: 'cover', margin: '0 auto' }} />
                  ) : (
                    <div className="placeholder-image" style={{ width: 110, height: 110, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, background: '#ffd700', color: '#1a1a2e', margin: '0 auto' }}>
                      {product.category.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="product-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <h3
                    style={{ fontSize: 22, fontWeight: 800, color: '#ffd700', margin: '12px 0 4px 0', lineHeight: 1.1, textAlign: 'center', minHeight: 28, cursor: 'pointer', textDecoration: 'underline dotted' }}
                    onClick={() => navigate(`/producto/${product.id}`)}
                  >
                    {product.name || 'Producto sin nombre'}
                  </h3>
                  <p className="product-description" style={{ color: '#e0e0e0', fontSize: 15, marginBottom: 12, textAlign: 'center', maxWidth: 220, minHeight: 20 }}>{product.description || 'Sin descripción disponible.'}</p>
                  {product.specifications && (
                    <div className="product-specs" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16, width: '100%', alignItems: 'center' }}>
                      <span className="spec" style={{ background: 'rgba(35,36,58,0.85)', color: '#ffd700', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                        {product.specifications.size && product.specifications.size.trim() !== '' ? `Tamaño: ${product.specifications.size}` : 'Tamaño: No especificado'}
                      </span>
                      <span className="spec" style={{ background: 'rgba(35,36,58,0.85)', color: '#ffd700', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15 }}>
                        {product.specifications.material && product.specifications.material.trim() !== '' ? `Material: ${product.specifications.material}` : 'Material: No especificado'}
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 18, margin: '10px 0 8px 0', alignItems: 'flex-end', justifyContent: 'center', width: '100%' }}>
                    <div style={{ background: 'rgba(35,36,58,0.92)', borderRadius: 12, padding: '10px 18px', minWidth: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px rgba(26,26,46,0.10)' }}>
                      <span style={{ fontWeight: 700, color: '#e0e0e0', fontSize: 16, marginBottom: 2 }}>Unidad</span>
                      <span style={{ fontWeight: 700, color: '#e0e0e0', fontSize: 18 }}>{product.priceUnit.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</span>
                    </div>
                    <div style={{ background: 'rgba(35,36,58,0.92)', borderRadius: 12, padding: '10px 18px', minWidth: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px rgba(26,26,46,0.10)' }}>
                      <span style={{ fontWeight: 700, color: '#ffd700', fontSize: 16, marginBottom: 2 }}>Mayor (50+)</span>
                      <span style={{ fontWeight: 700, color: '#ffd700', fontSize: 18 }}>{product.priceBulk.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                  <span className="stock" style={{ color: '#bfc4d1', fontSize: 13, margin: '4px 0 0 0', textAlign: 'center', display: 'block', fontWeight: 400, letterSpacing: 0.2 }}>
                    <span role="img" aria-label="stock" style={{ marginRight: 4 }}>📦</span>Stock: {product.stock}
                  </span>
                </div>
                <button
                  className="add-to-cart-btn"
                  style={{ margin: '18px 0 10px 0', alignSelf: 'center', width: '90%' }}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
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