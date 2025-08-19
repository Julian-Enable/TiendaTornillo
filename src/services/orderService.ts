import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Product } from '../data/products'

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  priceUnit: number
  priceBulk: number
  total: number
}

export interface Order {
  id: string
  userId: string
  userName: string
  userEmail: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'whatsapp' | 'transfer' | 'cash'
  shippingAddress?: string
  notes?: string
  createdAt?: any
  updatedAt?: any
}

export interface Quotation {
  id: string
  userId: string
  userName: string
  userEmail: string
  name: string
  items: OrderItem[]
  total: number
  status: 'saved' | 'sent' | 'converted'
  createdAt?: any
  updatedAt?: any
}

const ORDERS_COLLECTION = 'orders'
const QUOTATIONS_COLLECTION = 'quotations'

// ===== SERVICIOS DE PEDIDOS =====

// Crear un nuevo pedido
export const createOrder = async (order: Omit<Order, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Error al crear pedido:', error)
    throw error
  }
}

// Obtener todos los pedidos
export const getOrders = async (): Promise<Order[]> => {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[]
  } catch (error) {
    console.error('Error al obtener pedidos:', error)
    throw error
  }
}

// Obtener pedidos por usuario
export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[]
  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error)
    throw error
  }
}

// Obtener un pedido por ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order
    } else {
      return null
    }
  } catch (error) {
    console.error('Error al obtener pedido:', error)
    throw error
  }
}

// Actualizar estado de pedido
export const updateOrderStatus = async (id: string, status: Order['status']): Promise<void> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, id)
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error)
    throw error
  }
}

// Eliminar pedido
export const deleteOrder = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error al eliminar pedido:', error)
    throw error
  }
}

// Obtener pedidos por estado
export const getOrdersByStatus = async (status: Order['status']): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION), 
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[]
  } catch (error) {
    console.error('Error al obtener pedidos por estado:', error)
    throw error
  }
}

// ===== SERVICIOS DE COTIZACIONES =====

// Crear una nueva cotización
export const createQuotation = async (quotation: Omit<Quotation, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, QUOTATIONS_COLLECTION), {
      ...quotation,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Error al crear cotización:', error)
    throw error
  }
}

// Obtener cotizaciones por usuario
export const getQuotationsByUser = async (userId: string): Promise<Quotation[]> => {
  try {
    // Consulta simplificada sin ordenamiento para evitar índices compuestos
    const q = query(
      collection(db, QUOTATIONS_COLLECTION), 
      where('userId', '==', userId)
    )
    const querySnapshot = await getDocs(q)
    const quotations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Quotation[]
    
    // Ordenar en el cliente
    return quotations.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0)
      const dateB = b.createdAt?.toDate?.() || new Date(0)
      return dateB.getTime() - dateA.getTime()
    })
  } catch (error) {
    console.error('Error al obtener cotizaciones del usuario:', error)
    throw error
  }
}

// Obtener una cotización por ID
export const getQuotationById = async (id: string): Promise<Quotation | null> => {
  try {
    const docRef = doc(db, QUOTATIONS_COLLECTION, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Quotation
    } else {
      return null
    }
  } catch (error) {
    console.error('Error al obtener cotización:', error)
    throw error
  }
}

// Actualizar cotización
export const updateQuotation = async (id: string, quotation: Partial<Quotation>): Promise<void> => {
  try {
    const docRef = doc(db, QUOTATIONS_COLLECTION, id)
    await updateDoc(docRef, {
      ...quotation,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error al actualizar cotización:', error)
    throw error
  }
}

// Eliminar cotización
export const deleteQuotation = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, QUOTATIONS_COLLECTION, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error al eliminar cotización:', error)
    throw error
  }
}

// Convertir cotización a pedido
export const convertQuotationToOrder = async (quotationId: string, orderData: Omit<Order, 'id'>): Promise<string> => {
  try {
    // Crear el pedido
    const orderId = await createOrder(orderData)
    
    // Actualizar estado de la cotización
    await updateQuotation(quotationId, { status: 'converted' })
    
    return orderId
  } catch (error) {
    console.error('Error al convertir cotización a pedido:', error)
    throw error
  }
}

// ===== FUNCIONES UTILITARIAS =====

// Crear items de pedido desde el carrito
export const createOrderItemsFromCart = (cartItems: any[], products: Product[]): OrderItem[] => {
  return cartItems.map(item => {
    const product = products.find(p => p.id === item.product.id)
    if (!product) {
      throw new Error(`Producto no encontrado: ${item.product.id}`)
    }
    
    return {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      priceUnit: product.priceUnit,
      priceBulk: product.priceBulk,
      total: item.quantity >= 50 ? product.priceBulk * item.quantity : product.priceUnit * item.quantity
    }
  })
}

// Calcular total del pedido
export const calculateOrderTotal = (items: OrderItem[]): number => {
  return items.reduce((total, item) => total + item.total, 0)
}

// Obtener estadísticas de pedidos
export const getOrderStats = async (): Promise<{
  total: number
  pending: number
  confirmed: number
  shipped: number
  delivered: number
  cancelled: number
  totalRevenue: number
}> => {
  try {
    const orders = await getOrders()
    
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
    }
    
    return stats
  } catch (error) {
    console.error('Error al obtener estadísticas de pedidos:', error)
    throw error
  }
}
