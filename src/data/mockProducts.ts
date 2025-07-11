import type { Product } from './products'

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Tornillo Allen M6x20',
    priceUnit: 250,
    priceBulk: 220,
    category: 'Tornillos',
    description: 'Tornillo de acero inoxidable, cabeza Allen, tamaño M6x20mm.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80',
    stock: 120,
    specifications: {
      size: 'M6x20',
      material: 'Acero inoxidable',
      type: 'Allen'
    }
  },
  {
    id: '2',
    name: 'Tuerca Hexagonal M6',
    priceUnit: 120,
    priceBulk: 100,
    category: 'Tuercas',
    description: 'Tuerca hexagonal estándar para tornillos M6.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80',
    stock: 200,
    specifications: {
      size: 'M6',
      material: 'Acero galvanizado'
    }
  },
  {
    id: '3',
    name: 'Destornillador Phillips',
    priceUnit: 5900,
    priceBulk: 5200,
    category: 'Herramientas',
    description: 'Destornillador punta Phillips, mango ergonómico.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=80&q=80',
    stock: 35,
    specifications: {
      material: 'Acero templado',
      type: 'Phillips'
    }
  },
  {
    id: '4',
    name: 'Arandela Plana M6',
    priceUnit: 50,
    priceBulk: 40,
    category: 'Arandelas',
    description: 'Arandela plana para tornillo M6, acero zincado.',
    stock: 500,
    specifications: {
      size: 'M6',
      material: 'Acero zincado'
    }
  },
  {
    id: '5',
    name: 'Juego de Llaves Allen',
    priceUnit: 12000,
    priceBulk: 10500,
    category: 'Herramientas',
    description: 'Set de 9 llaves Allen de diferentes tamaños.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80',
    stock: 15,
    specifications: {
      material: 'Acero al cromo-vanadio'
    }
  },
  {
    id: '6',
    name: 'Tornillo Phillips M4x16',
    priceUnit: 180,
    priceBulk: 150,
    category: 'Tornillos',
    description: 'Tornillo cabeza Phillips, acero niquelado, M4x16mm.',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=80&q=80',
    stock: 80,
    specifications: {
      size: 'M4x16',
      material: 'Acero niquelado',
      type: 'Phillips'
    }
  },
  {
    id: '7',
    name: 'Tuerca Mariposa M8',
    priceUnit: 210,
    priceBulk: 180,
    category: 'Tuercas',
    description: 'Tuerca tipo mariposa para ajustes manuales, M8.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80',
    stock: 60,
    specifications: {
      size: 'M8',
      material: 'Acero inoxidable'
    }
  },
  {
    id: '8',
    name: 'Arandela Grower M6',
    priceUnit: 70,
    priceBulk: 60,
    category: 'Arandelas',
    description: 'Arandela de presión tipo grower para tornillo M6.',
    stock: 300,
    specifications: {
      size: 'M6',
      material: 'Acero templado'
    }
  },
  {
    id: '9',
    name: 'Martillo Carpintero',
    priceUnit: 14500,
    priceBulk: 13000,
    category: 'Herramientas',
    description: 'Martillo de carpintero con mango de fibra y cabeza de acero.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80',
    stock: 22,
    specifications: {
      material: 'Acero y fibra',
      type: 'Carpintero'
    }
  },
  {
    id: '10',
    name: 'Cinta Métrica 5m',
    priceUnit: 6800,
    priceBulk: 6000,
    category: 'Accesorios',
    description: 'Cinta métrica retráctil de 5 metros, carcasa plástica.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=80&q=80',
    stock: 40,
    specifications: {
      size: '5m',
      material: 'Plástico y metal'
    }
  },
  {
    id: '11',
    name: 'Tornillo Rosca Chapa 3.5x25',
    priceUnit: 90,
    priceBulk: 75,
    category: 'Tornillos',
    description: 'Tornillo para chapa, rosca gruesa, 3.5x25mm.',
    stock: 150,
    specifications: {
      size: '3.5x25',
      material: 'Acero zincado'
    }
  },
  {
    id: '12',
    name: 'Llave Inglesa 8"',
    priceUnit: 11500,
    priceBulk: 10000,
    category: 'Herramientas',
    description: 'Llave ajustable de 8 pulgadas, acero forjado.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80',
    stock: 18,
    specifications: {
      size: '8"',
      material: 'Acero forjado'
    }
  },
  {
    id: '13',
    name: 'Caja Organizadora',
    priceUnit: 8900,
    priceBulk: 7800,
    category: 'Accesorios',
    description: 'Caja plástica con divisiones para tornillos y tuercas.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=80&q=80',
    stock: 25,
    specifications: {
      material: 'Plástico resistente'
    }
  },
  {
    id: '14',
    name: 'Tornillo Allen M8x30',
    priceUnit: 320,
    priceBulk: 270,
    category: 'Tornillos',
    description: 'Tornillo Allen de alta resistencia, M8x30mm.',
    stock: 90,
    specifications: {
      size: 'M8x30',
      material: 'Acero aleado',
      type: 'Allen'
    }
  },
  {
    id: '15',
    name: 'Tuerca Ciega M10',
    priceUnit: 270,
    priceBulk: 230,
    category: 'Tuercas',
    description: 'Tuerca ciega para acabados estéticos, M10.',
    stock: 70,
    specifications: {
      size: 'M10',
      material: 'Acero cromado'
    }
  }
] 