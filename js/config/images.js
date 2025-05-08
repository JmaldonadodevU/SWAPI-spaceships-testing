// Map de ID de nave a nombre de archivo de imagen
export const SHIP_IMAGES = {
    2: 'CR90-corvette.png',
    3: 'Star-Destroyer.png',
    5: 'Sentinel-class-landing-craft.png',
    9: 'Death-Star.png',
    10: 'Millennium-Falcon.png',
    11: 'Y-wing.png',
    12: 'X-wing.png',
    13: 'TIE-Advanced-x1.png',
    15: 'Executor.png',
    17: 'Rebel-transport.png',
    21: 'Slave-1.png',
    22: 'Imperial-shuttle.png',
    23: 'EF76-Nebulon-B-escort-frigate.png',
    27: 'Calamari-Cruiser.png',
    28: 'A-wing.png',
    29: 'B-wing.png',
    31: 'Republic-Cruiser.png',
    32: 'Droid-control-ship.png',
    39: 'Naboo-fighter.png',
    40: 'Naboo-Royal-Starship.png',
    41: 'Scimitar.png',
    48: 'Jedi-starfighter.png',
    52: 'Republic-Assault-ship.png',
    63: 'Republic-attack-cruiser.png',
    64: 'Naboo-star-skiff.png',
    65: 'Jedi-Interceptor.png',
    66: 'arc-170.png',
    74: 'Belbullab-22-starfighter.png',
    // Imágenes adicionales que existen en el directorio
    75: 'V-wing.png',
    // Para ciertas naves que puedan no tener imágen específica
    60: 'Banking-clan-frigte.png',
    61: 'Solar-Sailer.png',
    68: 'Trade-Federation-cruiser.png'
};

// Función para obtener la URL de la imagen de una nave
export function getShipImageUrl(shipId) {
    // Intentar convertir a número si es string
    const id = typeof shipId === 'string' ? parseInt(shipId, 10) : shipId;
    
    if (SHIP_IMAGES[id]) {
        return `src/img/${SHIP_IMAGES[id]}`;
    }
    
    // Si no se encuentra la imagen, usar una genérica según el último dígito
    // para dar variedad a naves sin imagen específica
    const lastDigit = id % 10;
    const genericOptions = ['X-wing.png', 'Y-wing.png', 'TIE-Advanced-x1.png', 'Millennium-Falcon.png'];
    const genericImage = genericOptions[lastDigit % genericOptions.length];
    
    return `src/img/${genericImage}`;
}