import { useState, useEffect } from 'react'
import { categories } from '../data/products'
import type { Product } from '../data/products'
import { getProducts, createProduct, updateProduct, deleteProduct, toggleFeaturedProduct } from '../services/productService'
import { getUsers } from '../services/userService'
import { uploadImage, deleteImage, validateImageFile } from '../services/imageService'
import type { User } from '../services/userService'
import UpdateProducts from '../components/UpdateProducts'
import TestQuotations from '../components/TestQuotations'
import TestDeleteQuotations from '../components/TestDeleteQuotations'
import AddRandomImages from '../components/AddRandomImages'
import ImageUploadProgress from '../components/ImageUploadProgress'
import { resetFirebaseSetup } from '../utils/firebaseReset'

interface Props {
  onLogout: () => void
  setToast: (toast: { show: boolean, message: string }) => void
  onGoHome?: () => void
}

type Pedido = {
  id: string
  usuario: string
  productos: { nombre: string; cantidad: number; precio: number }[]
  fecha: string
  total: number
}

const mockPedidos: Pedido[] = [
  {
    id: '1',
    usuario: 'Usuario Demo',
    productos: [
      { nombre: 'Tornillo Allen M6x20', cantidad: 10, precio: 250 },
      { nombre: 'Tuerca Hexagonal M6', cantidad: 5, precio: 120 }
    ],
    fecha: '2024-05-01',
    total: 3700
  },
  {
    id: '2',
    usuario: 'Administrador',
    productos: [
      { nombre: 'Martillo Carpintero', cantidad: 1, precio: 14500 }
    ],
    fecha: '2024-05-02',
    total: 14500
  }
]

function emptyProduct(): Product {
  return {
    id: '',
    name: '',
    priceUnit: 0,
    priceBulk: 0,
    category: categories[1],
    description: '',
    stock: 0,
    specifications: { size: '', material: '', type: '' }
  }
}

function emptyUser(): User {
  return {
    id: '',
    name: '',
    email: '',
    isAdmin: false
  }
}

