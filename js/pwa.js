// Código para registrar el Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Usar ruta relativa o con el prefijo correcto
    const swPath = location.pathname.includes('/SWAPI-spaceships') 
      ? '/SWAPI-spaceships/service-worker.js'
      : '/service-worker.js';
      
    navigator.serviceWorker.register(swPath)
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration.scope);
      })
      .catch(error => {
        console.error('Error al registrar el Service Worker:', error);
      });
  });
}

// Código para manejar la instalación de la PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevenir la aparición automática del prompt
  e.preventDefault();
  // Guardar el evento para activarlo más tarde
  deferredPrompt = e;
  
  // Opcional: Mostrar tu propio botón de instalación
  const installButton = document.createElement('button');
  installButton.id = 'install-button';
  installButton.textContent = 'Instalar App';
  installButton.className = 'install-button';
  installButton.style.cssText = `
    position: fixed;
    bottom: 85px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #2196F3;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 14px;
    z-index: 100;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  `;   
  
  // Añadir el botón solo si no existe ya
  if (!document.getElementById('install-button')) {
    document.body.appendChild(installButton);
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        // Mostrar el prompt de instalación
        deferredPrompt.prompt();
        // Esperar a que el usuario responda
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);
        // Limpiar la referencia
        deferredPrompt = null;
        // Ocultar el botón
        installButton.style.display = 'none';
      }
    });
  }
});

window.addEventListener('appinstalled', () => {
  console.log('PWA fue instalada');
  // Ocultar el botón de instalación si existe
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'none';
  }
});