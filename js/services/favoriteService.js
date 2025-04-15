import { AuthService } from './authService.js';

// Servicio para gestionar las naves favoritas
export const FavoriteService = {
    // Carga las naves favoritas desde el almacenamiento local
    loadFavorites() {
        const favs = localStorage.getItem('starWarsShipFavorites');
        return favs ? JSON.parse(favs) : [];
    },

    // Guarda las naves favoritas en el almacenamiento local y en Firestore
    saveFavorites(favorites) {
        localStorage.setItem('starWarsShipFavorites', JSON.stringify(favorites));
        
        // Intentar sincronizar con Firestore si hay un usuario
        if (AuthService.isLoggedIn()) {
            AuthService.updateFavorites(favorites)
                .catch(error => console.error('Error al sincronizar favoritos:', error));
        }
    },

    // Añade una nave a favoritos
    addFavorite(favorites, shipId) {
        if (!favorites.includes(shipId)) {
            return [...favorites, shipId];
        }
        return favorites;
    },

    // Elimina una nave de favoritos
    removeFavorite(favorites, shipId) {
        return favorites.filter(id => id !== shipId);
    }
};