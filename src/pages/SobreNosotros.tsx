import { useSeo } from '../hooks/useSeo'

function SobreNosotros() {
  useSeo({
    title: 'Sobre Nosotros | Tienda de Tornillos',
    description: 'Conoce la historia, misión y valores de nuestra tienda. Somos expertos en tornillos, herramientas y materiales para tus proyectos.'
  })
  return <h1 style={{ color: '#fff', textShadow: '0 2px 12px #0a1026, 0 1px 0 #222', margin: '2rem 0 0 2rem', fontSize: '2.5rem' }}>Página Sobre Nosotros</h1>
}
export default SobreNosotros 