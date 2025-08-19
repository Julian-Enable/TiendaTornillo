import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import { useState } from 'react'
import './Carrito.css'
import { useSeo } from '../hooks/useSeo'

function Carrito() {
  useSeo({
    title: 'Carrito de Compras | Tienda de Tornillos',
    description: 'Revisa y gestiona los productos en tu carrito antes de finalizar tu compra. Compra tornillos, herramientas y más con envío rápido.'
  })
  const { items, removeFromCart, updateQuantity, getTotalPrice, sendToWhatsApp, clearCart, saveQuotation } = useCart()
  const { isAuthenticated, user } = useAuth()
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' })

  if (!isAuthenticated) {
    return (
      <div className="carrito-container">
        <div className="auth-required">
          <h2>Inicia sesión para ver tu carrito</h2>
          <p>Necesitas estar registrado para agregar productos al carrito y realizar compras.</p>
          <a href="/login" className="login-link">Iniciar Sesión</a>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="carrito-container">
        <div className="empty-cart">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega algunos productos para comenzar tu compra.</p>
          <a href="/productos" className="shop-link">Ver Productos</a>
        </div>
      </div>
    )
  }

  const handleSaveQuotation = () => {
    if (user?.email) {
      saveQuotation(user.email)
      setToast({ show: true, message: 'Cotización guardada correctamente' })
    }
  }

  return (
    <div className="carrito-container">
      <Toast message={toast.message} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
      <div className="carrito-header">
        <h1>Tu Carrito de Compras</h1>
        <p>Tienes {items.length} producto{items.length !== 1 ? 's' : ''} en tu carrito</p>
      </div>

      <div className="carrito-content">
        <div className="carrito-items">
          {items.map(item => (
            <div key={item.product.id} className="carrito-item">
              <div className="item-image">
                <div className="placeholder-image">
                  {item.product.category.charAt(0)}
                </div>
              </div>
              
                             <div className="item-info">
                 <h3>{item.product.name}</h3>
                 <p className="item-description">{item.product.description}</p>
                 <div className="item-price">
                   ${item.quantity >= 50 ? (item.product.priceBulk || 0) : (item.product.priceUnit || 0)} c/u
                   {item.quantity >= 50 && <span style={{color: '#ffd700', fontSize: '0.9em', marginLeft: '8px'}}>(Mayorista)</span>}
                 </div>
               </div>
              
              <div className="item-quantity">
                <label>Cantidad:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
              
                             <div className="item-total">
                 <span className="total-price">
                   ${((item.quantity >= 50 ? (item.product.priceBulk || 0) : (item.product.priceUnit || 0)) * item.quantity).toFixed(2)}
                 </span>
                 <button
                   className="remove-btn"
                   onClick={() => removeFromCart(item.product.id)}
                 >
                   Eliminar
                 </button>
               </div>
            </div>
          ))}
        </div>

        <div className="carrito-summary">
          <h3>Resumen de Compra</h3>
          
          <div className="summary-item">
            <span>Subtotal:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          
          <div className="summary-item">
            <span>Envío:</span>
            <span>Gratis</span>
          </div>
          
          <div className="summary-total">
            <span>Total:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          
          <div className="carrito-actions">
            <button className="whatsapp-btn" onClick={sendToWhatsApp}>
              📱 Cotizar por WhatsApp
            </button>
            
            <button className="clear-cart-btn" onClick={clearCart}>
              Vaciar Carrito
            </button>
            <button className="save-quotation-btn" onClick={handleSaveQuotation}>
              💾 Guardar Cotización
            </button>
          </div>
          
          <div className="whatsapp-info">
            <p>💡 Al hacer clic en "Cotizar por WhatsApp" se abrirá una conversación con nuestro equipo de ventas.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carrito 