import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getQuotationsByUser, deleteQuotation } from '../services/orderService'

function TestDeleteQuotations() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [quotations, setQuotations] = useState<any[]>([])

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

  const handleDelete = async (id: string) => {
    if (!user?.id) return

    try {
      setLoading(true)
      await deleteQuotation(id)
      setMessage(`✅ Cotización eliminada: ${id}`)
      // Recargar cotizaciones
      await loadQuotations()
    } catch (error) {
      console.error('Error al eliminar cotización:', error)
      setMessage(`❌ Error al eliminar: ${error}`)
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
        Prueba de Eliminación de Cotizaciones
      </h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#e0e0e0', marginBottom: '1rem' }}>
          Usuario: {user?.name} ({user?.email})
        </p>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
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
          <h4 style={{ color: '#ffd700', marginBottom: '1rem' }}>Cotizaciones Disponibles:</h4>
          {quotations.map((q, index) => (
            <div key={q.id} style={{
              border: '1px solid #333',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ color: '#fff', fontWeight: 'bold' }}>ID: {q.id}</p>
                <p style={{ color: '#e0e0e0' }}>Nombre: {q.name}</p>
                <p style={{ color: '#e0e0e0' }}>Total: ${q.total?.toFixed(2)}</p>
                <p style={{ color: '#e0e0e0' }}>Items: {q.items?.length || 0}</p>
                <p style={{ color: '#e0e0e0' }}>Fecha: {q.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}</p>
              </div>
              <button
                onClick={() => handleDelete(q.id)}
                disabled={loading}
                style={{
                  background: loading ? '#666' : '#ff4444',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TestDeleteQuotations
