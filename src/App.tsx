import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Productos from './pages/Productos.tsx'
import Carrito from './pages/Carrito.tsx'
import Registro from './pages/Registro.tsx'
import Login from './pages/Login.tsx'
import Perfil from './pages/Perfil.tsx'
import Contacto from './pages/Contacto'
import SobreNosotros from './pages/SobreNosotros'
import Ubicacion from './pages/Ubicacion'
import AdminPage from './pages/Admin'
import AgregarProducto from './pages/AgregarProducto'
import ProductoDetalle from './pages/ProductoDetalle'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Productos />} />
        <Route path="producto/:id" element={<ProductoDetalle />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="registro" element={<Registro />} />
        <Route path="login" element={<Login />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="sobre-nosotros" element={<SobreNosotros />} />
        <Route path="ubicacion" element={<Ubicacion />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/agregar-producto" element={<AgregarProducto />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default App
