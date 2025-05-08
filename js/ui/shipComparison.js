// filepath: d:\cloned-repositories\SWAPI-spaceships\js\ui\shipComparison.js
import { Navigation } from './navigation.js';
import { ShipService } from '../services/shipService.js';
import { getShipImageUrl } from '../config/images.js';

// Functions for displaying ship comparison
export const ShipComparison = {
    // Selected ships for comparison
    selectedShips: [],
    
    // Initialize the comparison component
    init() {
        this.selectedShips = [];
        // Add event listeners for comparison buttons
        document.querySelectorAll('.comparison-close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                Navigation.navigateToPage('ships-container');
            });
        });
    },
    
    // Add a ship to comparison (max 2 ships)
    addShipToComparison(shipId, shipData) {
        // If we already have this ship, don't add it again
        if (this.selectedShips.some(ship => ship.id === shipId)) {
            return false;
        }
        
        // If we already have 2 ships, replace the first one (oldest)
        if (this.selectedShips.length >= 2) {
            this.selectedShips.shift();
        }
        
        // Add the new ship
        this.selectedShips.push({
            id: shipId,
            data: shipData
        });
        
        // Return true if we now have 2 ships to compare
        return this.selectedShips.length === 2;
    },
    
    // Clear comparison selection
    clearComparison() {
        this.selectedShips = [];
    },
    
    // Show comparison view with the selected ships
    async showComparison() {
        // Need exactly 2 ships to compare
        if (this.selectedShips.length !== 2) {
            console.error('Need exactly 2 ships to compare');
            return;
        }
        
        // Make sure we have all ship data
        const ship1 = this.selectedShips[0];
        const ship2 = this.selectedShips[1];
        
        // Update the comparison UI
        this.updateComparisonUI(ship1.id, ship1.data, ship2.id, ship2.data);
        
        // Navigate to the comparison page
        Navigation.navigateToPage('ship-comparison');
    },
    
    // Update the UI with ship comparison data
    updateComparisonUI(ship1Id, ship1Data, ship2Id, ship2Data) {
        // Set ship names
        document.getElementById('comparison-ship1-name').textContent = ship1Data.name;
        document.getElementById('comparison-ship2-name').textContent = ship2Data.name;
        
        // Set ship images
        const ship1Image = document.getElementById('comparison-ship1-image');
        const ship2Image = document.getElementById('comparison-ship2-image');
        
        ship1Image.style.backgroundImage = `url('${getShipImageUrl(ship1Id)}')`;
        ship2Image.style.backgroundImage = `url('${getShipImageUrl(ship2Id)}')`;
        
        ship1Image.style.backgroundSize = 'contain';
        ship2Image.style.backgroundSize = 'contain';
        ship1Image.style.backgroundPosition = 'center';
        ship2Image.style.backgroundPosition = 'center';
        ship1Image.style.backgroundRepeat = 'no-repeat';
        ship2Image.style.backgroundRepeat = 'no-repeat';
        
        // Update comparison specs
        this.updateSpecComparison('class', 'Clase', ship1Data.starship_class, ship2Data.starship_class);
        this.updateSpecComparison('length', 'Longitud (m)', ship1Data.length, ship2Data.length);
        this.updateSpecComparison('crew', 'Tripulación', ship1Data.crew, ship2Data.crew);
        this.updateSpecComparison('passengers', 'Pasajeros', ship1Data.passengers, ship2Data.passengers);
        this.updateSpecComparison('cargo', 'Capacidad (kg)', ship1Data.cargo_capacity, ship2Data.cargo_capacity);
        this.updateSpecComparison('speed', 'Velocidad', ship1Data.max_atmosphering_speed, ship2Data.max_atmosphering_speed);
        this.updateSpecComparison('hyperdrive', 'Hiperimpulsor', ship1Data.hyperdrive_rating, ship2Data.hyperdrive_rating);
        this.updateSpecComparison('cost', 'Costo (créditos)', ship1Data.cost_in_credits, ship2Data.cost_in_credits);
        this.updateSpecComparison('manufacturer', 'Fabricante', ship1Data.manufacturer, ship2Data.manufacturer);
    },
    
    // Helper to update a specification comparison row
    updateSpecComparison(specId, label, value1, value2) {
        const row = document.getElementById(`comparison-${specId}`);
        if (!row) return;
        
        // Set the specification label
        const labelElement = row.querySelector('.comparison-spec-label');
        if (labelElement) {
            labelElement.textContent = label;
        }
        
        // Set values for each ship
        const value1Element = row.querySelector('.comparison-spec-value1');
        const value2Element = row.querySelector('.comparison-spec-value2');
        
        if (value1Element) {
            value1Element.textContent = this.formatSpecValue(value1);
        }
        
        if (value2Element) {
            value2Element.textContent = this.formatSpecValue(value2);
        }
        
        // Highlight the better value when numeric
        this.highlightBetterValue(specId, value1, value2, value1Element, value2Element);
    },
    
    // Format specification value for display
    formatSpecValue(value) {
        if (!value || value === 'unknown' || value === 'n/a') {
            return 'Desconocido';
        }
        return value;
    },
    
    // Highlight the better value when comparing numeric specs
    highlightBetterValue(specId, value1, value2, element1, element2) {
        // Only do comparison for certain numeric specs
        const compareSpecs = ['length', 'crew', 'passengers', 'cargo', 'speed', 'hyperdrive', 'cost'];
        if (!compareSpecs.includes(specId)) return;
        
        // Reset classes
        element1.classList.remove('better-value', 'worse-value');
        element2.classList.remove('better-value', 'worse-value');
        
        // Prepare values for comparison
        let num1 = this.parseValueForComparison(value1);
        let num2 = this.parseValueForComparison(value2);
        
        // If either value is unknown, don't compare
        if (num1 === null || num2 === null) return;
        
        // For hyperdrive, lower is better
        const lowerIsBetter = specId === 'hyperdrive';
        
        if (num1 === num2) {
            // Equal values - no highlighting needed
            return;
        } else if ((lowerIsBetter && num1 < num2) || (!lowerIsBetter && num1 > num2)) {
            // Ship 1 has better value
            element1.classList.add('better-value');
            element2.classList.add('worse-value');
        } else {
            // Ship 2 has better value
            element1.classList.add('worse-value');
            element2.classList.add('better-value');
        }
    },
    
    // Parse a value for numeric comparison
    parseValueForComparison(value) {
        if (!value || value === 'unknown' || value === 'n/a') {
            return null;
        }
        
        // Extract numbers from a string
        const matches = value.match(/[\d,.]+/);
        if (matches && matches.length > 0) {
            // Replace comma with dot for decimal values
            return parseFloat(matches[0].replace(',', '.'));
        }
        
        return null;
    }
};