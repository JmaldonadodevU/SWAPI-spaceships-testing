import { ALL_KNOWN_SHIPS, ICONIC_SHIPS, SHIP_DESCRIPTIONS, SHIP_FACTION_MAP } from '../config/ships.js';
import { ApiService } from './apiService.js';

// Caché para almacenar todas las naves
let allStarshipsCache = null;
let allShipsDataCache = null;

export const ShipService = {
    /**
     * Carga una nave específica por ID
     * @param {number} shipId ID de la nave
     * @returns {Promise<Object>} Promise con los datos de la nave
     */
    async loadShip(shipId) {
        return await ApiService.getStarshipById(shipId);
    },

    /**
     * Obtiene naves aleatorias
     * @param {number} count Número de naves a obtener
     * @returns {Promise<Array>} Promise con los IDs de las naves
     */
    async getRandomShips(count) {
        const allShipIds = await this.getAllShipIds();
        const shuffled = [...allShipIds].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    },

    /**
     * Obtiene los IDs de las naves para una categoría
     * @param {string} category Categoría de las naves
     * @param {Array} favorites Lista de favoritos
     * @returns {Promise<Array>} Promise con los IDs de las naves
     */
    async getShipIdsForCategory(category, favorites) {
        if (category === 'home') {
            // El botón home ahora muestra todas las naves
            return await this.getAllShipIds();
        } else if (category === 'dice') {
            return await this.getRandomShips(4);
        } else if (category === 'favorites') {
            return favorites;
        } else if (ICONIC_SHIPS[category]) {
            return ICONIC_SHIPS[category];
        } else {
            return [];
        }
    },
    
    /**
     * Obtiene los IDs de todas las naves
     * @returns {Promise<Array>} Promise con los IDs de todas las naves
     */
    async getAllShipIds() {
        try {
            if (!allStarshipsCache) {
                const ships = await ApiService.getAllStarships();
                allStarshipsCache = ships.map(ship => {
                    return ApiService.extractIdFromUrl(ship.url);
                }).filter(id => id !== null);
            }
            return allStarshipsCache;
        } catch (error) {
            console.error('Error al obtener IDs de todas las naves:', error);
            return ALL_KNOWN_SHIPS;
        }
    },
    
    /**
     * Genera una descripción para una nave
     * @param {Object} ship Datos de la nave
     * @returns {string} Descripción generada
     */
    generateShipDescription(ship) {
        // Extrae el ID de la URL
        const id = ApiService.extractIdFromUrl(ship.url);
        
        // Si existe una descripción predefinida, la usa
        if (id && SHIP_DESCRIPTIONS[id]) {
            return SHIP_DESCRIPTIONS[id];
        }
        
        // Determinar la facción
        let faction = "desconocida";
        if (id && SHIP_FACTION_MAP[id]) {
            faction = SHIP_FACTION_MAP[id];
        } else {
            // Intentar deducir la facción por el nombre o fabricante
            const nameLower = ship.name.toLowerCase();
            const manufacturerLower = ship.manufacturer.toLowerCase();
            
            if (nameLower.includes("imperial") || 
                manufacturerLower.includes("sienar") || 
                nameLower.includes("tie") || 
                nameLower.includes("star destroyer")) {
                faction = "Imperio Galáctico";
            } else if (nameLower.includes("republic") || 
                    manufacturerLower.includes("incom") || 
                    nameLower.includes("jedi") || 
                    nameLower.includes("naboo")) {
                faction = "República Galáctica";
            } else if (nameLower.includes("rebellion") || 
                    nameLower.includes("x-wing") || 
                    nameLower.includes("y-wing") || 
                    nameLower.includes("a-wing") || 
                    nameLower.includes("b-wing")) {
                faction = "Alianza Rebelde";
            }
        }
        
        // Información sobre velocidad
        let speedInfo = "";
        if (ship.max_atmosphering_speed && ship.max_atmosphering_speed !== "n/a" && ship.max_atmosphering_speed !== "unknown") {
            speedInfo = `Alcanza una velocidad máxima de ${ship.max_atmosphering_speed} en atmósfera.`;
        }
        
        // Información de tripulación
        let crewInfo = "";
        if (ship.crew && ship.crew !== "n/a" && ship.crew !== "unknown") {
            crewInfo = `Requiere una tripulación de ${ship.crew} personas`;
            
            if (ship.passengers && ship.passengers !== "n/a" && ship.passengers !== "unknown" && ship.passengers !== "0") {
                crewInfo += ` y puede transportar hasta ${ship.passengers} pasajeros.`;
            } else {
                crewInfo += ".";
            }
        }
        
        // Información del hiperpropulsor
        let hyperInfo = "";
        if (ship.hyperdrive_rating && ship.hyperdrive_rating !== "n/a" && ship.hyperdrive_rating !== "unknown") {
            hyperInfo = `Equipada con un hiperpropulsor clase ${ship.hyperdrive_rating}.`;
        }

        // Genera una descripción más completa
        return `${ship.name} es una ${ship.model} de clase ${ship.starship_class}, fabricada por ${ship.manufacturer}. 
Con una longitud de ${ship.length} metros, esta nave pertenece a la facción de la ${faction}.
${speedInfo} ${crewInfo} ${hyperInfo}`;
    },
    
    /**
     * Obtiene naves por facción
     * @param {string} faction Facción a filtrar
     * @returns {Promise<Array>} Promise con los IDs de las naves
     */
    async getShipsByFaction(faction) {
        const allShipIds = await this.getAllShipIds();
        
        // Filtrar por facción
        return allShipIds.filter(id => 
            SHIP_FACTION_MAP[id] === faction
        );
    },

    /**
     * Busca naves por nombre, modelo o clase
     * @param {string} searchTerm Término de búsqueda
     * @returns {Promise<Array>} Promise con los IDs de las naves encontradas
     */
    async searchShips(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            return await this.getAllShipIds();
        }
        
        try {
            // Normalizar el término de búsqueda
            const term = searchTerm.toLowerCase().trim();
            console.log("Buscando naves con término:", term);
            
            // Comprobación específica para CR90 corvette (ID 2)
            if (term === "cr90" || term === "cr90 corvette" || term === "corvette" || term === "cr-90") {
                console.log("Búsqueda especial para CR90 corvette (ID 2)");
                return [2]; // Devolver directamente el ID 2 (un único resultado)
            }
            
            // Si no tenemos la caché de datos completos de naves, cargarla
            if (!allShipsDataCache) {
                console.log("Cargando caché de naves para búsqueda...");
                allShipsDataCache = await ApiService.getAllStarships();
            }
            
            // Filtrar las naves que coincidan con el término de búsqueda
            const filteredShips = allShipsDataCache.filter(ship => {
                const matchesName = ship.name.toLowerCase().includes(term);
                const matchesModel = ship.model.toLowerCase().includes(term);
                const matchesClass = ship.starship_class.toLowerCase().includes(term);
                const matchesManufacturer = ship.manufacturer.toLowerCase().includes(term);
                
                return matchesName || matchesModel || matchesClass || matchesManufacturer;
            });
            
            // Extraer los IDs de las naves filtradas y eliminar duplicados
            const shipIds = [...new Set(filteredShips.map(ship => ApiService.extractIdFromUrl(ship.url)))];
            console.log("IDs de naves encontradas (sin duplicados):", shipIds);
            
            // Si encontramos resultados en la API, los devolvemos
            if (shipIds.length > 0) {
                return shipIds;
            }
            
            // Si no hay resultados, buscamos en naves predefinidas
            return this.searchInPredefinedShips(term);
            
        } catch (error) {
            console.error('Error en la búsqueda de naves:', error);
            return this.searchInPredefinedShips(searchTerm);
        }
    },
    
    /**
     * Busca en el conjunto de naves predefinidas cuando la API no encuentra resultados
     * @param {string} searchTerm Término de búsqueda
     * @returns {Array} Array con IDs de naves que coinciden (sin duplicados)
     */
    searchInPredefinedShips(searchTerm) {
        console.log("Buscando en naves predefinidas...");
        const term = searchTerm.toLowerCase().trim();
        
        // Datos predefinidos para buscar por nombre
        const predefinedShips = {
            "cr90": 2,
            "cr90 corvette": 2,
            "corvette": 2,
            "cr-90": 2,
            "star destroyer": 3,
            "death star": 9,
            "millennium falcon": 10,
            "y-wing": 11,
            "x-wing": 12,
            "tie fighter": 13,
            "executor": 15
        };
        
        // Buscar coincidencias exactas primero
        if (predefinedShips[term] !== undefined) {
            return [predefinedShips[term]];
        }
        
        // Buscar coincidencias parciales, evitando duplicados usando Set
        const resultsSet = new Set();
        for (const [shipName, id] of Object.entries(predefinedShips)) {
            if (shipName.includes(term) || term.includes(shipName)) {
                resultsSet.add(id);
            }
        }
        
        return Array.from(resultsSet);
    },
};