# 🔧 Configuración de Firebase Storage

## ❌ PROBLEMA ACTUAL
El error "Missing or insufficient permissions" indica que Firebase Storage no tiene permisos configurados.

## ✅ SOLUCIÓN

### 1. Ir a Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `tienda-tornillo`
3. En el menú lateral, ve a **Storage**

### 2. Configurar Storage (si no está inicializado)
1. Si ves "Get started", haz clic en **Get started**
2. Selecciona **Start in test mode** (modo de prueba)
3. Selecciona la ubicación más cercana (ej: `us-central1`)
4. Haz clic en **Done**

### 3. Aplicar las Reglas de Seguridad
1. En Storage, ve a la pestaña **Rules**
2. Reemplaza todo el contenido con las reglas del archivo `firestore-storage.rules`
3. Haz clic en **Publish**

### 4. Verificar Configuración
1. Asegúrate de que el `storageBucket` en `src/config/firebase.ts` sea correcto
2. Debe ser: `"tienda-tornillo.appspot.com"`

## 🧪 PRUEBA
Después de aplicar las reglas:
1. Recarga la página del panel de administración
2. Haz clic en **"🧪 Probar Storage"**
3. Debería funcionar sin errores

## 📋 REGLAS APLICADAS
- ✅ **Lectura pública**: Cualquiera puede ver las imágenes
- ✅ **Escritura autenticada**: Solo usuarios logueados pueden subir
- ✅ **Seguridad**: Todo lo demás está bloqueado
