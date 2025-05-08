import { ShipService } from './services/shipService.js';
import { FavoriteService } from './services/favoriteService.js';
import { Navigation } from './ui/navigation.js';
import { ShipCards } from './ui/shipCards.js';
import { ShipDetails } from './ui/shipDetails.js';
import { CategoryUI } from './ui/categoryUI.js';
import { AuthService } from './services/authService.js';  // Importamos el nuevo servicio
import { ShipComparison } from './ui/shipComparison.js';  // Importar el componente de comparación

// Clase principal de la aplicación
export class StarWarsApp {
    constructor() {
        // Elementos del DOM
        this.shipsContainer = document.getElementById('ships-container');
        this.shipCardTemplate = document.getElementById('ship-card-template');
        this.menuButtons = document.querySelectorAll('.menu .button');
        
        // Estado de la aplicación
        this.currentPage = 'home';
        this.currentShipId = null;
        this.favorites = FavoriteService.loadFavorites();
        this.shipToCompare = null;
        
        // Enlazar métodos al contexto actual
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.showShipDetails = this.showShipDetails.bind(this);
        this.toggleFavorite = this.toggleFavorite.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.updateAuthUI = this.updateAuthUI.bind(this);
        this.handleLoadCategory = this.handleLoadCategory.bind(this);
        this.addShipToComparison = this.addShipToComparison.bind(this);
        this.toggleComparisonMode = this.toggleComparisonMode.bind(this);
    }
    
    // Inicializar la aplicación
    init() {
        // Inicializa el servicio de autenticación
        AuthService.init();
        AuthService.enhanceLoginForm(); // Añadir esta línea
        
        // Inicializar el componente de comparación
        ShipComparison.init();
        
        this.setupEventListeners();
        this.loadShips('home');
        
        // Escuchar cambios en el estado de autenticación
        document.addEventListener('authStateChanged', this.updateAuthUI);
        
        // Escuchar eventos de cambio de categoría (para los nuevos botones)
        document.addEventListener('loadCategory', this.handleLoadCategory);
    }
    
    // Manejar el evento de cargar una categoría
    handleLoadCategory(event) {
        const { category } = event.detail;
        this.loadShips(category);
    }
    
    // Actualizar la UI basada en el estado de autenticación
    updateAuthUI(event) {
        const user = event?.detail?.user || AuthService.currentUser;
        const loginButton = document.getElementById('login-button');
        
        if (user) {
            // Usuario autenticado
            loginButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            `;
            loginButton.title = `Hola, ${user.email}`;
            
            // Mostrar botón de logout en la página de login
            const loginPage = document.getElementById('login-page');
            if (!document.getElementById('logout-button')) {
                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'logout-button';
                logoutBtn.className = 'login-submit-btn';
                logoutBtn.style.backgroundColor = '#666';
                logoutBtn.textContent = 'Cerrar Sesión';
                logoutBtn.addEventListener('click', async () => {
                    try {
                        await AuthService.logout();
                        alert('Has cerrado sesión correctamente');
                        Navigation.navigateToPage('ships-container');
                    } catch (error) {
                        alert(error.message);
                    }
                });
                loginPage.querySelector('.login-form').appendChild(logoutBtn);
            }
        } else {
            // Usuario no autenticado
            loginButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            `;
            loginButton.title = 'Iniciar Sesión';
            
            // Ocultar botón de logout
            const logoutBtn = document.getElementById('logout-button');
            if (logoutBtn) {
                logoutBtn.remove();
            }
        }
    }
    
    // Configurar todos los escuchadores de eventos
    setupEventListeners() {
        // Botones del menú
        this.menuButtons.forEach(button => {
            button.addEventListener('click', this.handleMenuClick);
        });
        
        // Botón de volver en la página de detalles
        document.getElementById('back-to-list').addEventListener('click', () => {
            this.loadShips(this.currentPage);
        });
        
        // Botón de favoritos
        document.getElementById('favorite-button').addEventListener('click', this.toggleFavorite);
        
        // Botón de modo comparación en la página de detalles
        document.getElementById('compare-button').addEventListener('click', this.addShipToComparison);
        
        // Botón para activar/desactivar el modo comparación
        document.getElementById('comparison-mode-button').addEventListener('click', this.toggleComparisonMode);
        
        // Botón para limpiar la comparación
        document.getElementById('clear-comparison-button').addEventListener('click', () => {
            ShipComparison.clearComparison();
            document.getElementById('comparison-status').textContent = '';
            document.getElementById('clear-comparison-button').style.display = 'none';
        });
        
        // Botón de inicio de sesión
        document.getElementById('login-button').addEventListener('click', () => {
            Navigation.navigateToPage('login-page');
        });
        
        // Volver desde la página de login
        document.getElementById('back-from-login').addEventListener('click', () => {
            Navigation.navigateToPage('ships-container');
        });
        
        // Botón de cerrar comparación
        document.getElementById('comparison-close-btn').addEventListener('click', () => {
            Navigation.navigateToPage('ships-container');
        });
        
        // Formulario de login - reemplazamos por la nueva función
        document.getElementById('login-form').addEventListener('submit', this.handleLoginSubmit);
    }
    
