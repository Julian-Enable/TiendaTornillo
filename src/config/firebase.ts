import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// Configuración de Firebase - Reemplaza con tus credenciales reales
const firebaseConfig = {
  apiKey: "AIzaSyDHmbIHvxC6GWCajLVvUjh40umlN1Nua08",
  authDomain: "tienda-tornillo.firebaseapp.com",
  projectId: "tienda-tornillo",
  storageBucket: "tienda-tornillo.firebasestorage.app",
  messagingSenderId: "2514094483",
  appId: "1:2514094483:web:06cf4ecdb9d7cd53354066"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar servicios
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

export default app
