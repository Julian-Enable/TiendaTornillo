# 🛠️ TiendaTornillo - E-commerce de Tornillos y Herramientas

Una aplicación web moderna para la venta de tornillos, tuercas y herramientas, construida con React, TypeScript y Firebase.

## 🚀 Características Principales

- **Catálogo de Productos**: Amplia variedad de tornillos, tuercas, arandelas y herramientas
- **Sistema de Precios Dual**: Precio unitario y precio mayorista (50+ unidades)
- **Carrito de Compras**: Gestión completa de productos y cantidades
- **Autenticación de Usuarios**: Registro, login y perfiles personalizados
- **Panel de Administración**: Gestión completa de productos, usuarios y pedidos
- **Cotizaciones**: Guardar y gestionar cotizaciones por usuario
- **Integración WhatsApp**: Envío directo de cotizaciones
- **Base de Datos en Tiempo Real**: Firebase Firestore
- **Diseño Responsive**: Optimizado para móviles y desktop

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 + TypeScript + Vite
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Firebase Authentication
- **Routing**: React Router DOM
- **Estado**: Context API
- **Estilos**: CSS personalizado con tema espacial
- **Iconos**: React Icons

## 📦 Instalación

1. **Clonar el repositorio**:
```bash
git clone <url-del-repositorio>
cd TiendaTornillo
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar Firebase**:
   - Sigue las instrucciones en [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Configura las credenciales en `src/config/firebase.ts`

4. **Ejecutar la aplicación**:
```bash
npm run dev
```

## 🗄️ Base de Datos

La aplicación utiliza **Firebase Firestore** como base de datos principal:

### Colecciones:
- **`products`**: Catálogo de productos
- **`users`**: Usuarios registrados
- **`userProfiles`**: Perfiles extendidos de usuarios
- **`orders`**: Historial de pedidos
- **`quotations`**: Cotizaciones guardadas

### Características:
- **Tiempo Real**: Sincronización automática de datos
- **Escalabilidad**: Crece automáticamente con tu negocio
- **Seguridad**: Reglas de acceso configuradas
- **Backup**: Copias de seguridad automáticas

## 👤 Usuarios Iniciales

- **Administrador**: `admin@admin.com` / `admin123`
- **Demo**: `usuario@demo.com` / `demo123`

⚠️ **Importante**: Cambia estas contraseñas en producción.

## 🎨 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── context/            # Contextos de React (Auth, Cart)
├── data/               # Datos mock y tipos
├── hooks/              # Hooks personalizados
├── layouts/            # Layouts de la aplicación
├── pages/              # Páginas principales
├── services/           # Servicios de Firebase
├── utils/              # Utilidades y migración
└── config/             # Configuración de Firebase
```

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de producción
- `npm run lint` - Verificar código

## 🚀 Despliegue

La aplicación está lista para desplegar en:
- **Vercel** (recomendado)
- **Netlify**
- **Firebase Hosting**

## 📱 Funcionalidades por Rol

### 👥 Clientes
- Explorar catálogo de productos
- Agregar productos al carrito
- Guardar cotizaciones
- Ver historial de pedidos
- Gestionar perfil personal

### 👨‍💼 Administradores
- Gestión completa de productos
- Administración de usuarios
- Ver estadísticas de ventas
- Gestionar pedidos y cotizaciones
- Control de inventario

## 🔒 Seguridad

- Autenticación segura con Firebase
- Reglas de Firestore configuradas
- Validación de datos en frontend y backend
- Protección de rutas por rol

## 📞 Soporte

Para soporte técnico o preguntas:
- Revisa la documentación de Firebase
- Consulta los logs de la consola
- Verifica la configuración en `FIREBASE_SETUP.md`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
