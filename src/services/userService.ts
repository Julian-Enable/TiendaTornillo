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

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  isAdmin: boolean
  createdAt?: any
  updatedAt?: any
  lastLogin?: any
}

export interface UserProfile {
  id: string
  userId: string
  preferences?: {
    notifications: boolean
    newsletter: boolean
  }
  orders: number
  totalSpent: number
  createdAt?: any
  updatedAt?: any
}

const USERS_COLLECTION = 'users'
const PROFILES_COLLECTION = 'userProfiles'

// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]> => {
  try {
    const q = query(collection(db, USERS_COLLECTION), orderBy('name'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[]
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    throw error
  }
}

// Obtener un usuario por ID
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User
    } else {
      return null
    }
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    throw error
  }
}

// Obtener usuario por email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const q = query(collection(db, USERS_COLLECTION), where('email', '==', email))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as User
    } else {
      return null
    }
  } catch (error) {
    console.error('Error al obtener usuario por email:', error)
    throw error
  }
}

// Crear un nuevo usuario
export const createUser = async (user: Omit<User, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, USERS_COLLECTION), {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    // Crear perfil de usuario
    await createUserProfile(docRef.id)
    
    return docRef.id
  } catch (error) {
    console.error('Error al crear usuario:', error)
    throw error
  }
}

// Actualizar un usuario
export const updateUser = async (id: string, user: Partial<User>): Promise<void> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, id)
    await updateDoc(docRef, {
      ...user,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    throw error
  }
}

// Eliminar un usuario
export const deleteUser = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, id)
    await deleteDoc(docRef)
    
    // Eliminar perfil asociado
    await deleteUserProfile(id)
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    throw error
  }
}

// Actualizar último login
export const updateLastLogin = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, id)
    await updateDoc(docRef, {
      lastLogin: serverTimestamp()
    })
  } catch (error) {
    console.error('Error al actualizar último login:', error)
    throw error
  }
}

// Obtener perfil de usuario
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const q = query(collection(db, PROFILES_COLLECTION), where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as UserProfile
    } else {
      return null
    }
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error)
    throw error
  }
}

// Crear perfil de usuario
export const createUserProfile = async (userId: string): Promise<string> => {
  try {
    const profile: Omit<UserProfile, 'id'> = {
      userId,
      preferences: {
        notifications: true,
        newsletter: true
      },
      orders: 0,
      totalSpent: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    const docRef = await addDoc(collection(db, PROFILES_COLLECTION), profile)
    return docRef.id
  } catch (error) {
    console.error('Error al crear perfil de usuario:', error)
    throw error
  }
}

// Actualizar perfil de usuario
export const updateUserProfile = async (userId: string, profile: Partial<UserProfile>): Promise<void> => {
  try {
    const existingProfile = await getUserProfile(userId)
    if (!existingProfile) {
      throw new Error('Perfil de usuario no encontrado')
    }
    
    const docRef = doc(db, PROFILES_COLLECTION, existingProfile.id)
    await updateDoc(docRef, {
      ...profile,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error al actualizar perfil de usuario:', error)
    throw error
  }
}

// Eliminar perfil de usuario
export const deleteUserProfile = async (userId: string): Promise<void> => {
  try {
    const existingProfile = await getUserProfile(userId)
    if (existingProfile) {
      const docRef = doc(db, PROFILES_COLLECTION, existingProfile.id)
      await deleteDoc(docRef)
    }
  } catch (error) {
    console.error('Error al eliminar perfil de usuario:', error)
    throw error
  }
}

// Actualizar estadísticas de usuario (pedidos y gasto total)
export const updateUserStats = async (userId: string, orderAmount: number): Promise<void> => {
  try {
    const existingProfile = await getUserProfile(userId)
    if (!existingProfile) {
      throw new Error('Perfil de usuario no encontrado')
    }
    
    const docRef = doc(db, PROFILES_COLLECTION, existingProfile.id)
    await updateDoc(docRef, {
      orders: existingProfile.orders + 1,
      totalSpent: existingProfile.totalSpent + orderAmount,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error al actualizar estadísticas de usuario:', error)
    throw error
  }
}

// Obtener usuarios administradores
export const getAdminUsers = async (): Promise<User[]> => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION), 
      where('isAdmin', '==', true),
      orderBy('name')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[]
  } catch (error) {
    console.error('Error al obtener usuarios administradores:', error)
    throw error
  }
}
