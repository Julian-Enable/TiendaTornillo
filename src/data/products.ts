export interface Product {
  id: string
  name: string
  priceUnit: number // Precio por unidad
  priceBulk: number // Precio al por mayor (mínimo 50 unidades)
  category: string
  description: string
  image?: string
  stock: number
  specifications?: {
    size?: string
    material?: string
    type?: string
  }
}

// export const products: Product[] = [ ... ]; // Eliminado para forzar uso de Firestore

export const categories = [
  'Todos',
  'Tornillos',
  'Tuercas',
  'Arandelas',
  'Herramientas',
  'Accesorios'
]; 