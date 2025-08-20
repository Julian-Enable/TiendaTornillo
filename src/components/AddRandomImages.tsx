import { useState } from 'react'
import { addRandomImagesToProducts } from '../utils/addRandomImages'
import { analyzeProductImages, fixEmojiProducts } from '../utils/analyzeProductImages'

function AddRandomImages() {
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [message, setMessage] = useState('')

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true)
      setMessage('🔍 Analizando productos...')
      
      const analysis = await analyzeProductImages()
      
      setMessage(`📊 Análisis: ${analysis.total} productos | ✅ ${analysis.withValidImages} válidas | 🔧 ${analysis.withEmojis} con emojis | ❌ ${analysis.withoutImages} sin imagen`)
      
    } catch (error) {
      console.error('Error:', error)
      setMessage(`❌ Error analizando: ${error}`)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleFixEmojis = async () => {
    try {
      setLoading(true)
      setMessage('🔧 Corrigiendo productos con emojis/iconos...')
      
      const result = await fixEmojiProducts()
      
      setMessage(`✅ ${result.message}`)
      
      // Limpiar mensaje después de 8 segundos
      setTimeout(() => {
        setMessage('')
      }, 8000)
      
    } catch (error) {
      console.error('Error:', error)
      setMessage(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAddImages = async () => {
    try {
      setLoading(true)
      setMessage('🖼️ Actualizando todas las imágenes...')
      
      const result = await addRandomImagesToProducts()
      
      setMessage(`✅ ${result.message}`)
      
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        setMessage('')
      }, 5000)
      
    } catch (error) {
      console.error('Error:', error)
      setMessage(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'rgba(255, 215, 0, 0.1)',
      border: '2px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '12px',
      padding: '20px',
      margin: '20px 0'
    }}>
      <h3 style={{ color: '#ffd700', margin: '0 0 15px 0' }}>
        🖼️ Gestión de Imágenes de Productos
      </h3>
      
      <p style={{ color: '#e8e8e8', margin: '0 0 15px 0', fontSize: '14px' }}>
        Herramientas para analizar y corregir las imágenes de productos. 
        Primero analiza para ver el estado actual, luego corrige solo los productos con emojis/iconos.
      </p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
        <button 
          onClick={handleAnalyze}
          disabled={analyzing}
          style={{
            background: analyzing ? '#666' : 'linear-gradient(135deg, #3498db, #2980b9)',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: analyzing ? 'not-allowed' : 'pointer',
            fontWeight: '700',
            fontSize: '14px'
          }}
        >
          {analyzing ? '🔍 Analizando...' : '🔍 Analizar Productos'}
        </button>
        
        <button 
          onClick={handleFixEmojis}
          disabled={loading}
          style={{
            background: loading ? '#666' : 'linear-gradient(135deg, #e74c3c, #c0392b)',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '700',
            fontSize: '14px'
          }}
        >
          {loading ? '🔧 Corrigiendo...' : '🔧 Corregir Emojis'}
        </button>
        
        <button 
          onClick={handleAddImages}
          disabled={loading}
          style={{
            background: loading ? '#666' : 'linear-gradient(135deg, #ffd700, #ffed4e)',
            color: loading ? '#ccc' : '#1a1a2e',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '700',
            fontSize: '14px'
          }}
        >
          {loading ? '⏳ Actualizando...' : '🖼️ Todas las Imágenes'}
        </button>
      </div>
      
      {message && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: message.includes('✅') ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
          border: `1px solid ${message.includes('✅') ? '#2ecc71' : '#e74c3c'}`,
          borderRadius: '6px',
          color: message.includes('✅') ? '#2ecc71' : '#e74c3c',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}
    </div>
  )
}

export default AddRandomImages
