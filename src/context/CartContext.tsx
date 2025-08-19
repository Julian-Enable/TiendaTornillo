import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../data/products'
import { createQuotation, getQuotationsByUser, deleteQuotation as deleteQuotationFromService } from '../services/orderService'
import { useAuth } from './AuthContext'

interface CartItem {
  product: Product
  quantity: number
}

interface Quotation {
  id: string
  name: string
  date: string
  items: CartItem[]
  total: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  sendToWhatsApp: () => void
  saveQuotation: (name?: string) => Promise<void>
  getQuotations: () => Promise<Quotation[]>
  restoreQuotation: (id: string) => Promise<void>
  deleteQuotation: (id: string) => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prevItems, { product, quantity }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const unitPrice = item.quantity >= 50 ? (item.product.priceBulk || 0) : (item.product.priceUnit || 0)
      return total + (unitPrice * item.quantity)
    }, 0)
  }

  const sendToWhatsApp = () => {
    if (items.length === 0) return
    const message =
      `Hola! Me gustaría cotizar los siguientes productos:%0A%0A` +
      items.map(item => {
        const unitPrice = item.quantity >= 50 ? (item.product.priceBulk || 0) : (item.product.priceUnit || 0)
        const total = unitPrice * item.quantity
        const priceType = item.quantity >= 50 ? ' (Mayorista)' : ' (Unitario)'
        return `- ${item.product.name}${priceType}%0A  Cantidad: ${item.quantity} | Precio: $${total.toFixed(2)}%0A`
      }).join('%0A') +
      `%0ATotal: $${getTotalPrice().toFixed(2)}`
    const whatsappUrl = `https://wa.me/573208555718?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const saveQuotation = async (name: string = 'Cotización') => {
    if (!user?.id || items.length === 0) return
    
    try {
      const orderItems = items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        priceUnit: item.product.priceUnit,
        priceBulk: item.product.priceBulk,
        total: item.quantity >= 50 ? item.product.priceBulk * item.quantity : item.product.priceUnit * item.quantity
      }))

      await createQuotation({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        name,
        items: orderItems,
        total: getTotalPrice(),
        status: 'saved'
      })
    } catch (error) {
      console.error('Error al guardar cotización:', error)
      throw error
    }
  }

  const getQuotations = async (): Promise<Quotation[]> => {
    if (!user?.id) return []
    
    try {
      const quotations = await getQuotationsByUser(user.id)
      return quotations.map(q => ({
        id: q.id,
        name: q.name,
        date: q.createdAt?.toDate?.()?.toLocaleString() || new Date().toLocaleString(),
        items: q.items.map(item => ({
          product: {
            id: item.productId,
            name: item.productName,
            priceUnit: item.priceUnit,
            priceBulk: item.priceBulk,
            category: '',
            description: '',
            stock: 0
          },
          quantity: item.quantity
        })),
        total: q.total
      }))
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error)
      return []
    }
  }

  const restoreQuotation = async (id: string) => {
    if (!user?.id) return
    
    try {
      const quotations = await getQuotationsByUser(user.id)
      const quotation = quotations.find(q => q.id === id)
      if (quotation) {
        // Convertir items de la cotización al formato del carrito
        const cartItems = quotation.items.map(item => ({
          product: {
            id: item.productId,
            name: item.productName,
            priceUnit: item.priceUnit,
            priceBulk: item.priceBulk,
            category: '',
            description: '',
            stock: 0
          },
          quantity: item.quantity
        }))
        setItems(cartItems)
      }
    } catch (error) {
      console.error('Error al restaurar cotización:', error)
    }
  }

  const deleteQuotation = async (id: string) => {
    if (!user?.id) return
    
    try {
      await deleteQuotationFromService(id)
    } catch (error) {
      console.error('Error al eliminar cotización:', error)
      throw error
    }
  }

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    sendToWhatsApp,
    saveQuotation,
    getQuotations,
    restoreQuotation,
    deleteQuotation
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 