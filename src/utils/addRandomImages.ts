import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'

// Imágenes aleatorias de herramientas y tornillos para prueba
const randomImages = [
  'https://images.unsplash.com/photo-1609205593115-5b958f4d8ba5?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1632513303555-bc7d1f2bc3e3?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1580479810961-7dada8eb86a1?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1609205593115-5b958f4d8ba5?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1609205593115-5b958f4d8ba5?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1609205593115-5b958f4d8ba5?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1632513303555-bc7d1f2bc3e3?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1580479810961-7dada8eb86a1?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1609205593115-5b958f4d8ba5?w=300&h=300&fit=crop'
]

// Función para obtener una imagen aleatoria
const getRandomImage = () => {
  return randomImages[Math.floor(Math.random() * randomImages.length)]
}

// Función para agregar imágenes aleatorias a todos los productos
export const addRandomImagesToProducts = async () => {
  try {
    console.log('🖼️ Iniciando actualización de imágenes de productos...')
    
    // Obtener todos los productos
    const productsRef = collection(db, 'products')
    const snapshot = await getDocs(productsRef)
    
    const updatePromises = snapshot.docs.map(async (productDoc) => {
      const productData = productDoc.data()
      
      // Solo actualizar si el producto no tiene imagen o tiene un emoji/icono
      const hasEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(productData.image || '')
      const isIcon = productData.image && (productData.image.startsWith('🔩') || productData.image.startsWith('⚙️') || productData.image.startsWith('🔧') || productData.image.startsWith('🪚') || productData.image === '🔩' || productData.image === '⚙️' || productData.image === '🔧' || productData.image === '🪚')
      
      if (!productData.image || hasEmoji || isIcon || productData.image.includes('emoji') || productData.image.length < 10) {
        const randomImage = getRandomImage()
        
        console.log(`📸 Actualizando ${productData.name} con imagen: ${randomImage}`)
        
        return updateDoc(doc(db, 'products', productDoc.id), {
          image: randomImage,
          updatedAt: new Date()
        })
      }
      
      return Promise.resolve()
    })
    
    await Promise.all(updatePromises)
    
    console.log('✅ Todas las imágenes han sido actualizadas exitosamente!')
    return {
      success: true,
      message: `Se actualizaron ${updatePromises.length} productos con imágenes aleatorias`
    }
    
  } catch (error) {
    console.error('❌ Error actualizando imágenes:', error)
    throw error
  }
}

export default addRandomImagesToProducts