    // Activar/desactivar modo comparación
    toggleComparisonMode() {
        const button = document.getElementById('comparison-mode-button');
        const isActive = button.classList.contains('active');
        
        if (isActive) {
            // Desactivar modo comparación
            button.classList.remove('active');
            button.title = 'Activar modo comparación';
            document.body.classList.remove('comparison-mode');
            
            // Limpiar selección actual
            ShipComparison.clearComparison();
            document.getElementById('comparison-status').textContent = '';
            document.getElementById('clear-comparison-button').style.display = 'none';
        } else {
            // Activar modo comparación
            button.classList.add('active');
            button.title = 'Desactivar modo comparación';
            document.body.classList.add('comparison-mode');
            
            // Mostrar instrucciones
            document.getElementById('comparison-status').textContent = 'Selecciona 2 naves para comparar';
            document.getElementById('clear-comparison-button').style.display = 'inline-block';
        }
    }
    
    // Añadir nave actual a la comparación
    addShipToComparison() {
        // Si estamos en la página de detalles, añadir la nave actual
        if (this.currentShipId) {
            ShipService.loadShip(this.currentShipId).then(shipData => {
                const readyToCompare = ShipComparison.addShipToComparison(
                    this.currentShipId, 
                    shipData
                );
                
                // Actualizar texto de estado
                const statusEl = document.getElementById('comparison-status');
                if (statusEl) {
                    const count = ShipComparison.selectedShips.length;
                    
                    if (count === 1) {
                        statusEl.textContent = '1 nave seleccionada. Selecciona otra nave para comparar.';
                    }
                    
                    // Si ya tenemos 2 naves, mostrar la comparación
                    if (readyToCompare) {
                        statusEl.textContent = '¡2 naves seleccionadas!';
                        ShipComparison.showComparison();
                    }
                }
                
                // Mostrar el botón de limpiar
                document.getElementById('clear-comparison-button').style.display = 'inline-block';
            });
        }
    }
    
    // Manejar envío del formulario de login
    async handleLoginSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('username').value;
        
