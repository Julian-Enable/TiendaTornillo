# 🔥 Desplegar Reglas de Firestore

## Problema identificado
El proyecto no tiene reglas de Firestore configuradas, lo que impide la creación de usuarios y otras operaciones de escritura.

## Solución

### 1. Instalar Firebase CLI (si no lo tienes)
```bash
npm install -g firebase-tools
```

### 2. Iniciar sesión en Firebase
```bash
firebase login
```

### 3. Inicializar Firebase en el proyecto (si no está inicializado)
```bash
firebase init firestore
```

### 4. Desplegar las reglas de Firestore
```bash
firebase deploy --only firestore:rules
```

### 5. Verificar el despliegue
```bash
firebase firestore:rules:get
```

## Reglas creadas

He creado el archivo `firestore.rules` con las siguientes reglas:

- **Usuarios**: Permitir creación y lectura/escritura para usuarios autenticados
- **Perfiles**: Permitir creación y gestión de perfiles de usuario
- **Productos**: Lectura pública, escritura solo para administradores
- **Pedidos**: Gestión por propietario o administradores
- **Cotizaciones**: Gestión por propietario o administradores

## Prueba después del despliegue

1. Intenta crear un nuevo usuario
2. Verifica en la consola del navegador los logs detallados
3. Confirma que el usuario se crea tanto en Auth como en Firestore

## Comandos útiles

```bash
# Ver logs en tiempo real
firebase firestore:rules:get

# Verificar estado del proyecto
firebase projects:list

# Ver configuración actual
firebase use
```
