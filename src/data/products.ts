export interface Product {
  id: string
  name: string
  price: number
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