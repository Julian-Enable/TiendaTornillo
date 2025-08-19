// Función para resetear la configuración de Firebase (útil para desarrollo)
export const resetFirebaseSetup = () => {
  localStorage.removeItem('firebaseSetupComplete')
  console.log('✅ Configuración de Firebase reseteada. Recarga la página para volver a configurar.')
}

// Función para verificar si la configuración está completa
export const isFirebaseSetupComplete = (): boolean => {
  return localStorage.getItem('firebaseSetupComplete') === 'true'
}

// Función para marcar la configuración como completa
export const markFirebaseSetupComplete = () => {
  localStorage.setItem('firebaseSetupComplete', 'true')
}
