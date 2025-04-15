/**
 * Servicio para comunicarse con la API de SWAPI
 */
export const ApiService = {
    /**
     * Obtiene todas las naves de la API paginada
     * @returns {Promise<Array>} Promise con la lista completa de naves
     */
    async getAllStarships() {
        let allShips = [];
        let nextUrl = 'https://swapi.info/api/starships/';
        
        try {
            // Recorrer todas las páginas
            while (nextUrl) {
                console.log(`Cargando página: ${nextUrl}`);
                const response = await fetch(nextUrl);
                
                if (!response.ok) {
                    throw new Error(`Error al cargar naves: ${response.status}`);
                }
                
                const data = await response.json();
                allShips = [...allShips, ...data.results];
                nextUrl = data.next;
                
                // Mostrar progreso
                console.log(`Cargadas ${allShips.length} naves de ${data.count} totales`);
            }
            
            return allShips;
        } catch (error) {
            console.error('Error al cargar todas las naves:', error);
            throw error;
        }
    },
    
    /**
     * Busca naves según un término de búsqueda
     * @param {string} searchTerm Término de búsqueda
     * @returns {Promise<Array>} Promise con las naves que coinciden
     */
    async searchStarships(searchTerm) {
        try {
            const response = await fetch(`https://swapi.info/api/starships/?search=${encodeURIComponent(searchTerm)}`);
            
            if (!response.ok) {
                throw new Error(`Error en la búsqueda: ${response.status}`);
            }
            
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error al buscar naves:', error);
            throw error;
        }
    },
    
    /**
     * Obtiene una nave específica por ID
     * @param {number} id ID de la nave
     * @returns {Promise<Object>} Promise con los datos de la nave
     */
    async getStarshipById(id) {
        try {
            const response = await fetch(`https://swapi.info/api/starships/${id}`);
            
            if (!response.ok) {
                throw new Error(`Error al cargar la nave (${response.status})`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error al cargar la nave ${id}:`, error);
            return null;
        }
    },
    
    /**
     * Extrae el ID de una nave a partir de su URL
     * @param {string} url URL de la nave
     * @returns {number} ID de la nave
     */
    extractIdFromUrl(url) {
        if (!url) return null;
        
        const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
        const parts = cleanUrl.split('/').filter(part => part);
        return parseInt(parts[parts.length - 1]);
    }
};