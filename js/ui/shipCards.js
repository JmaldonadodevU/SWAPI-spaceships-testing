// Funciones para mostrar las tarjetas de naves
export const ShipCards = {
    // Crea una tarjeta para una nave
    createShipCard(shipData, template, onCardClick) {
        const shipCard = document.importNode(template.content, true);
        
        // Obtiene el ID de la nave desde su URL
        const shipId = shipData.url.split('/').filter(part => part).pop();
        
        // Guarda el ID en el atributo data de la tarjeta
        const cardElement = shipCard.querySelector('.ship-card');
        cardElement.dataset.shipId = shipId;
        
        // Añade el evento de clic a la tarjeta
        cardElement.addEventListener('click', () => onCardClick(shipId));
        
        // Actualiza los datos en la tarjeta
        shipCard.querySelector('.ship-name').textContent = shipData.name;
        shipCard.querySelector('.ship-class').textContent = `Clase de la nave: ${shipData.starship_class}`;
        shipCard.querySelector('.ship-cost').textContent = `Creditos de costo: ${shipData.cost_in_credits !== "unknown" ? shipData.cost_in_credits : "Desconocido"}`;
        
        return shipCard;
    },

    // Muestra un indicador de carga
    showLoading(container, message = 'Cargando naves...') {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loader';
        loadingElement.textContent = message;
        
        // Para la página principal, mostrar mensaje especial
        if (container.id === 'ships-container' && 
            !container.querySelector('#category-title')) {
            loadingElement.textContent = 'Cargando todas las naves de Star Wars...';
        }
        
        container.appendChild(loadingElement);
        return loadingElement;
    },

    // Muestra un mensaje de error
    showError(container, message = 'Error al cargar las naves. Por favor, intenta de nuevo.') {
        container.innerHTML = '';
        const errorElement = document.createElement('div');
        errorElement.className = 'loader';
        errorElement.textContent = message;
        container.appendChild(errorElement);
    }
};