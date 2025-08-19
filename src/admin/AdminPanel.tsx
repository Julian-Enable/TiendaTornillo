import { useState, useEffect } from 'react'
import { categories } from '../data/products'
import type { Product } from '../data/products'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService'
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService'
import type { User } from '../services/userService'
import UpdateProducts from '../components/UpdateProducts'
import TestQuotations from '../components/TestQuotations'
import TestDeleteQuotations from '../components/TestDeleteQuotations'
import { resetFirebaseSetup } from '../utils/firebaseReset'

interface Props {
  onLogout: () => void
  setToast: (toast: { show: boolean, message: string }) => void
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
    price: 0,
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

function AdminPanel({ onLogout, setToast }: Props) {
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
      await deleteProduct(id)
      setProducts(products.filter(p => p.id !== id))
      setToast({ show: true, message: 'Producto eliminado correctamente' })
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      setToast({ show: true, message: 'Error al eliminar producto' })
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)
      setForm({ ...form, image: url })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setSubmitting(true)
    try {
      if (editing) {
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

  return (
    <div style={{ position: 'relative', padding: '2rem', maxWidth: 900, margin: '0 auto', background: 'rgba(20,22,40,0.75)', borderRadius: 24, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.10)' }}>
      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 10 }}>
        {/* Eliminar: <Toast message={toast.message} show={toast.show} onClose={() => setToast({ ...toast, show: false })} /> */}
      </div>
      <h1 style={{ color: '#ffd700', fontWeight: 900, marginBottom: 24, textAlign: 'center', letterSpacing: 1 }}>Panel de Administración</h1>
      <button onClick={onLogout} style={{ float: 'right', marginBottom: 20, background: '#ffd700', color: '#1a1a2e', fontWeight: 'bold', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(26,26,46,0.10)' }}>
        Cerrar sesión admin
      </button>
      {/* Gestión de categorías */}
      <h2 style={{ marginTop: 24, color: '#ffd700', fontWeight: 800 }}>Gestión de Categorías</h2>
      <button onClick={handleAddCategory} style={{ marginBottom: 18, background: '#1a1a2e', color: '#ffd700', fontWeight: 'bold', border: 'none', borderRadius: 10, padding: '0.5rem 1.5rem', cursor: 'pointer', fontSize: 16 }}>Agregar Categoría</button>
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
      <h2 style={{ marginTop: 48, color: '#ffd700', fontWeight: 800 }}>Gestión de Productos</h2>
      <button onClick={handleAdd} style={{ marginBottom: 20, background: '#1a1a2e', color: '#ffd700', fontWeight: 'bold', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', cursor: 'pointer' }}>
        Agregar Producto
      </button>
      <div style={{ color: 'green', marginBottom: 10 }}>{successMsg}</div>
      <div style={{ color: 'red', marginBottom: 10 }}>{errorMsg}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, background: 'rgba(34,36,58,0.55)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px 0 rgba(26,26,46,0.10)' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.13)' }}>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 17, padding: '10px 0', letterSpacing: 0.5 }}>Nombre</th>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>Categoría</th>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>Precio Unidad</th>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>Precio Mayorista</th>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>Stock</th>
            <th style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.07)' }}>
              <td style={{ color: '#f5f7fa', fontWeight: 600, padding: '8px 0 8px 24px', textShadow: '0 1px 2px #2228' }}>{p.name}</td>
              <td style={{ color: '#e0e6f7', fontWeight: 500 }}>{p.category}</td>
              <td style={{ color: '#ffd700', fontWeight: 700 }}>${p.priceUnit.toLocaleString('es-CO')}</td>
              <td style={{ color: '#ffd700', fontWeight: 700 }}>${p.priceBulk.toLocaleString('es-CO')}</td>
              <td style={{ color: '#bfc4d1', fontWeight: 500 }}>{p.stock}</td>
              <td>
                <button onClick={() => handleEdit(p)} style={{ marginRight: 8, background: '#1a1a2e', color: '#ffd700', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', cursor: 'pointer', fontWeight: 700 }}>Editar</button>
                <button onClick={() => handleDelete(p.id)} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', cursor: 'pointer', fontWeight: 700 }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
            <div style={{ flex: '2 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <label style={{ color: '#ffd700', fontWeight: 700, marginBottom: 4 }}>Imagen del producto</label>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ color: '#fff', background: 'transparent' }} />
              {imagePreview || form.image ? (
                <img src={imagePreview || form.image} alt="Vista previa" style={{ marginTop: 8, maxWidth: 120, maxHeight: 120, borderRadius: 12, boxShadow: '0 2px 8px #0006', border: '1.5px solid #ffd700' }} />
              ) : null}
            </div>
            <button type="submit" style={{ background: '#ffd700', color: '#1a1a2e', fontWeight: 'bold', border: 'none', borderRadius: 8, padding: '0.7rem 2rem', cursor: 'pointer', marginTop: 10 }}>{submitting ? 'Guardando...' : (editing ? 'Guardar Cambios' : 'Agregar')}</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ background: '#ccc', color: '#222', border: 'none', borderRadius: 8, padding: '0.7rem 2rem', cursor: 'pointer', marginTop: 10 }}>Cancelar</button>
          </form>
        </div>
      )}
      <h2 style={{ marginTop: 48, color: '#ffd700', fontWeight: 800 }}>Gestión de Usuarios</h2>
      <button onClick={handleAddUser} style={{ marginBottom: 20, background: '#1a1a2e', color: '#ffd700', fontWeight: 'bold', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', cursor: 'pointer' }}>
        Agregar Usuario
      </button>
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
      <h2 style={{ marginTop: 48, color: '#ffd700', fontWeight: 800 }}>Historial de Pedidos</h2>
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
      
      <h2 style={{ marginTop: 48, color: '#ffd700', fontWeight: 800 }}>Actualización de Productos</h2>
      <UpdateProducts />
      
      <h2 style={{ marginTop: 48, color: '#ffd700', fontWeight: 800 }}>Prueba de Cotizaciones</h2>
      <TestQuotations />
      
      <h2 style={{ marginTop: 48, color: '#ffd700', fontWeight: 800 }}>Prueba de Eliminación de Cotizaciones</h2>
      <TestDeleteQuotations />
      
      <h2 style={{ marginTop: 48, color: '#ffd700', fontWeight: 800 }}>Configuración de Firebase</h2>
      <div style={{
        padding: '2rem',
        background: 'rgba(35,36,58,0.92)',
        borderRadius: '12px',
        margin: '2rem auto',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>
          Gestión de Configuración
        </h3>
        
        <p style={{ color: '#e0e0e0', marginBottom: '2rem' }}>
          Si necesitas volver a ejecutar la configuración inicial de Firebase, usa este botón.
        </p>
        
        <button
          onClick={() => {
            resetFirebaseSetup()
            setToast({ show: true, message: 'Configuración reseteada. Recarga la página para volver a configurar.' })
          }}
          style={{
            background: '#ff4444',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Resetear Configuración de Firebase
        </button>
        
        <div style={{
          marginTop: '2rem',
          textAlign: 'left',
          background: 'rgba(0,0,0,0.2)',
          padding: '1rem',
          borderRadius: '8px'
        }}>
          <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>¿Cuándo usar esto?</h4>
          <ul style={{ color: '#e0e0e0', fontSize: '14px' }}>
            <li>Si cambias la configuración de Firebase</li>
            <li>Si necesitas volver a migrar datos iniciales</li>
            <li>Si hay problemas con la configuración</li>
            <li>Para desarrollo y pruebas</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel 