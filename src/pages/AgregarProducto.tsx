import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { categories } from '../data/products'
import type { Product } from '../data/products'

interface NewProduct extends Omit<Product, 'id'> {
  imageFile?: File | null
}

const initialState: NewProduct = {
  name: '',
  category: categories[1],
  price: 0,
  stock: 0,
  description: '',
  specifications: {
    size: '',
    material: '',
    type: ''
  },
  image: '',
  imageFile: null
}

export default function AgregarProducto() {
  const [product, setProduct] = useState<NewProduct>(initialState)
  const [preview, setPreview] = useState<string>('')
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [productos, setProductos] = useState<Product[]>([])
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name in product.specifications!) {
      setProduct(p => ({ ...p, specifications: { ...p.specifications, [name]: value } }))
    } else {
      setProduct(p => ({ ...p, [name]: value }))
    }
  }

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProduct(p => ({ ...p, imageFile: file }))
      setPreview(URL.createObjectURL(file))
    }
  }

  const validate = () => {
    const newErrors: {[key: string]: string} = {}
    if (!product.name) newErrors.name = 'El nombre es obligatorio.'
    if (!product.category) newErrors.category = 'La categoría es obligatoria.'
    if (!product.price || product.price <= 0) newErrors.price = 'El precio debe ser mayor a 0.'
    if (!product.stock || product.stock < 0) newErrors.stock = 'El stock no puede ser negativo.'
    if (!product.description) newErrors.description = 'La descripción es obligatoria.'
    if (!product.specifications?.size) newErrors.size = 'El tamaño es obligatorio.'
    if (!product.specifications?.material) newErrors.material = 'El material es obligatorio.'
    if (!product.specifications?.type) newErrors.type = 'El tipo es obligatorio.'
    if (!product.imageFile) newErrors.image = 'La imagen es obligatoria.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    // Simulación de guardado local
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      image: preview // Solo para demo, normalmente subirías la imagen y guardarías la URL
    }
    setProductos(arr => [...arr, newProduct])
    setProduct(initialState)
    setPreview('')
    alert('Producto agregado correctamente (solo local)')
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', padding: 24, borderRadius: 8 }}>
      <h2>Agregar Producto</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input name="name" placeholder="Nombre del producto" value={product.name} onChange={handleChange} style={{ flex: 2 }} />
          <select name="category" value={product.category} onChange={handleChange} style={{ flex: 1 }}>
            {categories.filter(c => c !== 'Todos').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 13, color: '#555' }}>Precio (COP)</label>
            <input name="price" type="number" placeholder="Precio del producto" value={product.price} onChange={handleChange} min={0} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 13, color: '#555' }}>Cantidad en stock</label>
            <input name="stock" type="number" placeholder="Cantidad disponible" value={product.stock} onChange={handleChange} min={0} />
          </div>
        </div>
        <textarea name="description" placeholder="Descripción" value={product.description} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input name="size" placeholder='Tamaño (ej: 1/2" o 16oz)' value={product.specifications?.size || ''} onChange={handleChange} style={{ flex: 1 }} />
          <input name="material" placeholder="Material (ej: Acero)" value={product.specifications?.material || ''} onChange={handleChange} style={{ flex: 1 }} />
        </div>
        <input name="type" placeholder="Tipo (ej: Phillips, Allen)" value={product.specifications?.type || ''} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }} />
        <div style={{ marginBottom: 12 }}>
          <input type="file" accept="image/*" onChange={handleImage} />
          {preview && <img src={preview} alt="Vista previa" style={{ maxWidth: 120, marginTop: 8, borderRadius: 4 }} />}
        </div>
        <div style={{ color: 'red', marginBottom: 12 }}>
          {Object.values(errors).map((err, i) => <div key={i}>{err}</div>)}
        </div>
        <button type="submit" style={{ background: '#ffd700', color: '#222', fontWeight: 600, padding: '8px 24px', border: 'none', borderRadius: 6, marginRight: 8 }}>Agregar</button>
        <button type="button" style={{ background: '#ccc', color: '#222', fontWeight: 600, padding: '8px 24px', border: 'none', borderRadius: 6 }} onClick={() => { setProduct(initialState); setPreview(''); setErrors({}) }}>Cancelar</button>
      </form>
    </div>
  )
} 