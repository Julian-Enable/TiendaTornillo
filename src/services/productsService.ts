import type { Product } from '../data/products';

const PRODUCTS_TABLE = 'products';

export async function getProducts(): Promise<Product[]> {
  // Aquí irá la nueva lógica de la base de datos elegida
  return [];
}

// Supabase no tiene onSnapshot por defecto, se puede implementar con suscripciones en tiempo real si se habilita
export function onProductsSnapshot(callback: (products: Product[]) => void) {
  // Para realtime, se debe habilitar la opción en la tabla y usar supabase.realtime
  // Por ahora, esta función queda como stub
  // callback([])
}

export async function getProductById(id: string): Promise<Product | null> {
  // Aquí irá la nueva lógica de Supabase
  return null;
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  // Aquí irá la nueva lógica de Supabase
  return '';
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<void> {
  // Aquí irá la nueva lógica de Supabase
}

export async function deleteProduct(id: string): Promise<void> {
  // Aquí irá la nueva lógica de Supabase
}

export async function setProduct(id: string, product: Omit<Product, 'id'>): Promise<void> {
  // Aquí irá la nueva lógica de Supabase
} 