function AdminPanel({ onLogout, setToast, onGoHome }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<Product>(emptyProduct())
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userForm, setUserForm] = useState<User>(emptyUser())
  const [showUserForm, setShowUserForm] = useState(false)
  const [pedidos] = useState<Pedido[]>(mockPedidos)
  const [detallePedido, setDetallePedido] = useState<Pedido | null>(null)
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [categoriesState, setCategoriesState] = useState<string[]>([
    'Tornillos',
    'Tuercas',
    'Arandelas',
    'Herramientas',
    'Accesorios'
  ])
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [categoryInput, setCategoryInput] = useState('')
  const [showCategoryForm, setShowCategoryForm] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [productsData, usersData] = await Promise.all([
          getProducts(),
          getUsers()
        ])
        setProducts(productsData)
        setUsers(usersData)
      } catch (error) {
        console.error('Error al cargar datos:', error)
        setToast({ show: true, message: 'Error al cargar datos' })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [setToast])

  const handleEdit = (product: Product) => {
    setEditing(product)
    setForm(product)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    setErrorMsg('')
    setSuccessMsg('')
    try {
      // Buscar el producto para obtener su imagen
      const productToDelete = products.find(p => p.id === id)
      
      // Eliminar el producto de la base de datos
      await deleteProduct(id)
      
      // Si el producto tenía una imagen, eliminarla de Firebase Storage
      if (productToDelete?.image) {
        try {
          await deleteImage(productToDelete.image)
          console.log('✅ Imagen del producto eliminada')
        } catch (error) {
          console.warn('⚠️ No se pudo eliminar la imagen del producto:', error)
        }
      }
      
      setProducts(products.filter(p => p.id !== id))
      setToast({ show: true, message: 'Producto eliminado correctamente' })
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      setToast({ show: true, message: 'Error al eliminar producto' })
    }
  }

  const handleToggleFeatured = async (id: string, destacado: boolean) => {
    try {
      await toggleFeaturedProduct(id, destacado)
      setProducts(products.map(p => p.id === id ? { ...p, destacado } : p))
      setToast({ 
        show: true, 
        message: destacado ? 'Producto marcado como destacado' : 'Producto removido de destacados'
      })
    } catch (error) {
      console.error('Error al actualizar producto destacado:', error)
      setToast({ show: true, message: 'Error al actualizar producto destacado' })
    }
  }

  const handleAdd = () => {
    setEditing(null)
    setForm(emptyProduct())
    setShowForm(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith('spec_')) {
      setForm({ ...form, specifications: { ...form.specifications, [name.replace('spec_', '')]: value } })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log('🖼️ Iniciando proceso de subida de imagen...')
    console.log('📁 Archivo seleccionado:', file)
    
    if (file) {
      try {
        console.log('🔍 Validando archivo...')
        console.log('   - Nombre:', file.name)
        console.log('   - Tamaño:', file.size, 'bytes')
        console.log('   - Tipo:', file.type)
        
        // Validar el archivo
        validateImageFile(file)
        console.log('✅ Archivo validado correctamente')
        
        // Mostrar preview temporal
        const tempUrl = URL.createObjectURL(file)
        setImagePreview(tempUrl)
        console.log('🖼️ Preview temporal creado:', tempUrl)
        
        // Mostrar progreso de carga solo para archivos grandes
        const isLargeFile = file.size > 1024 * 1024 // Más de 1MB
        if (isLargeFile) {
          setIsImageUploading(true)
          setUploadProgress(0)
          console.log('⏳ Archivo grande detectado, mostrando progreso...')
        }
        
        // Si estamos editando un producto existente, usar su ID
        // Si es un producto nuevo, generar un ID temporal
        const productId = editing?.id || `temp_${Date.now()}`
        console.log('🆔 ID del producto para la imagen:', productId)
        
        // Subir imagen a Firebase Storage
        console.log('☁️ Iniciando subida a Firebase Storage...')
        const imageUrl = await uploadImage(file, productId)
        console.log('✅ Imagen subida exitosamente:', imageUrl)
        
        // Ocultar progreso rápidamente
        if (isLargeFile) {
          setUploadProgress(100)
          setTimeout(() => {
            setIsImageUploading(false)
            setUploadProgress(0)
          }, 300)
        }
        
        // Actualizar el formulario con la URL permanente
        setForm({ ...form, image: imageUrl })
        setImagePreview(imageUrl)
        
        console.log('✅ Imagen procesada y guardada:', imageUrl)
        setToast({ show: true, message: 'Imagen subida exitosamente' })
      } catch (error) {
        console.error('❌ Error al procesar imagen:', error)
        console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No disponible')
        setToast({ show: true, message: `Error al procesar imagen: ${error instanceof Error ? error.message : 'Error desconocido'}` })
        
        // Limpiar estado en caso de error
        setIsImageUploading(false)
        setUploadProgress(0)
        setImagePreview(undefined)
        setForm({ ...form, image: undefined })
      }
    } else {
      console.log('⚠️ No se seleccionó ningún archivo')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setSubmitting(true)
    try {
      if (editing) {
        // Si estamos editando y hay una imagen nueva, eliminar la imagen anterior
        if (form.image && form.image !== editing.image && editing.image) {
          try {
            await deleteImage(editing.image)
            console.log('✅ Imagen anterior eliminada')
          } catch (error) {
            console.warn('⚠️ No se pudo eliminar la imagen anterior:', error)
          }
        }
        
        await updateProduct(editing.id, form)
        setProducts(products.map(p => p.id === editing.id ? { ...form, id: editing.id } : p))
        setToast({ show: true, message: 'Producto actualizado correctamente' })
      } else {
        const { id, ...productData } = form
        const newProductId = await createProduct(productData)
        const newProduct = { ...form, id: newProductId }
        setProducts([...products, newProduct])
        setToast({ show: true, message: 'Producto agregado correctamente' })
      }
      setShowForm(false)
      setEditing(null)
      setForm(emptyProduct())
      setImagePreview(undefined)
    } catch (err) {
      setErrorMsg('Error al guardar el producto')
      console.error('Error al guardar producto:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setUserForm(user)
    setShowUserForm(true)
  }
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
    setToast({ show: true, message: 'Usuario eliminado correctamente' })
  }
  const handleAddUser = () => {
    setEditingUser(null)
    setUserForm(emptyUser())
    setShowUserForm(true)
  }
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setUserForm({ ...userForm, [name]: type === 'checkbox' ? checked : value })
  }
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...userForm, id: editingUser.id } : u))
      setToast({ show: true, message: 'Usuario actualizado correctamente' })
    } else {
      setUsers([...users, { ...userForm, id: (Math.max(0, ...users.map(u => parseInt(u.id))) + 1).toString() }])
      setToast({ show: true, message: 'Usuario agregado correctamente' })
    }
    setShowUserForm(false)
    setEditingUser(null)
    setUserForm(emptyUser())
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    setCategoryInput('')
    setShowCategoryForm(true)
  }
  const handleEditCategory = (cat: string) => {
    setEditingCategory(cat)
    setCategoryInput(cat)
    setShowCategoryForm(true)
  }
  const handleDeleteCategory = (cat: string) => {
    setCategoriesState(categoriesState.filter(c => c !== cat))
    setToast({ show: true, message: 'Categoría eliminada correctamente' })
  }
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategory) {
      setCategoriesState(categoriesState.map(c => c === editingCategory ? categoryInput : c))
      setToast({ show: true, message: 'Categoría actualizada correctamente' })
    } else {
      if (!categoriesState.includes(categoryInput)) {
        setCategoriesState([...categoriesState, categoryInput])
        setToast({ show: true, message: 'Categoría agregada correctamente' })
      }
    }
    setShowCategoryForm(false)
    setEditingCategory(null)
    setCategoryInput('')
  }

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome()
    } else {
      window.location.href = '/'
    }
  }

  const handleDebugImages = () => {
    console.log('🔍 DEBUG: Analizando productos y sus imágenes...')
    console.log('📊 Total de productos:', products.length)
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}:`)
      console.log(`   - ID: ${product.id}`)
      console.log(`   - Imagen: ${product.image || 'NO TIENE'}`)
      console.log(`   - Tipo de imagen: ${typeof product.image}`)
      if (product.image) {
        console.log(`   - Longitud: ${product.image.length}`)
        console.log(`   - Es URL válida: ${product.image.startsWith('http')}`)
        console.log(`   - Es Firebase Storage: ${product.image.includes('firebase')}`)
        console.log(`   - Es Unsplash: ${product.image.includes('unsplash')}`)
      }
      console.log('---')
    })
    
    // También verificar el estado actual del formulario
    console.log('\n📝 ESTADO DEL FORMULARIO:')
    console.log('   - Editando:', editing ? 'SÍ' : 'NO')
    console.log('   - Formulario visible:', showForm ? 'SÍ' : 'NO')
    console.log('   - Imagen en formulario:', form.image || 'NO TIENE')
    console.log('   - Preview de imagen:', imagePreview || 'NO TIENE')
    
    setToast({ show: true, message: 'Revisa la consola del navegador para ver el análisis completo' })
  }

  const handleTestFirebaseStorage = async () => {
    try {
      console.log('🧪 Probando conexión con Firebase Storage...')
      
      // Crear un archivo de prueba
      const testContent = 'Test file content'
      const testBlob = new Blob([testContent], { type: 'text/plain' })
      const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' })
      
      console.log('📁 Archivo de prueba creado:', testFile.name, '(', testFile.size, 'bytes)')
      
      // Intentar subir el archivo de prueba
      const testUrl = await uploadImage(testFile, 'test-connection')
      console.log('✅ Conexión exitosa! URL de prueba:', testUrl)
      
      setToast({ show: true, message: '✅ Conexión con Firebase Storage exitosa' })
    } catch (error) {
      console.error('❌ Error en la conexión con Firebase Storage:', error)
      setToast({ show: true, message: `❌ Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}` })
    }
  }

  const handleShowStorageInstructions = () => {
    const instructions = `
