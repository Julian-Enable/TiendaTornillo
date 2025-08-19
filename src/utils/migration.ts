import { mockProducts } from '../data/mockProducts'
import { createProduct } from '../services/productService'
import { createUser } from '../services/userService'
import type { User } from '../services/userService'

// Datos de usuarios iniciales
const initialUsers: Omit<User, 'id'>[] = [
  {
    name: 'Administrador',
    email: 'admin@admin.com',
    phone: '+573208555718',
    address: 'Bogotá, Colombia',
    city: 'Bogotá',
    isAdmin: true
  },
  {
    name: 'Usuario Demo',
    email: 'usuario@demo.com',
    phone: '+573001234567',
    address: 'Calle 123 #45-67',
    city: 'Bogotá',
    isAdmin: false
  }
]

// Función para migrar productos
export const migrateProducts = async (): Promise<void> => {
  try {
    console.log('Iniciando migración de productos...')
    
    for (const product of mockProducts) {
      const { id, ...productData } = product
      await createProduct(productData)
      console.log(`Producto migrado: ${product.name}`)
    }
    
    console.log('Migración de productos completada')
  } catch (error) {
    console.error('Error en migración de productos:', error)
    throw error
  }
}

// Función para migrar usuarios
export const migrateUsers = async (): Promise<void> => {
  try {
    console.log('Iniciando migración de usuarios...')
    
    for (const user of initialUsers) {
      await createUser(user)
      console.log(`Usuario migrado: ${user.name}`)
    }
    
    console.log('Migración de usuarios completada')
  } catch (error) {
    console.error('Error en migración de usuarios:', error)
    throw error
  }
}

// Función para ejecutar toda la migración
export const runMigration = async (): Promise<void> => {
  try {
    console.log('=== INICIANDO MIGRACIÓN COMPLETA ===')
    
    await migrateUsers()
    await migrateProducts()
    
    console.log('=== MIGRACIÓN COMPLETADA EXITOSAMENTE ===')
  } catch (error) {
    console.error('Error en migración completa:', error)
    throw error
  }
}

// Función para verificar si ya existen datos
export const checkExistingData = async (): Promise<{
  hasUsers: boolean
  hasProducts: boolean
}> => {
  try {
    // Importar dinámicamente para evitar errores de configuración
    const { getUsers } = await import('../services/userService')
    const { getProducts } = await import('../services/productService')
    
    const users = await getUsers()
    const products = await getProducts()
    
    return {
      hasUsers: users.length > 0,
      hasProducts: products.length > 0
    }
  } catch (error) {
    console.error('Error al verificar datos existentes:', error)
    return {
      hasUsers: false,
      hasProducts: false
    }
  }
}
