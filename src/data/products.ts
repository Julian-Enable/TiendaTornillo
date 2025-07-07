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

export const products: Product[] = [
  // TORNILLOS
  {
    id: '1',
    name: 'Tornillo Phillips Cabeza Plana 3/8"',
    price: 0.25,
    category: 'Tornillos',
    description: 'Tornillo Phillips de cabeza plana, ideal para madera y materiales blandos.',
    stock: 500,
    specifications: {
      size: '3/8"',
      material: 'Acero',
      type: 'Phillips'
    }
  },
  {
    id: '2',
    name: 'Tornillo Hexagonal 1/2"',
    price: 0.35,
    category: 'Tornillos',
    description: 'Tornillo hexagonal de alta resistencia para aplicaciones industriales.',
    stock: 300,
    specifications: {
      size: '1/2"',
      material: 'Acero inoxidable',
      type: 'Hexagonal'
    }
  },
  {
    id: '3',
    name: 'Tornillo Autorroscante 1"',
    price: 0.45,
    category: 'Tornillos',
    description: 'Tornillo autorroscante para metal y plástico.',
    stock: 400,
    specifications: {
      size: '1"',
      material: 'Acero galvanizado',
      type: 'Autorroscante'
    }
  },
  {
    id: '4',
    name: 'Tornillo Allen 5/16"',
    price: 0.55,
    category: 'Tornillos',
    description: 'Tornillo Allen de cabeza cilíndrica para aplicaciones precisas.',
    stock: 250,
    specifications: {
      size: '5/16"',
      material: 'Acero',
      type: 'Allen'
    }
  },
  {
    id: '5',
    name: 'Tornillo de Madera 2"',
    price: 0.30,
    category: 'Tornillos',
    description: 'Tornillo especializado para madera con rosca gruesa.',
    stock: 600,
    specifications: {
      size: '2"',
      material: 'Acero',
      type: 'Madera'
    }
  },
  {
    id: '6',
    name: 'Tornillo Phillips Cabeza Redonda 1/4"',
    price: 0.20,
    category: 'Tornillos',
    description: 'Tornillo Phillips de cabeza redonda para acabados estéticos.',
    stock: 350,
    specifications: {
      size: '1/4"',
      material: 'Acero',
      type: 'Phillips'
    }
  },
  {
    id: '7',
    name: 'Tornillo de Máquina 3/8"',
    price: 0.40,
    category: 'Tornillos',
    description: 'Tornillo de máquina para uniones metálicas.',
    stock: 200,
    specifications: {
      size: '3/8"',
      material: 'Acero inoxidable',
      type: 'Máquina'
    }
  },
  {
    id: '8',
    name: 'Tornillo de Anclaje 1/2"',
    price: 0.75,
    category: 'Tornillos',
    description: 'Tornillo de anclaje para concreto y mampostería.',
    stock: 150,
    specifications: {
      size: '1/2"',
      material: 'Acero',
      type: 'Anclaje'
    }
  },

  // TUERCAS
  {
    id: '9',
    name: 'Tuerca Hexagonal 3/8"',
    price: 0.15,
    category: 'Tuercas',
    description: 'Tuerca hexagonal estándar para tornillos de 3/8".',
    stock: 800,
    specifications: {
      size: '3/8"',
      material: 'Acero',
      type: 'Hexagonal'
    }
  },
  {
    id: '10',
    name: 'Tuerca Mariposa 1/4"',
    price: 0.25,
    category: 'Tuercas',
    description: 'Tuerca mariposa para ajuste manual sin herramientas.',
    stock: 300,
    specifications: {
      size: '1/4"',
      material: 'Acero',
      type: 'Mariposa'
    }
  },
  {
    id: '11',
    name: 'Tuerca de Seguridad 1/2"',
    price: 0.35,
    category: 'Tuercas',
    description: 'Tuerca de seguridad con arandela integrada.',
    stock: 200,
    specifications: {
      size: '1/2"',
      material: 'Acero',
      type: 'Seguridad'
    }
  },
  {
    id: '12',
    name: 'Tuerca Cuadrada 3/8"',
    price: 0.20,
    category: 'Tuercas',
    description: 'Tuerca cuadrada para aplicaciones especiales.',
    stock: 150,
    specifications: {
      size: '3/8"',
      material: 'Acero',
      type: 'Cuadrada'
    }
  },

  // ARANDELAS
  {
    id: '13',
    name: 'Arandela Plana 3/8"',
    price: 0.08,
    category: 'Arandelas',
    description: 'Arandela plana estándar para distribuir la carga.',
    stock: 1200,
    specifications: {
      size: '3/8"',
      material: 'Acero',
      type: 'Plana'
    }
  },
  {
    id: '14',
    name: 'Arandela de Presión 1/4"',
    price: 0.12,
    category: 'Arandelas',
    description: 'Arandela de presión para evitar aflojamiento.',
    stock: 800,
    specifications: {
      size: '1/4"',
      material: 'Acero',
      type: 'Presión'
    }
  },
  {
    id: '15',
    name: 'Arandela de Goma 1/2"',
    price: 0.18,
    category: 'Arandelas',
    description: 'Arandela de goma para sellado y amortiguación.',
    stock: 400,
    specifications: {
      size: '1/2"',
      material: 'Goma',
      type: 'Goma'
    }
  },
  {
    id: '16',
    name: 'Arandela Cóncava 3/8"',
    price: 0.15,
    category: 'Arandelas',
    description: 'Arandela cóncava para aplicaciones de alta tensión.',
    stock: 300,
    specifications: {
      size: '3/8"',
      material: 'Acero',
      type: 'Cóncava'
    }
  },

  // HERRAMIENTAS
  {
    id: '17',
    name: 'Destornillador Phillips #2',
    price: 8.50,
    category: 'Herramientas',
    description: 'Destornillador Phillips profesional con mango ergonómico.',
    stock: 50,
    specifications: {
      size: '#2',
      material: 'Acero cromado',
      type: 'Phillips'
    }
  },
  {
    id: '18',
    name: 'Destornillador Plano 1/4"',
    price: 7.80,
    category: 'Herramientas',
    description: 'Destornillador plano de alta calidad para trabajos precisos.',
    stock: 45,
    specifications: {
      size: '1/4"',
      material: 'Acero cromado',
      type: 'Plano'
    }
  },
  {
    id: '19',
    name: 'Taladro Eléctrico 1/2"',
    price: 89.99,
    category: 'Herramientas',
    description: 'Taladro eléctrico profesional con velocidad variable.',
    stock: 15,
    specifications: {
      size: '1/2"',
      material: 'Metal y plástico',
      type: 'Eléctrico'
    }
  },
  {
    id: '20',
    name: 'Llave Allen Set 9 Piezas',
    price: 12.99,
    category: 'Herramientas',
    description: 'Set completo de llaves Allen en tamaños estándar.',
    stock: 30,
    specifications: {
      size: '1.5mm - 10mm',
      material: 'Acero',
      type: 'Allen'
    }
  },
  {
    id: '21',
    name: 'Martillo de Carpintero 16oz',
    price: 15.50,
    category: 'Herramientas',
    description: 'Martillo de carpintero con mango de fibra de vidrio.',
    stock: 25,
    specifications: {
      size: '16oz',
      material: 'Acero y fibra',
      type: 'Carpintero'
    }
  },
  {
    id: '22',
    name: 'Sierra Circular 7-1/4"',
    price: 129.99,
    category: 'Herramientas',
    description: 'Sierra circular profesional para cortes precisos.',
    stock: 10,
    specifications: {
      size: '7-1/4"',
      material: 'Metal y plástico',
      type: 'Circular'
    }
  },
  {
    id: '23',
    name: 'Nivel de Burbuja 24"',
    price: 18.75,
    category: 'Herramientas',
    description: 'Nivel de burbuja profesional para trabajos de precisión.',
    stock: 40,
    specifications: {
      size: '24"',
      material: 'Aluminio',
      type: 'Burbuja'
    }
  },
  {
    id: '24',
    name: 'Cinta Métrica 25ft',
    price: 9.99,
    category: 'Herramientas',
    description: 'Cinta métrica retráctil con bloqueo automático.',
    stock: 60,
    specifications: {
      size: '25ft',
      material: 'Acero y plástico',
      type: 'Métrica'
    }
  },

  // ACCESORIOS
  {
    id: '25',
    name: 'Broca para Madera 1/2"',
    price: 3.25,
    category: 'Accesorios',
    description: 'Broca especializada para perforar madera.',
    stock: 100,
    specifications: {
      size: '1/2"',
      material: 'Acero rápido',
      type: 'Madera'
    }
  },
  {
    id: '26',
    name: 'Broca para Concreto 3/8"',
    price: 4.50,
    category: 'Accesorios',
    description: 'Broca con punta de carburo para concreto.',
    stock: 75,
    specifications: {
      size: '3/8"',
      material: 'Carburo',
      type: 'Concreto'
    }
  },
  {
    id: '27',
    name: 'Cable Eléctrico 12AWG 100ft',
    price: 45.99,
    category: 'Accesorios',
    description: 'Cable eléctrico de cobre para instalaciones.',
    stock: 20,
    specifications: {
      size: '12AWG',
      material: 'Cobre',
      type: 'Eléctrico'
    }
  },
  {
    id: '28',
    name: 'Caja de Conexión 4x4"',
    price: 2.99,
    category: 'Accesorios',
    description: 'Caja de conexión para instalaciones eléctricas.',
    stock: 80,
    specifications: {
      size: '4x4"',
      material: 'Plástico',
      type: 'Conexión'
    }
  },
  {
    id: '29',
    name: 'Interruptor Simple',
    price: 3.75,
    category: 'Accesorios',
    description: 'Interruptor de pared simple para 15A.',
    stock: 50,
    specifications: {
      size: '15A',
      material: 'Plástico y metal',
      type: 'Interruptor'
    }
  },
  {
    id: '30',
    name: 'Enchufe Duplex',
    price: 4.25,
    category: 'Accesorios',
    description: 'Enchufe duplex con conexión a tierra.',
    stock: 45,
    specifications: {
      size: '15A',
      material: 'Plástico y metal',
      type: 'Enchufe'
    }
  }
]

export const categories = [
  'Todos',
  'Tornillos',
  'Tuercas',
  'Arandelas',
  'Herramientas',
  'Accesorios'
] 