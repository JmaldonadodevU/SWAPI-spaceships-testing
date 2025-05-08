/**
 * Servicio de almacenamiento con Firestore en modo de prueba (sin autenticación)
 */
import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:0000000000000000000000"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const AuthService = {
    /**
     * Estado actual del usuario
     */
    currentUser: null,
    
    /**
     * Inicializa el servicio de almacenamiento
     */
    init() {
        // Comprobar si hay un usuario almacenado en localStorage
        const storedUser = localStorage.getItem('swapi_test_user');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            console.log("Usuario cargado del almacenamiento local:", this.currentUser.email);
            
            // Cargar favoritos desde Firestore si existe el usuario
            this.loadUserData();
            
            // Disparar evento de cambio de autenticación
            this.notifyAuthChange();
        }
    },
    
    /**
     * Notifica cambios en el estado de autenticación
     */
    notifyAuthChange() {
        const event = new CustomEvent('authStateChanged', {
            detail: { user: this.currentUser }
        });
        document.dispatchEvent(event);
    },
    
    /**
     * Registra un nuevo usuario en modo de prueba
     * @param {string} email Correo electrónico - se usa como ID
     * @returns {Promise} Promise con el resultado del registro
     */
    async register(email) {
        try {
            // Crear un usuario de prueba
            const testUser = {
                email: email,
                uid: email.replace(/[^a-zA-Z0-9]/g, '_'), // Usar email como ID quitando caracteres especiales
                createdAt: new Date().toISOString()
            };
            
            // Almacenar en localStorage
            localStorage.setItem('swapi_test_user', JSON.stringify(testUser));
            this.currentUser = testUser;
            
            // Intentar guardar en Firestore
            await this.saveUserData();
            
            // Notificar cambio
            this.notifyAuthChange();
            
            return testUser;
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            // Seguir usando el usuario aunque haya fallado Firestore
            this.notifyAuthChange();
            return this.currentUser;
        }
    },
    
    /**
     * Inicia sesión de un usuario existente en modo de prueba
     * @param {string} email Correo electrónico - se usa como ID
     * @returns {Promise} Promise con el resultado del inicio de sesión
     */
    async login(email) {
        try {
            // Usa el email como ID
            const uid = email.replace(/[^a-zA-Z0-9]/g, '_');
            
            // Crear el objeto de usuario
            const testUser = {
                email: email,
                uid: uid,
                createdAt: new Date().toISOString()
            };
            
            // Almacenar en localStorage
            localStorage.setItem('swapi_test_user', JSON.stringify(testUser));
            this.currentUser = testUser;
            
            // Cargar favoritos desde Firestore si existen
            await this.loadUserData();
            
            // Notificar cambio
            this.notifyAuthChange();
            
            return testUser;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            // Seguir usando el usuario aunque haya fallado Firestore
            this.notifyAuthChange();
            return this.currentUser;
        }
    },
    
    /**
     * Guarda los datos del usuario en Firestore
     */
    async saveUserData() {
        if (!this.currentUser) return;

        try {
            const userId = this.currentUser.uid;
            const userRef = doc(db, "users", userId);
            
            // Guardar información básica del usuario
            const userData = {
                email: this.currentUser.email,
                lastLogin: new Date().toISOString()
            };
            
            // Obtener favoritos actuales
            const favorites = JSON.parse(localStorage.getItem('starWarsShipFavorites') || '[]');
            userData.favorites = favorites;
            
            // Guardar en Firestore
            await setDoc(userRef, userData, { merge: true });
            console.log("Datos de usuario guardados en Firestore");
        } catch (error) {
            console.error('Error al guardar en Firestore:', error);
        }
    },
    
    /**
     * Carga los datos del usuario desde Firestore
     */
    async loadUserData() {
        if (!this.currentUser) return;

        try {
            const userId = this.currentUser.uid;
            const userRef = doc(db, "users", userId);
            const userSnapshot = await getDoc(userRef);
            
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                
                // Si hay favoritos en Firestore, actualizar localStorage
                if (userData.favorites && Array.isArray(userData.favorites)) {
                    localStorage.setItem('starWarsShipFavorites', JSON.stringify(userData.favorites));
                    console.log("Favoritos cargados desde Firestore:", userData.favorites.length);
                    
                    // Notificar que los favoritos fueron cargados
                    const event = new CustomEvent('favoritesLoaded', {
                        detail: { favorites: userData.favorites }
                    });
                    document.dispatchEvent(event);
                }
            } else {
                // Si el usuario no existe en Firestore, crear los datos iniciales
                await this.saveUserData();
            }
        } catch (error) {
            console.error('Error al cargar datos de Firestore:', error);
        }
    },
    
    /**
     * Cierra la sesión del usuario actual
     * @returns {Promise} Promise con el resultado del cierre de sesión
     */
    async logout() {
        try {
            // Guardar favoritos antes de cerrar sesión
            if (this.currentUser) {
                await this.saveUserData();
            }
            
            localStorage.removeItem('swapi_test_user');
            this.currentUser = null;
            
            // Notificar cambio
            this.notifyAuthChange();
            
            return true;
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            throw new Error('Error al cerrar sesión');
        }
    },
    
    /**
     * Verifica si hay un usuario autenticado
     * @returns {boolean} true si hay un usuario autenticado
     */
    isLoggedIn() {
        return !!this.currentUser;
    },
    
    /**
     * Obtiene el correo del usuario autenticado
     * @returns {string|null} Correo del usuario o null
     */
    getUserEmail() {
        return this.currentUser ? this.currentUser.email : null;
    },
    
    /**
     * Mejora la UI del formulario de login
     */
    enhanceLoginForm() {
        // Esperar a que el DOM esté completamente cargado
        setTimeout(() => {
            // Cambiar el título del formulario
            const loginTitle = document.querySelector('#login-page h2');
            if (loginTitle) {
                loginTitle.textContent = 'Registro Simple';
            }
            
            // Actualizar placeholder del campo de usuario
            const usernameField = document.getElementById('username');
            if (usernameField) {
                usernameField.type = 'email';
                usernameField.placeholder = 'tu@email.com';
                usernameField.title = 'Introduce tu correo electrónico';
                
                const usernameLabel = document.querySelector('label[for="username"]');
                if (usernameLabel) {
                    usernameLabel.textContent = 'Correo electrónico:';
                }
            }
            
            // Eliminar campo de contraseña si existe
            const passwordField = document.querySelector('label[for="password"]')?.parentNode;
            if (passwordField) {
                passwordField.remove();
            }
            
            // Añadir mensaje informativo
            const loginForm = document.getElementById('login-form');
            if (loginForm && !document.getElementById('test-mode-info')) {
                const infoDiv = document.createElement('div');
                infoDiv.id = 'test-mode-info';
                infoDiv.style.margin = '10px 0';
                infoDiv.style.fontSize = '14px';
                infoDiv.style.color = '#666';
                infoDiv.textContent = 'Esta aplicación está en modo de prueba. Tus datos de favoritos se guardarán en texto plano en Firebase.';
                
                loginForm.insertBefore(infoDiv, loginForm.querySelector('button[type="submit"]'));
            }
            
            // Modificar el botón de enviar
            const submitBtn = document.querySelector('.login-submit-btn');
            if (submitBtn) {
                submitBtn.textContent = 'Guardar Datos';
            }
        }, 100); // Pequeño delay para asegurar que el DOM esté listo
    },
    
    /**
     * Actualiza los datos cuando se cambian favoritos
     * @param {Array} favorites Array de IDs de naves favoritas 
     */
    async updateFavorites(favorites) {
        try {
            // Si hay un usuario activo, actualizar sus favoritos
            if (this.currentUser) {
                const userId = this.currentUser.uid;
                const userRef = doc(db, "users", userId);
                
                await setDoc(userRef, { 
                    favorites: favorites,
                    lastUpdate: new Date().toISOString()
                }, { merge: true });
                
                console.log("Favoritos actualizados en Firestore:", favorites.length);
            }
        } catch (error) {
            console.error('Error al actualizar favoritos en Firestore:', error);
        }
    }
};