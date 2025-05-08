import { SHIP_DESCRIPTIONS } from '../config/ships.js';
import { Navigation } from './navigation.js';
import { ShipService } from '../services/shipService.js';
import { getShipImageUrl } from '../config/images.js';

// Functions for displaying ship details
export const ShipDetails = {
    // Update the UI with ship details
    updateShipDetailsUI(shipData, shipId) {
        // Update elements with ship data
        document.getElementById('detail-ship-name').textContent = shipData.name;
        document.getElementById('detail-ship-class').textContent = shipData.starship_class;
        
        // Cargar la imagen de la nave
        const shipImage = document.getElementById('detail-ship-image');
        if (shipImage) {
            shipImage.style.backgroundImage = `url('${getShipImageUrl(shipId)}')`;
            shipImage.style.backgroundSize = 'contain';
            shipImage.style.backgroundPosition = 'center';
            shipImage.style.backgroundRepeat = 'no-repeat';
        }
        
        // Create detailed information
        const info = `Fabricante: ${shipData.manufacturer}
Longitud: ${shipData.length} m
Tripulación: ${shipData.crew}
Pasajeros: ${shipData.passengers}
Capacidad de carga: ${shipData.cargo_capacity} kg
Consumibles: ${shipData.consumables}
Velocidad atmosférica máxima: ${shipData.max_atmosphering_speed}
Clasificación del hiperimpulsor: ${shipData.hyperdrive_rating}

${this.getShipDescription(shipData, shipId)}`;
        
        document.getElementById('detail-ship-info').textContent = info;
        document.getElementById('detail-ship-cost').textContent = 
            shipData.cost_in_credits !== "unknown" ? shipData.cost_in_credits : "Desconocido";
    },

    // Get ship description (from config or generate one)
    getShipDescription(shipData, shipId) {
        if (SHIP_DESCRIPTIONS[shipId]) {
            return SHIP_DESCRIPTIONS[shipId];
        }
        
        // Generate a basic description
        return ShipService.generateShipDescription(shipData);
    },

    // Update favorite button state
    updateFavoriteButtonState(shipId, favorites) {
        const favoriteButton = document.getElementById('favorite-button');
        const isFavorite = favorites.includes(Number(shipId));
        
        if (isFavorite) {
            favoriteButton.classList.add('active');
        } else {
            favoriteButton.classList.remove('active');
        }
    },

    // Show ship details page with data
    showShipDetails(shipData, shipId, favorites) {
        this.updateShipDetailsUI(shipData, shipId);
        this.updateFavoriteButtonState(shipId, favorites);
        Navigation.navigateToPage('ship-details');
    }
};