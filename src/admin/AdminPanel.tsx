import { useState, useEffect } from 'react'
import { categories } from '../data/products'
import type { Product } from '../data/products'
import { getProducts, deleteProduct, updateProduct, addProduct } from '../services/productsService'

interface Props {
  onLogout: () => void
}

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

function AdminPanel({ onLogout }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<Product>(emptyProduct())
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    setLoading(true)
    getProducts().then(prods => {
      setProducts(prods)
      setLoading(false)
    })
  }, [])

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
      setSuccessMsg('Producto eliminado correctamente')
    } catch (err) {
      setErrorMsg('Error al eliminar el producto')
      // @ts-ignore
      console.error('Error al eliminar producto:', err?.message || err)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setSubmitting(true)
    try {
      if (editing) {
        await updateProduct(editing.id, { ...form })
        setSuccessMsg('Producto actualizado correctamente')
      } else {
        await addProduct({ ...form, id: undefined })
        setSuccessMsg('Producto agregado correctamente')
      }
      setShowForm(false)
      setEditing(null)
      setForm(emptyProduct())
    } catch (err) {
      setErrorMsg('Error al guardar el producto')
      // @ts-ignore
      console.error('Error al guardar producto:', err?.message || err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Panel de Administración</h1>
      <button onClick={onLogout} style={{ float: 'right', marginBottom: 20, background: '#ffd700', color: '#1a1a2e', fontWeight: 'bold', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', cursor: 'pointer' }}>
        Cerrar sesión admin
      </button>
      <h2>Gestión de Productos</h2>
      <button onClick={handleAdd} style={{ marginBottom: 20, background: '#1a1a2e', color: '#ffd700', fontWeight: 'bold', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', cursor: 'pointer' }}>
        Agregar Producto
      </button>
      <div style={{ color: 'green', marginBottom: 10 }}>{successMsg}</div>
      <div style={{ color: 'red', marginBottom: 10 }}>{errorMsg}</div>
      {loading ? (
        <div>Cargando productos...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>
                  <button onClick={() => handleEdit(p)} style={{ marginRight: 8, background: '#1a1a2e', color: '#ffd700', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && (
        <div style={{ marginTop: 30, background: '#f8f9fa', padding: 20, borderRadius: 10 }}>
          <h3>{editing ? 'Editar Producto' : 'Agregar Producto'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" required style={{ flex: '1 1 200px', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <select name="category" value={form.category} onChange={handleChange} required style={{ flex: '1 1 120px', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
              {categories.filter(c => c !== 'Todos').map(c => <option key={c}>{c}</option>)}
            </select>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="Precio" required style={{ flex: '1 1 100px', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="Stock" required style={{ flex: '1 1 80px', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <input name="description" value={form.description} onChange={handleChange} placeholder="Descripción" required style={{ flex: '2 1 300px', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <input name="spec_size" value={form.specifications?.size || ''} onChange={handleChange} placeholder="Tamaño" style={{ flex: '1 1 100px', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <input name="spec_material" value={form.specifications?.material || ''} onChange={handleChange} placeholder="Material" style={{ flex: '1 1 100px', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <input name="spec_type" value={form.specifications?.type || ''} onChange={handleChange} placeholder="Tipo" style={{ flex: '1 1 100px', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <button type="submit" style={{ background: '#ffd700', color: '#1a1a2e', fontWeight: 'bold', border: 'none', borderRadius: 8, padding: '0.7rem 2rem', cursor: 'pointer', marginTop: 10 }} disabled={submitting}>{submitting ? 'Guardando...' : (editing ? 'Guardar Cambios' : 'Agregar')}</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ background: '#ccc', color: '#222', border: 'none', borderRadius: 8, padding: '0.7rem 2rem', cursor: 'pointer', marginTop: 10 }}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default AdminPanel 