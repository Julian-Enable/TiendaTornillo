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

const COLLECTION_NAME = 'products'

// Obtener todos los productos
export const getProducts = async (): Promise<Product[]> => {
  try {
    // Consulta simplificada sin ordenamiento para evitar índices compuestos
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
    
    // Ordenar en el cliente
    return products.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error al obtener productos:', error)
    throw error
  }
}

// Obtener un producto por ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product
    } else {
      return null
    }
  } catch (error) {
    console.error('Error al obtener producto:', error)
    throw error
  }
}

// Obtener productos por categoría
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    // Consulta simplificada sin ordenamiento para evitar índices compuestos
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('category', '==', category)
    )
    const querySnapshot = await getDocs(q)
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
    
    // Ordenar en el cliente
    return products.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error)
    throw error
  }
}

// Crear un nuevo producto
export const createProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Error al crear producto:', error)
    throw error
  }
}

// Actualizar un producto
export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      ...product,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    throw error
  }
}

// Eliminar un producto
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    throw error
  }
}

// Buscar productos por texto
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const allProducts = await getProducts()
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  } catch (error) {
    console.error('Error al buscar productos:', error)
    throw error
  }
}

// Obtener productos con stock bajo
export const getLowStockProducts = async (threshold: number = 10): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('stock', '<=', threshold),
      orderBy('stock')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error)
    throw error
  }
}

// Obtener productos destacados
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('destacado', '==', true)
    )
    const querySnapshot = await getDocs(q)
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
    
    // Ordenar por nombre en el cliente
    return products.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error al obtener productos destacados:', error)
    throw error
  }
}

// Marcar/desmarcar producto como destacado
export const toggleFeaturedProduct = async (id: string, destacado: boolean): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      destacado,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error al actualizar producto destacado:', error)
    throw error
  }
}
