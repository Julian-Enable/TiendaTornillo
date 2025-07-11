import { useNavigate } from 'react-router-dom'
import { useSeo } from '../hooks/useSeo'

function NotFound() {
  useSeo({
    title: 'Página no encontrada | Tienda de Tornillos',
    description: 'La página que buscas no existe. Vuelve al inicio o navega por nuestro catálogo de productos.'
  })
  const navigate = useNavigate()
  return (
    <div className="productos-container" style={{textAlign: 'center', padding: '4rem 1rem'}}>
      <h1 style={{fontSize: '3rem', color: '#ffd700', marginBottom: '1.5rem'}}>404</h1>
      <p style={{fontSize: '1.3rem', color: '#fff', marginBottom: '2rem'}}>¡Ups! La página que buscas no existe.</p>
      <button className="add-to-cart-btn" onClick={() => navigate('/')}>Ir al Inicio</button>
      <button className="add-to-cart-btn" style={{marginLeft: '1rem'}} onClick={() => navigate('/productos')}>Ver Productos</button>
    </div>
  )
}

export default NotFound 