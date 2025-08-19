import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { createQuotation, getQuotationsByUser } from '../services/orderService'

function TestQuotations() {
  const { user } = useAuth()
  const { items, getTotalPrice } = useCart()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [quotations, setQuotations] = useState<any[]>([])

  const testSaveQuotation = async () => {
    if (!user?.id || items.length === 0) {
      setMessage('❌ No hay productos en el carrito o usuario no autenticado')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const orderItems = items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        priceUnit: item.product.priceUnit,
        priceBulk: item.product.priceBulk,
        total: item.quantity >= 50 ? item.product.priceBulk * item.quantity : item.product.priceUnit * item.quantity
      }))

      const quotationData = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        name: `Cotización de prueba - ${new Date().toLocaleString()}`,
        items: orderItems,
        total: getTotalPrice(),
        status: 'saved'
      }

      const quotationId = await createQuotation(quotationData)
      setMessage(`✅ Cotización guardada con ID: ${quotationId}`)
      
      // Cargar cotizaciones para verificar
      await loadQuotations()
    } catch (error) {
      console.error('Error al guardar cotización:', error)
      setMessage(`❌ Error al guardar: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const loadQuotations = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const quotes = await getQuotationsByUser(user.id)
      setQuotations(quotes)
      setMessage(`📋 Cotizaciones cargadas: ${quotes.length}`)
    } catch (error) {
      console.error('Error al cargar cotizaciones:', error)
      setMessage(`❌ Error al cargar: ${error}`)
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
      maxWidth: '800px',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#ffd700', marginBottom: '1rem' }}>
        Prueba de Cotizaciones
      </h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#e0e0e0', marginBottom: '1rem' }}>
          Usuario: {user?.name} ({user?.email})
        </p>
        <p style={{ color: '#e0e0e0', marginBottom: '1rem' }}>
          Productos en carrito: {items.length}
        </p>
        <p style={{ color: '#e0e0e0', marginBottom: '1rem' }}>
          Total del carrito: ${getTotalPrice().toFixed(2)}
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
        <button
          onClick={testSaveQuotation}
          disabled={loading || items.length === 0}
          style={{
            background: loading || items.length === 0 ? '#666' : '#ffd700',
            color: '#000',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading || items.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Guardando...' : 'Guardar Cotización de Prueba'}
        </button>
        
        <button
          onClick={loadQuotations}
          disabled={loading}
          style={{
            background: loading ? '#666' : '#4CAF50',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Cargando...' : 'Cargar Cotizaciones'}
        </button>
      </div>
      
      {message && (
        <div style={{
          marginBottom: '2rem',
          padding: '12px',
          borderRadius: '8px',
          background: message.includes('✅') ? 'rgba(0,255,0,0.1)' : 
                     message.includes('❌') ? 'rgba(255,0,0,0.1)' : 'rgba(0,0,255,0.1)',
          color: message.includes('✅') ? '#00ff00' : 
                 message.includes('❌') ? '#ff0000' : '#0088ff'
        }}>
          {message}
        </div>
      )}
      
      {quotations.length > 0 && (
        <div style={{
          textAlign: 'left',
          background: 'rgba(0,0,0,0.2)',
          padding: '1rem',
          borderRadius: '8px'
        }}>
          <h4 style={{ color: '#ffd700', marginBottom: '1rem' }}>Cotizaciones Guardadas:</h4>
          {quotations.map((q, index) => (
            <div key={q.id} style={{
              border: '1px solid #333',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)'
            }}>
              <p style={{ color: '#fff', fontWeight: 'bold' }}>ID: {q.id}</p>
              <p style={{ color: '#e0e0e0' }}>Nombre: {q.name}</p>
              <p style={{ color: '#e0e0e0' }}>Total: ${q.total?.toFixed(2)}</p>
              <p style={{ color: '#e0e0e0' }}>Items: {q.items?.length || 0}</p>
              <p style={{ color: '#e0e0e0' }}>Fecha: {q.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TestQuotations
