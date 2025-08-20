import React from 'react'

interface ImageUploadProgressProps {
  isUploading: boolean
  progress?: number
}

const ImageUploadProgress: React.FC<ImageUploadProgressProps> = ({ isUploading, progress }) => {
  if (!isUploading) return null

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(26, 26, 46, 0.95)',
      padding: '2rem',
      borderRadius: '12px',
      border: '2px solid #ffd700',
      zIndex: 10000,
      textAlign: 'center',
      minWidth: '300px'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '1rem' }}>📤</div>
      <div style={{ color: '#ffd700', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        Subiendo imagen...
      </div>
      {progress !== undefined && (
        <div style={{ 
          width: '100%', 
          height: '8px', 
          background: 'rgba(255,255,255,0.2)', 
          borderRadius: '4px',
          overflow: 'hidden',
          marginTop: '1rem'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: '#ffd700',
            transition: 'width 0.3s ease'
          }} />
        </div>
      )}
      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '0.5rem' }}>
        Por favor espera...
      </div>
    </div>
  )
}

export default ImageUploadProgress
