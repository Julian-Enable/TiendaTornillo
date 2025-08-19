# Configuración de Firebase para TiendaTornillo

## 📋 Requisitos Previos

1. Tener una cuenta de Google
2. Acceso a [Firebase Console](https://console.firebase.google.com/)

## 🚀 Pasos para Configurar Firebase

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Ingresa el nombre del proyecto: `tienda-tornillo` (o el nombre que prefieras)
4. Puedes desactivar Google Analytics por ahora
5. Haz clic en "Crear proyecto"

### 2. Habilitar Firestore Database

1. En el panel de Firebase, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (para desarrollo)
4. Elige la ubicación más cercana (ej: `us-central1`)
5. Haz clic en "Listo"

### 3. Habilitar Authentication

1. Ve a "Authentication" en el panel lateral
2. Haz clic en "Comenzar"
3. Ve a la pestaña "Sign-in method"
4. Habilita "Correo electrónico/contraseña"
5. Haz clic en "Guardar"

### 4. Obtener Configuración

1. Ve a "Configuración del proyecto" (ícono de engranaje)
2. Haz clic en "Configuración del proyecto"
3. En la sección "Tus apps", haz clic en el ícono de web (</>)
4. Registra la app con el nombre "TiendaTornillo"
5. Copia la configuración que aparece

### 5. Configurar el Proyecto

1. Abre el archivo `src/config/firebase.ts`
2. Reemplaza la configuración de ejemplo con la tuya:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyDHmbIHvxC6GWCajLVvUjh40umlN1Nua08",
  authDomain: "tienda-tornillo.firebaseapp.com",
  projectId: "tienda-tornillo",
  storageBucket: "tienda-tornillo.firebasestorage.app",
  messagingSenderId: "2514094483",
  appId: "1:2514094483:web:06cf4ecdb9d7cd53354066"
};
```

### 6. Configurar Reglas de Firestore

1. Ve a "Firestore Database" > "Reglas"
2. Reemplaza las reglas con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura de productos a todos
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Permitir acceso a usuarios solo a su propio documento
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
    
    // Permitir acceso a perfiles de usuario
    match /userProfiles/{profileId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
    
    // Permitir acceso a pedidos
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
    
    // Permitir acceso a cotizaciones
    match /quotations/{quotationId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
  }
}
```

### 7. Crear Usuarios Iniciales

1. Ve a "Authentication" > "Users"
2. Haz clic en "Agregar usuario"
3. Crea el usuario administrador:
   - Email: `admin@admin.com`
   - Contraseña: `admin123` (cambia esto por seguridad)
4. Crea el usuario demo:
   - Email: `usuario@demo.com`
   - Contraseña: `demo123`

### 8. Ejecutar la Aplicación

1. Ejecuta `npm run dev`
2. La aplicación mostrará un setup inicial
3. Haz clic en "Iniciar Configuración" para migrar los datos
4. ¡Listo! Tu aplicación está conectada a Firebase

## 🔧 Estructura de la Base de Datos

### Colecciones en Firestore:

- **`products`**: Productos del catálogo
- **`users`**: Usuarios registrados
- **`userProfiles`**: Perfiles extendidos de usuarios
- **`orders`**: Pedidos realizados
- **`quotations`**: Cotizaciones guardadas

### Índices Necesarios:

Firebase creará automáticamente los índices necesarios, pero si ves errores, puedes crearlos manualmente en la consola de Firebase.

## 🛡️ Seguridad

- Las reglas de Firestore están configuradas para permitir:
  - Lectura pública de productos
  - Acceso privado a datos de usuario
  - Acceso de administradores a todos los datos
- Cambia las contraseñas de los usuarios iniciales
- Considera habilitar autenticación adicional (Google, Facebook, etc.)

## 🚨 Solución de Problemas

### Error de configuración:
- Verifica que la configuración en `firebase.ts` sea correcta
- Asegúrate de que el proyecto esté creado en Firebase

### Error de permisos:
- Verifica las reglas de Firestore
- Asegúrate de que el usuario esté autenticado

### Error de migración:
- Verifica que Firestore esté habilitado
- Revisa la consola del navegador para errores específicos

## 📞 Soporte

Si tienes problemas con la configuración, revisa:
1. La consola del navegador para errores
2. Los logs de Firebase Console
3. La documentación oficial de Firebase
