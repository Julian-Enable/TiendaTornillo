import type { ChangeEvent, FormEvent } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { categories } from '../data/products'
import type { Product } from '../data/products'
// Eliminado: import { storage } from '../services/firebase'
// Eliminado: import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
// Eliminada la lógica de subida de imágenes con Firebase Storage
// Aquí irá la nueva lógica de la base de datos elegida

interface NewProduct extends Omit<Product, 'id'> {
  imageFile?: File | null
}

const initialState: NewProduct = {
  name: '',
  category: categories[1],
  priceUnit: 0,
  priceBulk: 0,
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

// Lista de medidas sugeridas (puedes ampliarla según tus productos)
const medidasDisponibles = [
  '1/4"', '3/8"', '1/2"', '5/16"', '2"', '16oz', '24"', '25ft', '7-1/4"', '12AWG', '15A', '1.5mm - 10mm', '#2', '4x4"'
]

export default function AgregarProducto() {
  const [product, setProduct] = useState<NewProduct>(initialState)
  const [preview, setPreview] = useState<string>('')
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [productos, setProductos] = useState<Product[]>([])
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/admin')
    }
  }, [isAuthenticated, user, navigate])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name in product.specifications!) {
      setProduct(p => ({ ...p, specifications: { ...p.specifications, [name]: value } }))
    } else {
      setProduct(p => ({ ...p, [name]: name === 'priceUnit' || name === 'priceBulk' || name === 'stock' ? Number(value) : value }))
    }
  }

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProduct(p => ({ ...p, imageFile: file }))
      setPreview(URL.createObjectURL(file))
    }
  }

  // Manejar selección de medidas
  const handleSizeCheck = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  // Actualizar el campo size en el producto cuando cambian los checks
  useEffect(() => {
    setProduct(p => ({ ...p, specifications: { ...p.specifications, size: selectedSizes.join(', ') } }))
  }, [selectedSizes])

  const validate = () => {
    const newErrors: {[key: string]: string} = {}
    if (!product.name) newErrors.name = 'El nombre es obligatorio.'
    if (!product.category) newErrors.category = 'La categoría es obligatoria.'
    if (!product.priceUnit || product.priceUnit <= 0) newErrors.priceUnit = 'El precio por unidad debe ser mayor a 0.'
    if (!product.priceBulk || product.priceBulk <= 0) newErrors.priceBulk = 'El precio al por mayor debe ser mayor a 0.'
    if (!product.stock || product.stock < 0) newErrors.stock = 'El stock no puede ser negativo.'
    if (!product.description) newErrors.description = 'La descripción es obligatoria.'
    // if (!product.specifications?.size) newErrors.size = 'El tamaño es obligatorio.' // Ya no es obligatorio
    if (!product.specifications?.material) newErrors.material = 'El material es obligatorio.'
    if (!product.specifications?.type) newErrors.type = 'El tipo es obligatorio.'
    if (!product.imageFile) newErrors.image = 'La imagen es obligatoria.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')
    if (!validate()) return
    setSubmitting(true)
    try {
      let imageUrl = ''
      // Eliminado: if (product.imageFile) {
      // Eliminado:   const imageRef = ref(storage, `products/${Date.now()}_${product.imageFile.name}`)
      // Eliminado:   await uploadBytes(imageRef, product.imageFile)
      // Eliminado:   imageUrl = await getDownloadURL(imageRef)
      // Eliminado: }
      const newProduct: Omit<Product, 'id'> = {
        ...product,
        image: imageUrl,
      }
      // Eliminado: await addProduct(newProduct) // Eliminado: addProduct fue eliminado
      setProduct(initialState)
      setPreview('')
      setErrors({})
      setSuccessMsg('¡Producto agregado correctamente!')
    } catch (err) {
      setErrorMsg('Error al agregar el producto. Revisa la consola.')
      // @ts-ignore
      console.error('Error al agregar producto:', err?.message || err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f8fafc 0%, #e9ecf4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 480, width: '100%', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(26,26,46,0.13)', padding: '40px 32px', margin: '40px 0' }}>
        <button onClick={() => navigate('/admin')} style={{ marginBottom: 18, background: '#1a1a2e', color: '#ffd700', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, fontSize: 15, cursor: 'pointer', float: 'right' }}>← Volver al Panel</button>
        <h2 style={{ color: '#1a1a2e', fontWeight: 800, fontSize: '2rem', marginBottom: 24, textAlign: 'center', letterSpacing: '-1px', clear: 'both' }}>Agregar Producto</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <input name="name" placeholder="Nombre del producto" value={product.name} onChange={handleChange} style={{ flex: 2, padding: 12, borderRadius: 8, border: '1.5px solid #1a1a2e', fontSize: 15 }} />
            <select name="category" value={product.category} onChange={handleChange} style={{ flex: 1, padding: 12, borderRadius: 8, border: '1.5px solid #1a1a2e', fontSize: 15 }}>
              {categories.filter(c => c !== 'Todos').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, color: '#555', fontWeight: 600 }}>Precio por unidad (COP)</label>
              <input name="priceUnit" type="number" placeholder="Precio por unidad" value={product.priceUnit} onChange={handleChange} min={0} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #1a1a2e', fontSize: 15 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, color: '#555', fontWeight: 600 }}>Precio al por mayor (COP)</label>
              <input name="priceBulk" type="number" placeholder="Precio al por mayor (mínimo 50)" value={product.priceBulk} onChange={handleChange} min={0} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #1a1a2e', fontSize: 15 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, color: '#555', fontWeight: 600 }}>Cantidad en stock</label>
              <input name="stock" type="number" placeholder="Cantidad disponible" value={product.stock} onChange={handleChange} min={0} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #1a1a2e', fontSize: 15 }} />
            </div>
          </div>
          <textarea name="description" placeholder="Descripción" value={product.description} onChange={handleChange} style={{ width: '100%', marginBottom: 10, padding: 12, borderRadius: 8, border: '1.5px solid #1a1a2e', fontSize: 15, minHeight: 60 }} />
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontWeight: 600, color: '#16213e', marginBottom: 6, display: 'block' }}>Medidas disponibles:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, background: '#f8f9fa', borderRadius: 8, padding: '10px 12px', border: '1.5px solid #1a1a2e' }}>
              {medidasDisponibles.map(size => (
                <label key={size} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 500, color: '#1a1a2e', cursor: 'pointer' }}>
                  <input type="checkbox" checked={selectedSizes.includes(size)} onChange={() => handleSizeCheck(size)} style={{ accentColor: '#ffd700', width: 18, height: 18 }} />
                  {size}
                </label>
              ))}
            </div>
            {selectedSizes.length > 0 && (
              <div style={{ marginTop: 6, fontSize: 14, color: '#1a1a2e' }}>
                Seleccionadas: {selectedSizes.join(', ')}
              </div>
            )}
          </div>
          <input
            name="type"
            placeholder="Tipo (ej: Phillips, Allen)"
            value={product.specifications?.type || ''}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: 10, padding: 12, borderRadius: 8, border: '1.5px solid #1a1a2e', fontSize: 15 }}
          />
          <input
            name="material"
            placeholder="Material (ej: Acero, Inoxidable)"
            value={product.specifications?.material || ''}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: 10, padding: 12, borderRadius: 8, border: '1.5px solid #1a1a2e', fontSize: 15 }}
          />
          <div style={{ marginBottom: 10, textAlign: 'left' }}>
            <label style={{ fontSize: 13, color: '#555', fontWeight: 600, marginBottom: 4, display: 'block' }}>Imagen del producto</label>
            <input type="file" accept="image/*" onChange={handleImage} style={{ marginBottom: 6 }} />
            {preview && <img src={preview} alt="Vista previa" style={{ maxWidth: 120, marginTop: 8, borderRadius: 8, boxShadow: '0 2px 8px rgba(26,26,46,0.10)' }} />}
          </div>
          <div style={{ color: 'red', marginBottom: 10, minHeight: 18 }}>
            {Object.values(errors).map((err, i) => <div key={i}>{err}</div>)}
          </div>
          <div style={{ color: 'green', marginBottom: 10, minHeight: 18 }}>
            {successMsg}
          </div>
          <div style={{ color: 'red', marginBottom: 10, minHeight: 18 }}>
            {errorMsg}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" style={{ background: '#ffd700', color: '#222', fontWeight: 700, padding: '12px 0', border: 'none', borderRadius: 8, flex: 1, fontSize: 17, boxShadow: '0 2px 8px rgba(255,215,0,0.10)', transition: 'background 0.2s' }} disabled={submitting}>
              {submitting ? 'Agregando...' : 'Agregar'}
            </button>
            <button type="button" style={{ background: '#ccc', color: '#222', fontWeight: 700, padding: '12px 0', border: 'none', borderRadius: 8, flex: 1, fontSize: 17, boxShadow: '0 2px 8px rgba(26,26,46,0.06)', transition: 'background 0.2s' }} onClick={() => { setProduct(initialState); setPreview(''); setErrors({}) }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
} 