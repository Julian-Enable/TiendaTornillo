import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../config/firebase'

// Subir imagen a Firebase Storage
export const uploadImage = async (file: File, productId: string): Promise<string> => {
  try {
    console.log('🚀 Iniciando subida de imagen a Firebase Storage...')
    console.log('📁 Archivo:', file.name, '(', file.size, 'bytes)')
    console.log('🆔 Product ID:', productId)
    
    // Crear nombre único para la imagen
    const timestamp = Date.now()
    const fileName = `${productId}_${timestamp}_${file.name}`
    console.log('📝 Nombre del archivo en Storage:', fileName)
    
    const storageRef = ref(storage, `product-images/${fileName}`)
    console.log('📍 Referencia de Storage creada')
    
    // Subir el archivo
    console.log('⬆️ Iniciando uploadBytes...')
    const snapshot = await uploadBytes(storageRef, file)
    console.log('✅ Archivo subido exitosamente')
    console.log('📊 Bytes transferidos:', snapshot.bytesTransferred)
    
    // Obtener la URL de descarga
    console.log('🔗 Obteniendo URL de descarga...')
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    console.log('✅ Imagen subida exitosamente:', downloadURL)
    return downloadURL
  } catch (error) {
    console.error('❌ Error al subir imagen:', error)
    console.error('❌ Tipo de error:', typeof error)
    console.error('❌ Mensaje:', error instanceof Error ? error.message : 'Error desconocido')
    console.error('❌ Stack:', error instanceof Error ? error.stack : 'No disponible')
    throw new Error(`Error al subir la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`)
  }
}

// Eliminar imagen de Firebase Storage
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    if (!imageUrl || imageUrl.startsWith('blob:') || imageUrl.startsWith('http')) {
      console.log('⚠️ No se puede eliminar URL externa:', imageUrl)
      return // No eliminar URLs temporales o externas
    }
    
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
    console.log('✅ Imagen eliminada exitosamente')
  } catch (error) {
    console.error('❌ Error al eliminar imagen:', error)
    // No lanzar error para no interrumpir el flujo principal
  }
}

// Validar archivo de imagen
export const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Solo se permiten archivos JPG, PNG, WebP o SVG')
  }
  
  if (file.size > maxSize) {
    throw new Error('El archivo no puede ser mayor a 5MB')
  }
  
  return true
}
