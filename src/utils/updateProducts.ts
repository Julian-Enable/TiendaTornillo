import { getProducts, updateProduct } from '../services/productService'

// Precios reales en COP para productos de tornillería
const updatedProducts = [
  {
    id: '1',
    name: 'Tornillo Allen M6x20',
    priceUnit: 850,
    priceBulk: 720,
    stock: 300
  },
  {
    id: '2',
    name: 'Tuerca Hexagonal M6',
    priceUnit: 450,
    priceBulk: 380,
    stock: 300
  },
  {
    id: '3',
    name: 'Destornillador Phillips',
    priceUnit: 18500,
    priceBulk: 16500,
    stock: 300
  },
  {
    id: '4',
    name: 'Arandela Plana M6',
    priceUnit: 180,
    priceBulk: 150,
    stock: 300
  },
  {
    id: '5',
    name: 'Juego de Llaves Allen',
    priceUnit: 28500,
    priceBulk: 25000,
    stock: 300
  },
  {
    id: '6',
    name: 'Tornillo Phillips M4x16',
    priceUnit: 650,
    priceBulk: 550,
    stock: 300
  },
  {
    id: '7',
    name: 'Tuerca Mariposa M8',
    priceUnit: 750,
    priceBulk: 650,
    stock: 300
  },
  {
    id: '8',
    name: 'Arandela Grower M6',
    priceUnit: 250,
    priceBulk: 210,
    stock: 300
  },
  {
    id: '9',
    name: 'Martillo Carpintero',
    priceUnit: 42500,
    priceBulk: 38000,
    stock: 300
  },
  {
    id: '10',
    name: 'Cinta Métrica 5m',
    priceUnit: 18500,
    priceBulk: 16500,
    stock: 300
  },
  {
    id: '11',
    name: 'Tornillo Rosca Chapa 3.5x25',
    priceUnit: 350,
    priceBulk: 300,
    stock: 300
  },
  {
    id: '12',
    name: 'Llave Inglesa 8"',
    priceUnit: 32500,
    priceBulk: 29000,
    stock: 300
  },
  {
    id: '13',
    name: 'Caja Organizadora',
    priceUnit: 22500,
    priceBulk: 20000,
    stock: 300
  },
  {
    id: '14',
    name: 'Tornillo Allen M8x30',
    priceUnit: 1200,
    priceBulk: 1000,
    stock: 300
  },
  {
    id: '15',
    name: 'Tuerca Ciega M10',
    priceUnit: 950,
    priceBulk: 800,
    stock: 300
  }
]

export const updateAllProducts = async () => {
  try {
    console.log('=== INICIANDO ACTUALIZACIÓN DE PRODUCTOS ===')
    
    // Obtener productos actuales
    const currentProducts = await getProducts()
    console.log(`Productos encontrados: ${currentProducts.length}`)
    
    // Actualizar cada producto
    for (const updateData of updatedProducts) {
      const product = currentProducts.find(p => p.id === updateData.id)
      if (product) {
        await updateProduct(updateData.id, {
          priceUnit: updateData.priceUnit,
          priceBulk: updateData.priceBulk,
          stock: updateData.stock
        })
        console.log(`✅ Actualizado: ${updateData.name}`)
        console.log(`   Precio unitario: $${updateData.priceUnit.toLocaleString('es-CO')}`)
        console.log(`   Precio mayorista: $${updateData.priceBulk.toLocaleString('es-CO')}`)
        console.log(`   Stock: ${updateData.stock}`)
      } else {
        console.log(`❌ No encontrado: ${updateData.name}`)
      }
    }
    
    console.log('=== ACTUALIZACIÓN COMPLETADA ===')
    return true
  } catch (error) {
    console.error('Error al actualizar productos:', error)
    throw error
  }
}
