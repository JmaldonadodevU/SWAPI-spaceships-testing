# 🚀 SWAPI Starships Explorer

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Responsive](https://img.shields.io/badge/Responsive-Yes-brightgreen)
![API](https://img.shields.io/badge/API-SWAPI-orange)

<p align="center">
  <img src="https://starwars-visualguide.com/assets/img/starships/5.jpg" alt="Star Destroyer" width="300"/>
</p>

## ✨ Descripción

**SWAPI Starships Explorer** es una aplicación web interactiva que permite explorar las naves espaciales del universo de Star Wars. Utilizando la [Star Wars API (SWAPI)](https://swapi.info/), esta aplicación ofrece una interfaz atractiva para descubrir información detallada sobre las embarcaciones galácticas más icónicas.

## 🎯 Características

- **🔍 Exploración por Facciones**: Visualiza naves por Imperio Galáctico, Alianza Rebelde, República o Separatistas
- **⭐ Sistema de Favoritos**: Guarda tus naves preferidas para acceso rápido
- **🔐 Autenticación**: Sincroniza tus favoritos entre dispositivos mediante Firebase
- **🔎 Búsqueda Avanzada**: Encuentra naves por nombre, modelo o fabricante
- **📱 Diseño Responsive**: Experiencia optimizada en móviles, tablets y escritorio
- **🎨 Temas Visuales**: Estilos únicos para cada facción de Star Wars

## 💻 Tecnologías

- HTML5, CSS3 y JavaScript ES6+
- Firebase Authentication y Firestore
- Star Wars API (SWAPI)
- Módulos ES6
- LocalStorage para persistencia de datos

## 🚀 Inicio Rápido

```bash
# Clonar el repositorio
git clone https://github.com/username/SWAPI-spaceships.git

# Navegar al directorio
cd SWAPI-spaceships

# Abrir en el navegador
open index.html   # En macOS
xdg-open index.html   # En Linux
start index.html  # En Windows
```

## 📋 Estructura del Proyecto

```
SWAPI-spaceships/
├── index.html           # Archivo HTML principal
├── README.md            # Este archivo
├── css/
│   └── indexStyles.css  # Estilos CSS
└── js/
    ├── app.js           # Clase principal de la aplicación
    ├── main.js          # Punto de entrada
    ├── config/          # Configuraciones
    ├── services/        # Servicios de datos y API
    └── ui/              # Componentes de interfaz
```

## 📷 Capturas de Pantalla

<p align="center">
  <img src="https://via.placeholder.com/400x200?text=Vista+Principal" width="400" alt="Vista Principal"/>
  <img src="https://via.placeholder.com/400x200?text=Detalles+de+Nave" width="400" alt="Detalles de Nave"/>
</p>

## 🛠️ Configuración

### Firebase

Para habilitar la autenticación y los favoritos en la nube:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Activa Authentication con método de email
3. Crea una base de datos Firestore
4. Copia tus credenciales y reemplázalas en `js/services/authService.js`
   ```js
   // Ejemplo de estructura a reemplazar
   const firebaseConfig = {
       apiKey: "TU_API_KEY",
       authDomain: "tu-proyecto.firebaseapp.com",
       projectId: "tu-proyecto",
       storageBucket: "tu-proyecto.appspot.com",
       messagingSenderId: "000000000000",
       appId: "1:000000000000:web:000000000000"
   };

## 3. Implementa un mecanismo de carga de configuración

Para facilitar el desarrollo, considera implementar un mecanismo de detección automática:

```js
// Intenta cargar configuración desde un archivo local que esté en .gitignore
let firebaseConfig;

try {
    // Si existe un archivo config.local.js, úsalo (este archivo no se subiría a GitHub)
    firebaseConfig = window.localFirebaseConfig || {
        apiKey: "TU_API_KEY",
        authDomain: "tu-proyecto.firebaseapp.com",
        projectId: "tu-proyecto",
        storageBucket: "tu-proyecto.appspot.com",
        messagingSenderId: "000000000000",
        appId: "1:000000000000:web:000000000000"
    };
} catch (e) {
    console.error("Error cargando configuración:", e);
}

/**
 * ⚠️ IMPORTANTE: SEGURIDAD ⚠️
 * 
 * Este archivo contiene configuraciones de Firebase.
 * Antes de subir a un repositorio público:
 * 1. Reemplaza estos valores con placeholders
 * 2. En producción, protege tus claves con restricciones de dominio
 * 3. Para desarrollo local, crea un archivo config.local.js (añádelo a .gitignore)
 */

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, considera los siguientes pasos:

1. 🍴 Haz un Fork del proyecto
2. 🔄 Crea una rama para tu feature (`git checkout -b feature/amazing`)
3. 📝 Realiza tus cambios
4. 🔍 Asegúrate que todo funciona correctamente
5. ⬆️ Haz un push a la rama (`git push origin feature/amazing`)
6. 🔀 Abre un Pull Request

## 📜 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👏 Agradecimientos

- [Star Wars API](https://swapi.info/) por los datos de naves
- [Lucasfilm](https://www.lucasfilm.com/) por crear el universo de Star Wars
- [Firebase](https://firebase.google.com/) por las herramientas de backend

---

<p align="center">
  Desarrollado con ❤️ por <a href="https://github.com/username">Tu Nombre</a>
</p>

<p align="center">
  <a href="#-características">Características</a> •
  <a href="#-inicio-rápido">Inicio Rápido</a> •
  <a href="#-contribución">Contribución</a> •
  <a href="#-licencia">Licencia</a>
</p>