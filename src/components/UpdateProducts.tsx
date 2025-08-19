import { useState } from 'react'
import { updateAllProducts } from '../utils/updateProducts'

function UpdateProducts() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpdate = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      await updateAllProducts()
      setMessage('✅ Productos actualizados correctamente')
    } catch (error) {
      setMessage('❌ Error al actualizar productos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      padding: '2rem',
      background: 'rgba(35,36,58,0.92)',
      borderRadius: '12px',
      margin: '2rem auto',
      maxWidth: '600px',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#ffd700', marginBottom: '1rem' }}>
        Actualizar Precios de Productos
      </h2>
      
      <p style={{ color: '#e0e0e0', marginBottom: '2rem' }}>
        Este proceso actualizará todos los productos con precios reales en COP y stock de 300 unidades.
      </p>
      
      <button
        onClick={handleUpdate}
        disabled={loading}
        style={{
          background: loading ? '#666' : '#ffd700',
          color: '#000',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Actualizando...' : 'Actualizar Productos'}
      </button>
      
      {message && (
        <div style={{
          marginTop: '1rem',
          padding: '12px',
          borderRadius: '8px',
          background: message.includes('✅') ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)',
          color: message.includes('✅') ? '#00ff00' : '#ff0000'
        }}>
          {message}
        </div>
      )}
      
      <div style={{
        marginTop: '2rem',
        textAlign: 'left',
        background: 'rgba(0,0,0,0.2)',
        padding: '1rem',
        borderRadius: '8px'
      }}>
        <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>Cambios que se aplicarán:</h4>
        <ul style={{ color: '#e0e0e0', fontSize: '14px' }}>
          <li>Precios unitarios actualizados a valores reales en COP</li>
          <li>Precios mayoristas (descuento del 10-15%)</li>
          <li>Stock de 300 unidades para todos los productos</li>
          <li>Precios basados en mercado colombiano</li>
        </ul>
      </div>
    </div>
  )
}

export default UpdateProducts
