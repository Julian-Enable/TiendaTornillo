# Configuración de Índices de Firestore

## Problema
Las consultas de Firestore requieren índices compuestos para funcionar correctamente. Sin estos índices, verás errores como:
- "The query requires an index"
- "Missing or insufficient permissions"

## Solución

### 1. Ir a Firebase Console
1. Abre https://console.firebase.google.com
2. Selecciona tu proyecto "tienda-tornillo"
3. Ve a **Firestore Database** > **Índices**

### 2. Crear Índices Manualmente

#### Índice para Cotizaciones:
- **Colección**: `quotations`
- **Campos**:
  - `userId` (Ascending)
  - `createdAt` (Descending)

#### Índice para Pedidos:
- **Colección**: `orders`
- **Campos**:
  - `userId` (Ascending)
  - `createdAt` (Descending)

#### Índice para Perfiles de Usuario:
- **Colección**: `userProfiles`
- **Campos**:
  - `userId` (Ascending)

#### Índice para Productos:
- **Colección**: `products`
- **Campos**:
  - `category` (Ascending)
  - `name` (Ascending)

### 3. Usar Firebase CLI (Alternativa)

Si tienes Firebase CLI instalado:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Inicializar proyecto
firebase init firestore

# Desplegar índices
firebase deploy --only firestore:indexes
```

### 4. Verificar Índices

Los índices pueden tardar unos minutos en crearse. Puedes verificar el estado en:
- Firebase Console > Firestore Database > Índices
- El estado cambiará de "Building" a "Enabled"

### 5. Probar la Aplicación

Una vez que los índices estén creados:
1. Recarga la aplicación
2. Ve a tu perfil
3. Las cotizaciones deberían cargar correctamente

## Nota Importante

Los índices son necesarios para consultas que:
- Filtran por múltiples campos
- Ordenan por campos diferentes a los filtros
- Combinan filtros con ordenamiento

Sin estos índices, Firestore no puede ejecutar las consultas de manera eficiente.
