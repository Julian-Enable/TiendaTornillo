import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'

// Función para detectar si una cadena contiene emojis
const containsEmoji = (text: string): boolean => {
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{25A0}-\u{25FF}]|[\u{2100}-\u{214F}]/u
  return emojiRegex.test(text)
}

// Función para detectar iconos específicos comunes
const isCommonIcon = (text: string): boolean => {
  const commonIcons = ['🔩', '⚙️', '🔧', '🪚', '🔨', '⚡', '🏗️', '🔩️', '⚙', '🛠️', '🗜️']
  return commonIcons.some(icon => text.includes(icon))
}

// Función para analizar todas las imágenes de productos
export const analyzeProductImages = async () => {
  try {
    console.log('🔍 Analizando imágenes de productos...')
    
    const productsRef = collection(db, 'products')
    const snapshot = await getDocs(productsRef)
    
    const analysis = {
      total: snapshot.docs.length,
      withValidImages: 0,
      withEmojis: 0,
      withoutImages: 0,
      emojiProducts: [] as Array<{id: string, name: string, image: string}>,
      noImageProducts: [] as Array<{id: string, name: string}>
    }
    
    snapshot.docs.forEach((productDoc) => {
      const productData = productDoc.data()
      const { id } = productDoc
      const { name, image } = productData
      
      if (!image || image.trim() === '') {
        analysis.withoutImages++
        analysis.noImageProducts.push({ id, name })
        console.log(`❌ Sin imagen: ${name}`)
      } else if (containsEmoji(image) || isCommonIcon(image) || image.length < 10) {
        analysis.withEmojis++
        analysis.emojiProducts.push({ id, name, image })
        console.log(`🔧 Con emoji/icono: ${name} - "${image}"`)
      } else {
        analysis.withValidImages++
        console.log(`✅ Imagen válida: ${name}`)
      }
    })
    
    console.log('\n📊 RESUMEN DEL ANÁLISIS:')
    console.log(`Total de productos: ${analysis.total}`)
    console.log(`Con imágenes válidas: ${analysis.withValidImages}`)
    console.log(`Con emojis/iconos: ${analysis.withEmojis}`)
    console.log(`Sin imágenes: ${analysis.withoutImages}`)
    
    return analysis
    
  } catch (error) {
    console.error('❌ Error analizando imágenes:', error)
    throw error
  }
}

// Imágenes específicas para diferentes tipos de productos
const getImageByCategory = (productName: string, category: string) => {
  const images = {
    tornillos: [
      'https://images.unsplash.com/photo-1609205593115-5b958f4d8ba5?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1632513303555-bc7d1f2bc3e3?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=300&h=300&fit=crop'
    ],
    herramientas: [
      'https://images.unsplash.com/photo-1580479810961-7dada8eb86a1?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=300&fit=crop'
    ],
    tuercas: [
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop'
    ]
  }
  
  // Determinar categoría basada en el nombre del producto
  const name = productName.toLowerCase()
  if (name.includes('tornillo') || name.includes('allen') || name.includes('phillips')) {
    return images.tornillos[Math.floor(Math.random() * images.tornillos.length)]
  } else if (name.includes('martillo') || name.includes('destornillador') || name.includes('llave')) {
    return images.herramientas[Math.floor(Math.random() * images.herramientas.length)]
  } else if (name.includes('tuerca') || name.includes('arandela')) {
    return images.tuercas[Math.floor(Math.random() * images.tuercas.length)]
  }
  
  // Por defecto, usar imágenes de tornillos
  return images.tornillos[Math.floor(Math.random() * images.tornillos.length)]
}

// Función para actualizar solo productos con emojis/iconos
export const fixEmojiProducts = async () => {
  try {
    console.log('🔧 Corrigiendo productos con emojis/iconos...')
    
    const analysis = await analyzeProductImages()
    
    if (analysis.emojiProducts.length === 0 && analysis.noImageProducts.length === 0) {
      console.log('✅ Todos los productos ya tienen imágenes válidas!')
      return { success: true, message: 'Todos los productos ya tienen imágenes válidas' }
    }
    
    const updatePromises = []
    
    // Actualizar productos con emojis
    for (const product of analysis.emojiProducts) {
      const newImage = getImageByCategory(product.name, '')
      console.log(`🔄 Actualizando "${product.name}" (${product.image}) → ${newImage}`)
      
      updatePromises.push(
        updateDoc(doc(db, 'products', product.id), {
          image: newImage,
          updatedAt: new Date()
        })
      )
    }
    
    // Actualizar productos sin imagen
    for (const product of analysis.noImageProducts) {
      const newImage = getImageByCategory(product.name, '')
      console.log(`📸 Agregando imagen a "${product.name}" → ${newImage}`)
      
      updatePromises.push(
        updateDoc(doc(db, 'products', product.id), {
          image: newImage,
          updatedAt: new Date()
        })
      )
    }
    
    await Promise.all(updatePromises)
    
    const totalUpdated = analysis.emojiProducts.length + analysis.noImageProducts.length
    console.log(`✅ Se actualizaron ${totalUpdated} productos exitosamente!`)
    
    return {
      success: true,
      message: `Se actualizaron ${totalUpdated} productos (${analysis.emojiProducts.length} con emojis, ${analysis.noImageProducts.length} sin imagen)`
    }
    
  } catch (error) {
    console.error('❌ Error corrigiendo productos:', error)
    throw error
  }
}

export default fixEmojiProducts
