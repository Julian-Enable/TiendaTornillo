import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User as FirebaseUser 
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { getUserByEmail, createUser, updateLastLogin } from '../services/userService'
import type { User } from '../services/userService'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Escuchar cambios en el estado de autenticación de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log('🔄 Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out')
      
      if (firebaseUser && firebaseUser.email) {
        try {
          console.log('🔍 Buscando usuario en Firestore:', firebaseUser.email)
          // Buscar usuario en Firestore
          const userData = await getUserByEmail(firebaseUser.email)
          if (userData) {
            console.log('✅ Usuario encontrado:', userData)
            setUser(userData)
            // Actualizar último login
            try {
              await updateLastLogin(userData.id)
              console.log('✅ Último login actualizado')
            } catch (error) {
              console.warn('⚠️ No se pudo actualizar último login:', error)
            }
          } else {
            console.warn('⚠️ Usuario no encontrado en Firestore')
            setUser(null)
          }
        } catch (error) {
          console.error('❌ Error al obtener datos del usuario:', error)
          setUser(null)
        }
      } else {
        console.log('👤 Usuario no autenticado')
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (error) {
      console.error('Error en login:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      console.log('🚀 Iniciando registro para:', email)
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log('✅ Usuario creado en Firebase Auth:', userCredential.user.uid)
      
      // Crear usuario en Firestore
      const userData: Omit<User, 'id'> = {
        name,
        email,
        isAdmin: false
      }
      
      console.log('📝 Creando usuario en Firestore...')
      const userId = await createUser(userData)
      console.log('✅ Usuario creado en Firestore con ID:', userId)
      
      return true
    } catch (error: any) {
      console.error('❌ Error en registro:', error)
      console.error('❌ Código de error:', error.code)
      console.error('❌ Mensaje de error:', error.message)
      
      // Si el error es de Firebase Auth, no continuar
      if (error.code && error.code.startsWith('auth/')) {
        console.error('❌ Error de Firebase Auth, no se creará usuario en Firestore')
        return false
      }
      
      // Si el error es de Firestore, intentar limpiar el usuario de Auth
      if (error.code && error.code.startsWith('firestore/')) {
        console.error('❌ Error de Firestore, limpiando usuario de Auth...')
        try {
          if (auth.currentUser) {
            await auth.currentUser.delete()
            console.log('✅ Usuario eliminado de Auth después del error de Firestore')
          }
        } catch (deleteError) {
          console.error('❌ Error al eliminar usuario de Auth:', deleteError)
        }
      }
      
      return false
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true)
      console.log('🔄 Enviando email de reset para:', email)
      
      await sendPasswordResetEmail(auth, email)
      console.log('✅ Email de reset enviado correctamente')
      
      return true
    } catch (error: any) {
      console.error('❌ Error al enviar email de reset:', error)
      console.error('❌ Código de error:', error.code)
      console.error('❌ Mensaje de error:', error.message)
      
      // Manejar errores específicos
      if (error.code === 'auth/user-not-found') {
        console.error('❌ Usuario no encontrado con ese email')
      } else if (error.code === 'auth/invalid-email') {
        console.error('❌ Email inválido')
      } else if (error.code === 'auth/too-many-requests') {
        console.error('❌ Demasiadas solicitudes, intenta más tarde')
      } else {
        console.error('❌ Error desconocido:', error.code)
      }
      
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error en logout:', error)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    loading,
    login,
    register,
    resetPassword,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 