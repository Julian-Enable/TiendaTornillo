import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  image?: string
  stock: number
  specifications?: {
    size?: string
    material?: string
    type?: string
  }
}

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
  saveQuotation: (userEmail: string, name?: string) => void
  getQuotations: (userEmail: string) => Quotation[]
  restoreQuotation: (userEmail: string, id: string) => void
  deleteQuotation: (userEmail: string, id: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
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
        window.alert('Producto añadido al carrito')
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        window.alert('Producto añadido al carrito')
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
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const sendToWhatsApp = () => {
    if (items.length === 0) return
    const message =
      `Hola! Me gustaría cotizar los siguientes productos:%0A%0A` +
      items.map(item =>
        `- ${item.product.name}%0A  Cantidad: ${item.quantity} | Precio: $${(item.product.price * item.quantity).toFixed(2)}%0A`
      ).join('%0A') +
      `%0ATotal: $${getTotalPrice().toFixed(2)}`
    const whatsappUrl = `https://wa.me/573208555718?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const saveQuotation = (userEmail: string, name: string = 'Cotización') => {
    if (!userEmail || items.length === 0) return
    const quotationsKey = `quotations_${userEmail}`
    const prev: Quotation[] = JSON.parse(localStorage.getItem(quotationsKey) || '[]')
    const newQuotation: Quotation = {
      id: Date.now().toString(),
      name,
      date: new Date().toLocaleString(),
      items,
      total: getTotalPrice()
    }
    localStorage.setItem(quotationsKey, JSON.stringify([newQuotation, ...prev]))
  }

  const getQuotations = (userEmail: string): Quotation[] => {
    if (!userEmail) return []
    const quotationsKey = `quotations_${userEmail}`
    return JSON.parse(localStorage.getItem(quotationsKey) || '[]')
  }

  const restoreQuotation = (userEmail: string, id: string) => {
    const quotations = getQuotations(userEmail)
    const quotation = quotations.find(q => q.id === id)
    if (quotation) setItems(quotation.items)
  }

  const deleteQuotation = (userEmail: string, id: string) => {
    const quotationsKey = `quotations_${userEmail}`
    const quotations = getQuotations(userEmail).filter(q => q.id !== id)
    localStorage.setItem(quotationsKey, JSON.stringify(quotations))
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