        try {
            // En el modo de prueba, solo necesitamos el email para Firestore
            await AuthService.login(email);
            alert('Datos guardados correctamente en Firestore');
            
            // Refrescar favoritos si hay nuevos datos
            this.favorites = FavoriteService.loadFavorites();
            
            // Volver a la página principal
            Navigation.navigateToPage('ships-container');
        } catch (error) {
            this.showErrorMessage('Error al guardar datos: ' + error.message);
        }
    }
    
    // Añadir este método a la clase StarWarsApp después de handleLoginSubmit
    showErrorMessage(message) {
        // Eliminar mensaje anterior si existe
        const oldError = document.getElementById('auth-error');
        if (oldError) oldError.remove();
        
        // Crear nuevo mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.id = 'auth-error';
        errorDiv.style.backgroundColor = '#ff00004d';
        errorDiv.style.color = 'darkred';
        errorDiv.style.padding = '10px';
        errorDiv.style.borderRadius = '4px';
        errorDiv.style.margin = '10px 0';
        errorDiv.textContent = message;
        
        // Insertar antes del botón de enviar
        const loginForm = document.getElementById('login-form');
        loginForm.insertBefore(errorDiv, loginForm.querySelector('button[type="submit"]'));
        
        // Eliminar automáticamente después de 5 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    // Manejar clics en los botones del menú
    handleMenuClick(event) {
        const button = event.currentTarget;
        const category = button.dataset.page;
        
        this.loadShips(category);
    }
    
    // Cargar naves según la categoría seleccionada
    async loadShips(category = 'home') {
        this.currentPage = category;
        
        // Actualizar botón activo en el menú - incluye los botones creados dinámicamente
        const allButtons = document.querySelectorAll('.menu .button');
        Navigation.updateMenuActiveState(allButtons, category);
        
        // Actualizar interfaz según la categoría
        CategoryUI.updateForCategory(category);
        
        // Guardar una referencia a la barra de búsqueda si existe
        const searchContainer = document.querySelector('.search-container');
        const searchInput = document.getElementById('search-input');
        const searchValue = searchInput ? searchInput.value : '';
        
        // Limpiar contenedor pero conservando la barra de búsqueda
        this.shipsContainer.innerHTML = '';
        
        // Siempre agregar la barra de búsqueda cuando estemos en home
        if (category === 'home') {
            this.ensureSearchBarExists();
        }
        
        // Re-añadir el título de la categoría
        CategoryUI.init();
        
        const loadingElement = ShipCards.showLoading(this.shipsContainer);
        
        try {
            // Obtener IDs de naves para la categoría seleccionada
            const shipIds = await ShipService.getShipIdsForCategory(category, this.favorites);
            
            console.log("IDs de naves obtenidos:", shipIds); // Mensaje de depuración
            
            // Para todas las naves, mostrar mensaje informativo
            if (category === 'home' && shipIds.length > 10) {
                loadingElement.textContent = `Cargando ${shipIds.length} naves de Star Wars...`;
            }
            
            // Si no hay naves o no hay favoritos, mostrar mensaje
            if (!shipIds || shipIds.length === 0) {
                if (category === 'favorites') {
                    loadingElement.textContent = 'No tienes naves favoritas todavía';
                } else {
                    loadingElement.textContent = 'No se encontraron naves disponibles';
                }
                return;
            }
            
            // Cargar datos de las naves - usar Promise.allSettled para manejar errores individuales
            const shipPromises = shipIds.map(id => ShipService.loadShip(id));
            const results = await Promise.allSettled(shipPromises);
            
            // Filtrar las cargas fallidas
            const validShips = results
                .filter(result => result.status === 'fulfilled' && result.value)
                .map(result => result.value);
            
            console.log("Datos de naves cargados:", validShips.length, "de", shipIds.length, "solicitadas"); // Mensaje de depuración
            
            // Quitar indicador de carga
            this.shipsContainer.removeChild(loadingElement);
            
            if (validShips.length === 0) {
                ShipCards.showError(this.shipsContainer, 'No se pudieron cargar las naves');
                return;
            }
            
            // Añadir tarjetas de nave al contenedor
            validShips.forEach(shipData => {
                const shipCard = ShipCards.createShipCard(
                    shipData, 
                    this.shipCardTemplate, 
                    this.showShipDetails
                );
                this.shipsContainer.appendChild(shipCard);
            });
            
            // Si estamos en home y teníamos un valor en la búsqueda, lo restauramos
            if (category === 'home' && searchValue) {
                const newSearchInput = document.getElementById('search-input');
                if (newSearchInput) {
                    newSearchInput.value = searchValue;
                }
            }
            
            // Mostrar página de naves
            Navigation.navigateToPage('ships-container');
            
        } catch (error) {
            console.error('Error al cargar las naves:', error);
            ShipCards.showError(this.shipsContainer);
        }
    }
    
    // Mostrar detalles de una nave específica
    async showShipDetails(shipId) {
        this.currentShipId = shipId;
        
        try {
            const shipData = await ShipService.loadShip(shipId);
            
            if (!shipData) {
                throw new Error('No se pudieron cargar los datos de la nave');
            }
            
            ShipDetails.showShipDetails(shipData, shipId, this.favorites);
            
            // Si estamos en modo comparación, agregar esta nave a la comparación
            const comparisonModeBtn = document.getElementById('comparison-mode-button');
            if (comparisonModeBtn && comparisonModeBtn.classList.contains('active')) {
                this.addShipToComparison();
            }
            
        } catch (error) {
            console.error('Error al mostrar detalles de la nave:', error);
            alert('No se pudieron cargar los detalles de la nave');
        }
    }
    
    // Cambiar estado de favorito para la nave actual
    toggleFavorite() {
        const shipId = Number(this.currentShipId);
        const isFavorite = this.favorites.includes(shipId);
        const favoriteButton = document.getElementById('favorite-button');
        
        if (isFavorite) {
            this.favorites = FavoriteService.removeFavorite(this.favorites, shipId);
            favoriteButton.classList.remove('active');
        } else {
            this.favorites = FavoriteService.addFavorite(this.favorites, shipId);
            favoriteButton.classList.add('active');
        }
        
        FavoriteService.saveFavorites(this.favorites);
    }
    
    // Asegurar que la barra de búsqueda exista en el contenedor
    ensureSearchBarExists() {
        // Verificar si ya existe la barra de búsqueda
        if (document.querySelector('.search-container')) {
            return; // Si ya existe, no hacer nada
        }
        
        // Crear el contenedor de búsqueda
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        
        // Crear el input de búsqueda
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'search-input';
        searchInput.className = 'search-input';
        searchInput.placeholder = 'Buscar naves...';
        
        // Crear el botón de búsqueda
        const searchButton = document.createElement('button');
        searchButton.id = 'search-button';
        searchButton.className = 'search-button';
        searchButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        `;
        
        // Agregar los elementos al contenedor
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchButton);
        
        // Insertar al principio del contenedor
        if (this.shipsContainer.firstChild) {
            this.shipsContainer.insertBefore(searchContainer, this.shipsContainer.firstChild);
        } else {
            this.shipsContainer.appendChild(searchContainer);
        }
        
        // Configurar la funcionalidad de búsqueda
        this.setupSearchFunctionality();
    }
    
    // Configurar la funcionalidad de búsqueda
    setupSearchFunctionality() {
        const searchButton = document.getElementById('search-button');
        const searchInput = document.getElementById('search-input');
        
        if (!searchButton || !searchInput) {
            console.error('No se encontraron los elementos de búsqueda');
            return;
        }
        
        // Manejar clic en el botón de búsqueda
        searchButton.addEventListener('click', () => this.handleSearch());
        
        // Manejar tecla Enter en el input
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                this.handleSearch();
            }
        });
    }
    
    // Manejar la acción de búsqueda
    async handleSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.trim();
        
        // Si no hay término de búsqueda, cargar todas las naves
        if (!searchTerm) {
            this.loadShips('home');
            return;
        }
        
        // Limpiar contenedor pero preservando la barra de búsqueda
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            // Remover temporalmente la barra de búsqueda
            this.shipsContainer.removeChild(searchContainer);
            this.shipsContainer.innerHTML = '';
            // Volver a agregar la barra de búsqueda
            this.shipsContainer.appendChild(searchContainer);
        } else {
            this.shipsContainer.innerHTML = '';
        }
        
        // Mostrar indicador de carga
        const loadingElement = ShipCards.showLoading(this.shipsContainer, 'Buscando naves...');
        
        try {
            // Realizar la búsqueda
            const shipIds = await ShipService.searchShips(searchTerm);
            
            // Quitar indicador de carga
            this.shipsContainer.removeChild(loadingElement);
            
            // Verificar resultados
            if (!shipIds || shipIds.length === 0) {
                const noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'loader';
                noResultsMsg.textContent = `No se encontraron naves que coincidan con "${searchTerm}"`;
                this.shipsContainer.appendChild(noResultsMsg);
                return;
            }
            
            // Crear título de resultados
            const resultsTitle = document.createElement('h2');
            resultsTitle.id = 'category-title';
            resultsTitle.textContent = `Resultados de búsqueda: "${searchTerm}" (${shipIds.length} naves)`;
            this.shipsContainer.appendChild(resultsTitle);
            
            // Cargar datos de las naves encontradas
            const shipPromises = shipIds.map(id => ShipService.loadShip(id));
            const results = await Promise.allSettled(shipPromises);
            
            // Filtrar las cargas fallidas
            const validShips = results
                .filter(result => result.status === 'fulfilled' && result.value)
                .map(result => result.value);
            
            if (validShips.length === 0) {
                ShipCards.showError(this.shipsContainer, 'No se pudieron cargar las naves');
                return;
            }
            
            // Añadir tarjetas de naves al contenedor
            validShips.forEach(shipData => {
                const shipCard = ShipCards.createShipCard(
                    shipData, 
                    this.shipCardTemplate, 
                    this.showShipDetails
                );
                this.shipsContainer.appendChild(shipCard);
            });
            
        } catch (error) {
            console.error('Error al buscar naves:', error);
            ShipCards.showError(this.shipsContainer, 'Error al realizar la búsqueda');
        }
    }
}