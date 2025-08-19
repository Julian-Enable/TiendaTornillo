import { useState, useEffect } from 'react'
import { runMigration, checkExistingData } from '../utils/migration'
import Toast from './Toast'

interface FirebaseSetupProps {
  onComplete: () => void
}

function FirebaseSetup({ onComplete }: FirebaseSetupProps) {
  const [loading, setLoading] = useState(true)
  const [migrating, setMigrating] = useState(false)
  const [hasData, setHasData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkData()
  }, [])

  const checkData = async () => {
    try {
      setLoading(true)
      const dataStatus = await checkExistingData()
      setHasData(dataStatus.hasUsers && dataStatus.hasProducts)
      
      if (dataStatus.hasUsers && dataStatus.hasProducts) {
        // Si ya hay datos, completar setup inmediatamente sin mostrar mensaje
        onComplete()
      }
    } catch (error) {
      console.error('Error al verificar datos:', error)
      setError('Error al verificar configuración de base de datos')
    } finally {
      setLoading(false)
    }
  }

  const handleMigration = async () => {
    try {
      setMigrating(true)
      setError(null)
      await runMigration()
      setHasData(true)
      // Completar inmediatamente después de la migración exitosa
      onComplete()
    } catch (error) {
      console.error('Error en migración:', error)
      setError('Error al migrar datos. Verifica la configuración de Firebase.')
    } finally {
      setMigrating(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(20,22,40,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}>
        <div style={{
          background: 'rgba(34,36,58,0.95)',
          borderRadius: 16,
          padding: 32,
          textAlign: 'center',
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(31,38,135,0.18)',
          border: '1.5px solid rgba(255,255,255,0.13)'
        }}>
          <h2 style={{ color: '#ffd700', marginBottom: 16 }}>Configurando Base de Datos</h2>
          <p style={{ color: '#f5f7fa', marginBottom: 24 }}>Verificando configuración...</p>
          <div style={{ width: 40, height: 40, border: '3px solid #ffd700', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
        </div>
      </div>
    )
  }

  if (hasData) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(20,22,40,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}>
        <div style={{
          background: 'rgba(34,36,58,0.95)',
          borderRadius: 16,
          padding: 32,
          textAlign: 'center',
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(31,38,135,0.18)',
          border: '1.5px solid rgba(255,255,255,0.13)'
        }}>
          <h2 style={{ color: '#ffd700', marginBottom: 16 }}>✅ Base de Datos Configurada</h2>
          <p style={{ color: '#f5f7fa' }}>Iniciando aplicación...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(20,22,40,0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        background: 'rgba(34,36,58,0.95)',
        borderRadius: 16,
        padding: 32,
        textAlign: 'center',
        maxWidth: 500,
        boxShadow: '0 8px 32px rgba(31,38,135,0.18)',
        border: '1.5px solid rgba(255,255,255,0.13)'
      }}>
        <h2 style={{ color: '#ffd700', marginBottom: 16 }}>Configuración Inicial</h2>
        <p style={{ color: '#f5f7fa', marginBottom: 24 }}>
          Es la primera vez que ejecutas la aplicación. Necesitamos configurar la base de datos con datos iniciales.
        </p>
        
        {error && (
          <div style={{
            background: 'rgba(255,68,68,0.2)',
            border: '1px solid #ff4444',
            borderRadius: 8,
            padding: 12,
            marginBottom: 24,
            color: '#ff4444'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#ffd700', marginBottom: 12 }}>Datos que se cargarán:</h3>
          <ul style={{ textAlign: 'left', color: '#f5f7fa', listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: 8 }}>• 15 productos de ejemplo (tornillos, tuercas, herramientas)</li>
            <li style={{ marginBottom: 8 }}>• 2 usuarios iniciales (admin y demo)</li>
            <li style={{ marginBottom: 8 }}>• Categorías de productos</li>
          </ul>
        </div>
        
        <button
          onClick={handleMigration}
          disabled={migrating}
          style={{
            background: migrating ? '#666' : '#ffd700',
            color: '#1a1a2e',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: 16,
            fontWeight: 'bold',
            cursor: migrating ? 'not-allowed' : 'pointer',
            marginRight: 12
          }}
        >
          {migrating ? 'Configurando...' : 'Iniciar Configuración'}
        </button>
        
        {migrating && (
          <div style={{ marginTop: 16 }}>
            <div style={{ width: 30, height: 30, border: '3px solid #ffd700', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
            <p style={{ color: '#f5f7fa', marginTop: 12 }}>Migrando datos...</p>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default FirebaseSetup