🔧 CONFIGURACIÓN DE FIREBASE STORAGE

1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: tienda-tornillo
3. En el menú lateral, ve a STORAGE
4. Si no está inicializado, haz clic en "Get started"
5. Selecciona "Start in test mode"
6. Ve a la pestaña RULES
7. Reemplaza todo con las reglas del archivo firestore-storage.rules
8. Haz clic en PUBLISH

Las reglas permiten:
- ✅ Lectura pública de imágenes
- ✅ Escritura solo para usuarios autenticados
- ✅ Seguridad para todo lo demás
    `
    console.log(instructions)
    setToast({ show: true, message: '📋 Instrucciones mostradas en consola. Revisa la consola del navegador.' })
  }

  return (
    <div style={{ position: 'relative', padding: '2rem', maxWidth: 1200, margin: '0 auto', background: 'rgba(20,22,40,0.75)', borderRadius: 24, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.10)' }}>
      {/* Header con navegación */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid rgba(255,215,0,0.3)'
      }}>
        <h1 style={{ 
          color: '#ffd700', 
          fontWeight: 900, 
          margin: 0, 
          textAlign: 'left', 
          letterSpacing: 1,
          fontSize: '2rem'
        }}>
          🛠️ Panel de Administración
        </h1>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={handleGoHome}
            style={{ 
              background: 'linear-gradient(135deg, #3498db, #2980b9)', 
              color: '#fff', 
              fontWeight: 'bold', 
              border: 'none', 
              borderRadius: 8, 
              padding: '0.6rem 1.2rem', 
              cursor: 'pointer', 
              boxShadow: '0 2px 8px rgba(52,152,219,0.3)',
              transition: 'all 0.3s ease',
              fontSize: '14px'
            }}
          >
            🏠 Ir al Inicio
          </button>
          
          <button 
            onClick={onLogout} 
            style={{ 
              background: 'linear-gradient(135deg, #e74c3c, #c0392b)', 
              color: '#fff', 
              fontWeight: 'bold', 
              border: 'none', 
              borderRadius: 8, 
              padding: '0.6rem 1.2rem', 
              cursor: 'pointer', 
              boxShadow: '0 2px 8px rgba(231,76,60,0.3)',
              transition: 'all 0.3s ease',
              fontSize: '14px'
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
      {/* Sección de Categorías */}
      <section style={{ 
        background: 'rgba(255,255,255,0.02)', 
        borderRadius: '16px', 
        padding: '2rem', 
        marginBottom: '3rem',
        border: '1px solid rgba(255,215,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#ffd700', fontWeight: 800, fontSize: '1.5rem' }}>
            📁 Gestión de Categorías
          </h2>
          <button 
            onClick={handleAddCategory} 
            style={{ 
              background: 'linear-gradient(135deg, #ffd700, #ffed4e)', 
              color: '#1a1a2e', 
              fontWeight: 'bold', 
              border: 'none', 
              borderRadius: 10, 
              padding: '0.7rem 1.5rem', 
              cursor: 'pointer', 
              fontSize: 16,
              boxShadow: '0 2px 8px rgba(255,215,0,0.3)'
            }}
          >
            ➕ Agregar Categoría
          </button>
        </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(34,36,58,0.55)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px 0 rgba(26,26,46,0.10)' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.13)' }}>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 16, padding: '8px 0', letterSpacing: 0.5 }}>Nombre</th>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categoriesState.map(cat => (
            <tr key={cat} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.07)' }}>
              <td style={{ color: '#f5f7fa', fontWeight: 600, padding: '7px 0 7px 24px', textShadow: '0 1px 2px #2228', fontSize: 15 }}>{cat}</td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: 12 }}>
                  <button onClick={() => handleEditCategory(cat)} style={{ background: '#1a1a2e', color: '#ffd700', border: 'none', borderRadius: 8, padding: '0.25rem 0.9rem', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>Editar</button>
                  <button onClick={() => handleDeleteCategory(cat)} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: 8, padding: '0.25rem 0.9rem', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showCategoryForm && (
        <div style={{ marginTop: 24, background: 'rgba(34,36,58,0.92)', borderRadius: 16, boxShadow: '0 4px 24px rgba(31,38,135,0.18)', backdropFilter: 'blur(10px)', padding: 24, border: '1.5px solid rgba(255,255,255,0.13)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ color: '#ffd700', fontWeight: 800, marginBottom: 10 }}>{editingCategory ? 'Editar Categoría' : 'Agregar Categoría'}</h3>
          <form onSubmit={handleCategorySubmit} style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'center' }}>
            <input name="category" value={categoryInput} onChange={e => setCategoryInput(e.target.value)} placeholder="Nombre de la categoría" required style={{ flex: '1 1 180px', padding: 10, borderRadius: 8, border: '1.5px solid #ffd700', background: 'rgba(20,22,40,0.7)', color: '#fff', fontWeight: 600, fontSize: 15 }} />
            <button type="submit" style={{ background: '#ffd700', color: '#1a1a2e', fontWeight: 'bold', border: 'none', borderRadius: 8, padding: '0.6rem 1.5rem', cursor: 'pointer', fontSize: 15 }}>{editingCategory ? 'Guardar Cambios' : 'Agregar'}</button>
            <button type="button" onClick={() => setShowCategoryForm(false)} style={{ background: '#ccc', color: '#222', border: 'none', borderRadius: 8, padding: '0.6rem 1.5rem', cursor: 'pointer', fontSize: 15 }}>Cancelar</button>
          </form>
        </div>
      )}
      </section>

      {/* Sección de Productos */}
      <section style={{ 
        background: 'rgba(255,255,255,0.02)', 
        borderRadius: '16px', 
        padding: '2rem', 
        marginBottom: '3rem',
        border: '1px solid rgba(255,215,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#ffd700', fontWeight: 800, fontSize: '1.5rem' }}>
            📦 Gestión de Productos
          </h2>
                     <div style={{ display: 'flex', gap: '12px' }}>
             <button 
               onClick={handleAdd} 
               style={{ 
                 background: 'linear-gradient(135deg, #ffd700, #ffed4e)', 
                 color: '#1a1a2e', 
                 fontWeight: 'bold', 
                 border: 'none', 
                 borderRadius: 8, 
                 padding: '0.7rem 1.5rem', 
                 cursor: 'pointer',
                 boxShadow: '0 2px 8px rgba(255,215,0,0.3)'
               }}
             >
               ➕ Agregar Producto
             </button>
             
             <button 
               onClick={handleDebugImages} 
               style={{ 
                 background: 'linear-gradient(135deg, #9b59b6, #8e44ad)', 
                 color: '#fff', 
                 fontWeight: 'bold', 
                 border: 'none', 
                 borderRadius: 8, 
                 padding: '0.7rem 1.5rem', 
                 cursor: 'pointer',
                 boxShadow: '0 2px 8px rgba(155,89,182,0.3)',
                 fontSize: '14px'
               }}
             >
               🔍 Debug Imágenes
             </button>
             
             <button 
               onClick={handleTestFirebaseStorage} 
               style={{ 
                 background: 'linear-gradient(135deg, #27ae60, #2ecc71)', 
                 color: '#fff', 
                 fontWeight: 'bold', 
                 border: 'none', 
                 borderRadius: 8, 
                 padding: '0.7rem 1.5rem', 
                 cursor: 'pointer',
                 boxShadow: '0 2px 8px rgba(39,174,96,0.3)',
                 fontSize: '14px'
               }}
             >
               🧪 Probar Storage
             </button>
             
             <button 
               onClick={handleShowStorageInstructions} 
               style={{ 
                 background: 'linear-gradient(135deg, #f39c12, #e67e22)', 
                 color: '#fff', 
                 fontWeight: 'bold', 
                 border: 'none', 
                 borderRadius: 8, 
                 padding: '0.7rem 1.5rem', 
                 cursor: 'pointer',
                 boxShadow: '0 2px 8px rgba(243,156,18,0.3)',
                 fontSize: '14px'
               }}
             >
               📋 Instrucciones Storage
             </button>
           </div>
        </div>
        
        {/* Mensajes de estado */}
        {successMsg && (
          <div style={{ 
            background: 'rgba(46,204,113,0.2)', 
            border: '1px solid rgba(46,204,113,0.5)', 
            borderRadius: '8px', 
            padding: '12px', 
            color: '#2ecc71', 
            marginBottom: '1rem' 
          }}>
            ✅ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ 
            background: 'rgba(231,76,60,0.2)', 
            border: '1px solid rgba(231,76,60,0.5)', 
            borderRadius: '8px', 
            padding: '12px', 
            color: '#e74c3c', 
            marginBottom: '1rem' 
          }}>
            ❌ {errorMsg}
          </div>
        )}

        {/* Tabla de productos mejorada */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            background: 'rgba(34,36,58,0.55)', 
            borderRadius: 14, 
            overflow: 'hidden', 
            boxShadow: '0 2px 12px 0 rgba(26,26,46,0.10)',
                         minWidth: '1000px'
          }}>
                         <thead>
               <tr style={{ background: 'rgba(255,255,255,0.13)' }}>
                 <th style={{ color: '#fff', fontWeight: 800, fontSize: 15, padding: '16px 12px', letterSpacing: 0.5, textAlign: 'center' }}>🖼️ Imagen</th>
                 <th style={{ color: '#fff', fontWeight: 800, fontSize: 15, padding: '16px 12px', letterSpacing: 0.5, textAlign: 'left' }}>Producto</th>
                 <th style={{ color: '#fff', fontWeight: 800, fontSize: 15, padding: '16px 12px', textAlign: 'center' }}>Categoría</th>
                 <th style={{ color: '#fff', fontWeight: 800, fontSize: 15, padding: '16px 12px', textAlign: 'center' }}>💰 Unitario</th>
                 <th style={{ color: '#fff', fontWeight: 800, fontSize: 15, padding: '16px 12px', textAlign: 'center' }}>📦 Mayorista</th>
                 <th style={{ color: '#fff', fontWeight: 800, fontSize: 15, padding: '16px 12px', textAlign: 'center' }}>📊 Stock</th>
                 <th style={{ color: '#fff', fontWeight: 800, fontSize: 15, padding: '16px 12px', textAlign: 'center' }}>⭐ Destacado</th>
                 <th style={{ color: '#fff', fontWeight: 800, fontSize: 15, padding: '16px 12px', textAlign: 'center' }}>🔧 Acciones</th>
               </tr>
             </thead>
            <tbody>
              {loading ? (
                <tr>
                                     <td colSpan={8} style={{ 
                     textAlign: 'center', 
                     padding: '2rem', 
                     color: '#ffd700', 
                     fontSize: '1.2rem' 
                   }}>
                     ⏳ Cargando productos...
                   </td>
                 </tr>
               ) : products.length === 0 ? (
                 <tr>
                   <td colSpan={8} style={{ 
                     textAlign: 'center', 
                     padding: '2rem', 
                     color: '#bfc4d1', 
                     fontSize: '1.1rem' 
                   }}>
                     📭 No hay productos registrados
                   </td>
                </tr>
                             ) : (
                 products.map(p => (
                   <tr key={p.id} style={{ 
                     borderBottom: '1px solid rgba(255,255,255,0.08)', 
                     background: 'rgba(255,255,255,0.07)',
                     transition: 'background 0.3s ease'
                   }}>
                     <td style={{ 
                       padding: '16px 12px', 
                       textAlign: 'center',
                       verticalAlign: 'middle'
                     }}>
                       {p.image ? (
                         <img 
                           src={p.image} 
                           alt={p.name}
                           style={{ 
                             width: '50px', 
                             height: '50px', 
                             objectFit: 'cover',
                             borderRadius: '8px',
                             border: '2px solid #ffd700',
                             boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                           }}
                           onError={(e) => {
                             const target = e.currentTarget as HTMLImageElement
                             target.style.display = 'none'
                             const nextSibling = target.nextSibling as HTMLElement
                             if (nextSibling) {
                               nextSibling.style.display = 'flex'
                             }
                           }}
                         />
                       ) : null}
                                                <div style={{ 
                           display: p.image ? 'none' : 'flex',
                           width: '50px', 
                           height: '50px', 
                           background: 'rgba(255,215,0,0.2)',
                           borderRadius: '8px',
                           border: '2px dashed #ffd700',
                           alignItems: 'center',
                           justifyContent: 'center',
                           fontSize: '20px'
                         }}>
                           🖼️
                         </div>
                     </td>
                     <td style={{ 
                       color: '#f5f7fa', 
                       fontWeight: 600, 
                       padding: '16px 12px', 
                       textShadow: '0 1px 2px #2228',
                       maxWidth: '200px'
                     }}>
                       {p.name}
                     </td>
                    <td style={{ 
                      color: '#e0e6f7', 
                      fontWeight: 500, 
                      padding: '16px 12px', 
                      textAlign: 'center' 
                    }}>
                      <span style={{
                        background: 'rgba(255,215,0,0.2)',
                        color: '#ffd700',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 700
                      }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ 
                      color: '#ffd700', 
                      fontWeight: 700, 
                      padding: '16px 12px', 
                      textAlign: 'center' 
                    }}>
                      ${p.priceUnit?.toLocaleString('es-CO') || '0'}
                    </td>
                    <td style={{ 
                      color: '#ffd700', 
                      fontWeight: 700, 
                      padding: '16px 12px', 
                      textAlign: 'center' 
                    }}>
                      ${p.priceBulk?.toLocaleString('es-CO') || '0'}
                    </td>
                    <td style={{ 
                      color: '#bfc4d1', 
                      fontWeight: 500, 
                      padding: '16px 12px', 
                      textAlign: 'center' 
                    }}>
                      <span style={{
                        background: p.stock > 50 ? 'rgba(46,204,113,0.2)' : p.stock > 20 ? 'rgba(243,156,18,0.2)' : 'rgba(231,76,60,0.2)',
                        color: p.stock > 50 ? '#2ecc71' : p.stock > 20 ? '#f39c12' : '#e74c3c',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 700
                      }}>
                        {p.stock}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '16px 12px' }}>
                      <button
                        onClick={() => handleToggleFeatured(p.id, !p.destacado)}
                        style={{
                          background: p.destacado ? 'linear-gradient(135deg, #ffd700, #ffed4e)' : 'rgba(255,255,255,0.1)',
                          color: p.destacado ? '#1a1a2e' : '#ffd700',
                          border: '2px solid #ffd700',
                          borderRadius: 20,
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: 11,
                          transition: 'all 0.3s ease',
                          boxShadow: p.destacado ? '0 2px 8px rgba(255,215,0,0.3)' : 'none'
                        }}
                        title={p.destacado ? 'Quitar de destacados' : 'Marcar como destacado'}
                      >
                        {p.destacado ? '⭐ Destacado' : '☆ Normal'}
                      </button>
                    </td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleEdit(p)} 
                          style={{ 
                            background: 'linear-gradient(135deg, #3498db, #2980b9)', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: 6, 
                            padding: '8px 12px', 
                            cursor: 'pointer', 
                            fontWeight: 700,
                            fontSize: '12px',
                            boxShadow: '0 2px 4px rgba(52,152,219,0.3)'
                          }}
                        >
                          📝 Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)} 
                          style={{ 
                            background: 'linear-gradient(135deg, #e74c3c, #c0392b)', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: 6, 
                            padding: '8px 12px', 
                            cursor: 'pointer', 
                            fontWeight: 700,
                            fontSize: '12px',
                            boxShadow: '0 2px 4px rgba(231,76,60,0.3)'
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      {showForm && (
        <div style={{ marginTop: 30, background: 'rgba(34,36,58,0.85)', borderRadius: 16, boxShadow: '0 4px 24px rgba(31,38,135,0.18)', backdropFilter: 'blur(10px)', padding: 24, border: '1.5px solid rgba(255,255,255,0.13)' }}>
          <h3 style={{ color: '#ffd700', fontWeight: 800 }}>{editing ? 'Editar Producto' : 'Agregar Producto'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" required style={{ flex: '1 1 200px', padding: 10, borderRadius: 8, border: '1.5px solid #ffd700', background: 'rgba(20,22,40,0.7)', color: '#fff', fontWeight: 600 }} />
            <select name="category" value={form.category} onChange={handleChange} required style={{ flex: '1 1 120px', padding: 10, borderRadius: 8, border: '1.5px solid #ffd700', background: 'rgba(20,22,40,0.7)', color: '#fff', fontWeight: 600 }}>
              {categories.filter(c => c !== 'Todos').map(c => <option key={c}>{c}</option>)}
            </select>
            <input name="priceUnit" type="number" min="0" step="1" value={form.priceUnit} onChange={handleChange} placeholder="Precio Unidad" required style={{ flex: '1 1 100px', padding: 10, borderRadius: 8, border: '1.5px solid #ffd700', background: 'rgba(20,22,40,0.7)', color: '#fff', fontWeight: 600 }} />
            <input name="priceBulk" type="number" min="0" step="1" value={form.priceBulk} onChange={handleChange} placeholder="Precio Mayorista" required style={{ flex: '1 1 100px', padding: 10, borderRadius: 8, border: '1.5px solid #ffd700', background: 'rgba(20,22,40,0.7)', color: '#fff', fontWeight: 600 }} />
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="Stock" required style={{ flex: '1 1 80px', padding: 10, borderRadius: 8, border: '1.5px solid #ffd700', background: 'rgba(20,22,40,0.7)', color: '#fff', fontWeight: 600 }} />
            <input name="description" value={form.description} onChange={handleChange} placeholder="Descripción" required style={{ flex: '2 1 300px', padding: 10, borderRadius: 8, border: '1.5px solid #ffd700', background: 'rgba(20,22,40,0.7)', color: '#fff', fontWeight: 600 }} />
            <input name="spec_size" value={form.specifications?.size || ''} onChange={handleChange} placeholder="Tamaño" style={{ flex: '1 1 100px', padding: 10, borderRadius: 8, border: '1.5px solid #ffd700', background: 'rgba(20,22,40,0.7)', color: '#fff', fontWeight: 600 }} />
            <input name="spec_material" value={form.specifications?.material || ''} onChange={handleChange} placeholder="Material" style={{ flex: '1 1 100px', padding: 10, borderRadius: 8, border: '1.5px solid #ffd700', background: 'rgba(20,22,40,0.7)', color: '#fff', fontWeight: 600 }} />
            <input name="spec_type" value={form.specifications?.type || ''} onChange={handleChange} placeholder="Tipo" style={{ flex: '1 1 100px', padding: 10, borderRadius: 8, border: '1.5px solid #ffd700', background: 'rgba(20,22,40,0.7)', color: '#fff', fontWeight: 600 }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#ffd700', flex: '1 1 200px' }}>
              <input 
                type="checkbox" 
                name="destacado" 
                checked={!!form.destacado} 
                onChange={e => setForm({ ...form, destacado: e.target.checked })}
                style={{ width: 18, height: 18 }}
              />
              ⭐ Producto Destacado (mostrar en inicio)
            </label>
                         <div style={{ flex: '2 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
               <label style={{ color: '#ffd700', fontWeight: 700, marginBottom: 4 }}>Imagen del producto</label>
               <input type="file" accept="image/*,.svg" onChange={handleImageChange} style={{ color: '#fff', background: 'transparent' }} />
               <small style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                 Formatos soportados: JPG, PNG, WebP, SVG (máx. 5MB)
               </small>
               {imagePreview || form.image ? (
                 <img src={imagePreview || form.image} alt="Vista previa" style={{ marginTop: 8, maxWidth: 120, maxHeight: 120, borderRadius: 12, boxShadow: '0 2px 8px #0006', border: '1.5px solid #ffd700' }} />
               ) : null}
             </div>
            <button type="submit" style={{ background: '#ffd700', color: '#1a1a2e', fontWeight: 'bold', border: 'none', borderRadius: 8, padding: '0.7rem 2rem', cursor: 'pointer', marginTop: 10 }}>{submitting ? 'Guardando...' : (editing ? 'Guardar Cambios' : 'Agregar')}</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ background: '#ccc', color: '#222', border: 'none', borderRadius: 8, padding: '0.7rem 2rem', cursor: 'pointer', marginTop: 10 }}>Cancelar</button>
          </form>
        </div>
      )}
      </section>

      {/* Sección de Usuarios */}
      <section style={{ 
        background: 'rgba(255,255,255,0.02)', 
        borderRadius: '16px', 
        padding: '2rem', 
        marginBottom: '3rem',
        border: '1px solid rgba(255,215,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#ffd700', fontWeight: 800, fontSize: '1.5rem' }}>
            👥 Gestión de Usuarios
          </h2>
          <button 
            onClick={handleAddUser} 
            style={{ 
              background: 'linear-gradient(135deg, #ffd700, #ffed4e)', 
              color: '#1a1a2e', 
              fontWeight: 'bold', 
              border: 'none', 
              borderRadius: 8, 
              padding: '0.7rem 1.5rem', 
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(255,215,0,0.3)'
            }}
          >
            ➕ Agregar Usuario
          </button>
        </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, background: 'rgba(34,36,58,0.55)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px 0 rgba(26,26,46,0.10)' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.13)' }}>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 17, padding: '10px 0', letterSpacing: 0.5 }}>Nombre</th>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>Email</th>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>Rol</th>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.07)' }}>
              <td style={{ color: '#f5f7fa', fontWeight: 600, padding: '8px 0 8px 24px', textShadow: '0 1px 2px #2228' }}>{u.name}</td>
              <td style={{ color: '#e0e6f7', fontWeight: 500 }}>{u.email}</td>
              <td style={{ color: u.isAdmin ? '#ffd700' : '#bfc4d1', fontWeight: 700 }}>{u.isAdmin ? 'Admin' : 'Usuario'}</td>
              <td>
                <button onClick={() => handleEditUser(u)} style={{ marginRight: 8, background: '#1a1a2e', color: '#ffd700', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', cursor: 'pointer', fontWeight: 700 }}>Editar</button>
                <button onClick={() => handleDeleteUser(u.id)} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', cursor: 'pointer', fontWeight: 700 }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showUserForm && (
        <div style={{ marginTop: 30, background: 'rgba(34,36,58,0.85)', borderRadius: 16, boxShadow: '0 4px 24px rgba(31,38,135,0.18)', backdropFilter: 'blur(10px)', padding: 24, border: '1.5px solid rgba(255,255,255,0.13)' }}>
          <h3 style={{ color: '#ffd700', fontWeight: 800 }}>{editingUser ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
          <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <input name="name" value={userForm.name} onChange={handleUserChange} placeholder="Nombre" required style={{ flex: '1 1 200px', padding: 10, borderRadius: 8, border: '1.5px solid #ffd700', background: 'rgba(20,22,40,0.7)', color: '#fff', fontWeight: 600 }} />
            <input name="email" value={userForm.email} onChange={handleUserChange} placeholder="Email" required style={{ flex: '1 1 200px', padding: 10, borderRadius: 8, border: '1.5px solid #ffd700', background: 'rgba(20,22,40,0.7)', color: '#fff', fontWeight: 600 }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#ffd700' }}>
              <input type="checkbox" name="isAdmin" checked={!!userForm.isAdmin} onChange={handleUserChange} />
              Es administrador
            </label>
            <button type="submit" style={{ background: '#ffd700', color: '#1a1a2e', fontWeight: 'bold', border: 'none', borderRadius: 8, padding: '0.7rem 2rem', cursor: 'pointer', marginTop: 10 }}>{editingUser ? 'Guardar Cambios' : 'Agregar'}</button>
            <button type="button" onClick={() => setShowUserForm(false)} style={{ background: '#ccc', color: '#222', border: 'none', borderRadius: 8, padding: '0.7rem 2rem', cursor: 'pointer', marginTop: 10 }}>Cancelar</button>
          </form>
        </div>
      )}
      </section>

      {/* Sección de Pedidos */}
      <section style={{ 
        background: 'rgba(255,255,255,0.02)', 
        borderRadius: '16px', 
        padding: '2rem', 
        marginBottom: '3rem',
        border: '1px solid rgba(255,215,0,0.2)'
      }}>
        <h2 style={{ margin: '0 0 1.5rem 0', color: '#ffd700', fontWeight: 800, fontSize: '1.5rem' }}>
          📋 Historial de Pedidos
        </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, background: 'rgba(34,36,58,0.55)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px 0 rgba(26,26,46,0.10)' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.13)' }}>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 17, padding: '10px 0', letterSpacing: 0.5 }}>ID</th>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>Usuario</th>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>Fecha</th>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>Total</th>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.07)' }}>
              <td style={{ color: '#e0e6f7', fontWeight: 600, padding: '8px 0 8px 24px' }}>{p.id}</td>
              <td style={{ color: '#f5f7fa', fontWeight: 600 }}>{p.usuario}</td>
              <td style={{ color: '#bfc4d1', fontWeight: 500 }}>{p.fecha}</td>
              <td style={{ color: '#ffd700', fontWeight: 700 }}>${p.total.toLocaleString('es-CO')}</td>
              <td>
                <button onClick={() => setDetallePedido(p)} style={{ background: '#1a1a2e', color: '#ffd700', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', cursor: 'pointer', fontWeight: 700 }}>Ver Detalle</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {detallePedido && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setDetallePedido(null)}>
          <div style={{ background: 'rgba(34,36,58,0.95)', borderRadius: 18, padding: 32, minWidth: 320, maxWidth: 420, boxShadow: '0 4px 24px rgba(31,38,135,0.18)', border: '1.5px solid rgba(255,255,255,0.13)', backdropFilter: 'blur(10px)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#ffd700', fontWeight: 800 }}>Detalle del Pedido #{detallePedido.id}</h3>
            <p style={{ color: '#fff' }}><b>Usuario:</b> {detallePedido.usuario}</p>
            <p style={{ color: '#fff' }}><b>Fecha:</b> {detallePedido.fecha}</p>
            <table style={{ width: '100%', margin: '16px 0', background: 'rgba(20,22,40,0.7)', borderRadius: 8 }}>
              <thead>
                <tr><th style={{ color: '#ffd700', fontWeight: 700 }}>Producto</th><th style={{ color: '#ffd700', fontWeight: 700 }}>Cantidad</th><th style={{ color: '#ffd700', fontWeight: 700 }}>Precio</th></tr>
              </thead>
              <tbody>
                {detallePedido.productos.map((prod, i) => (
                  <tr key={i}>
                    <td style={{ color: '#fff', fontWeight: 600 }}>{prod.nombre}</td>
                    <td style={{ color: '#fff', fontWeight: 600 }}>{prod.cantidad}</td>
                    <td style={{ color: '#ffd700', fontWeight: 700 }}>${prod.precio.toLocaleString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: '#fff' }}><b>Total:</b> <span style={{ color: '#ffd700' }}>${detallePedido.total.toLocaleString('es-CO')}</span></p>
            <button onClick={() => setDetallePedido(null)} style={{ background: '#ffd700', color: '#1a1a2e', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', marginTop: 12, cursor: 'pointer' }}>Cerrar</button>
          </div>
        </div>
      )}
      </section>

      {/* Sección de Herramientas y Utilidades */}
      <section style={{ 
        background: 'rgba(255,255,255,0.02)', 
        borderRadius: '16px', 
        padding: '2rem', 
        marginBottom: '3rem',
        border: '1px solid rgba(255,215,0,0.2)'
      }}>
        <h2 style={{ margin: '0 0 2rem 0', color: '#ffd700', fontWeight: 800, fontSize: '1.5rem' }}>
          🛠️ Herramientas y Utilidades
        </h2>
        
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div>
            <h3 style={{ color: '#ffd700', fontSize: '1.2rem', marginBottom: '1rem' }}>💰 Actualización de Precios</h3>
            <UpdateProducts />
          </div>
          
          <div>
            <h3 style={{ color: '#ffd700', fontSize: '1.2rem', marginBottom: '1rem' }}>🖼️ Gestión de Imágenes</h3>
            <AddRandomImages />
          </div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gap: '2rem', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          marginTop: '2rem'
        }}>
          <div>
            <h3 style={{ color: '#ffd700', fontSize: '1.2rem', marginBottom: '1rem' }}>📄 Pruebas de Cotizaciones</h3>
            <TestQuotations />
            <div style={{ marginTop: '1rem' }}>
              <TestDeleteQuotations />
            </div>
          </div>
          
          <div>
            <h3 style={{ color: '#ffd700', fontSize: '1.2rem', marginBottom: '1rem' }}>⚙️ Configuración de Firebase</h3>
            <div style={{
              padding: '1.5rem',
              background: 'rgba(35,36,58,0.92)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#e0e0e0', marginBottom: '1.5rem', fontSize: '14px' }}>
                Si necesitas volver a ejecutar la configuración inicial de Firebase.
              </p>
              
              <button
                onClick={() => {
                  resetFirebaseSetup()
                  setToast({ show: true, message: 'Configuración reseteada. Recarga la página para volver a configurar.' })
                }}
                style={{
                  background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(231,76,60,0.3)'
                }}
              >
                🔄 Resetear Firebase
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Componente de progreso de carga de imágenes */}
      <ImageUploadProgress isUploading={isImageUploading} progress={uploadProgress} />
    </div>
  )
}

export default AdminPanel 