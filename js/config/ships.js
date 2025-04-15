// IDs de las naves icónicas para mostrar por categoría
export const ICONIC_SHIPS = {
    home: [], // La página inicial muestra todas las naves de la API
    rebellion: [2, 10, 11, 12, 17, 28, 29, 31], // Rebeldes + República
    empire: [3, 5, 9, 13, 15, 21, 22, 23, 52, 63], // Imperio
    republic: [31, 39, 40, 48, 49, 64, 65, 66, 74, 75], // República de las precuelas
    separatist: [32, 41, 58, 68], // Separatistas de las precuelas
};

// Lista de IDs de todas las naves conocidas para usar en caso de fallback
export const ALL_KNOWN_SHIPS = [2, 3, 5, 9, 10, 11, 12, 13, 15, 17, 21, 22, 23, 27, 28, 29,
    31, 32, 39, 40, 41, 43, 47, 48, 49, 52, 58, 59, 61, 63, 64, 65, 66, 68, 74, 75];

// Descripciones de naves específicas
export const SHIP_DESCRIPTIONS = {
    // Naves originales
    "2": "Nave diplomática de Alderaan, utilizada por la Princesa Leia y conocida por su velocidad y escudos.",
    "3": "Destructor Estelar Imperial, nave de guerra principal de la Armada Imperial y símbolo del poder militar del Imperio.",
    "5": "Nave de asalto y desembarco Imperial, utilizada para transportar tropas a la superficie.",
    "9": "Estación espacial del tamaño de una luna con capacidad para destruir planetas enteros.",
    "10": "La nave más rápida de la galaxia, modificada por Han Solo. Hizo el Corredor de Kessel en menos de doce parsecs.",
    "11": "Caza bombardero de la Alianza Rebelde, equipado con potentes torpedos pero más lento que el X-Wing.",
    "12": "Caza estelar principal de la Alianza Rebelde, versátil y equipado con cuatro cañones láser y torpedos de protones.",
    "13": "Caza TIE avanzado utilizado por Darth Vader, con escudos mejorados y mejor armamento que los TIE estándar.",
    "15": "Super Destructor Estelar Ejecutor, la nave insignia de Darth Vader y una de las naves más grandes de la flota Imperial.",
    "17": "Transporte Rebelde GR-75, usado para evacuar la base Echo en Hoth y transportar suministros para la Alianza.",
    
    // Naves adicionales
    "21": "Nave de Boba Fett, diseñada específicamente para la caza y transporte de recompensas. Equipada con sistemas avanzados de rastreo.",
    "22": "Lanzadera Imperial Lambda, elegante y reconocible por sus alas plegables. Usada como transporte de oficiales de alto rango.",
    "23": "Fragata de escolta Nebulon-B, nave médica rebelde donde Luke Skywalker recibió su mano protésica tras su duelo con Darth Vader.",
    "27": "Crucero Mon Calamari, nave capital de la flota rebelde que sirvió como buque insignia durante la Batalla de Endor.",
    "28": "Caza estelar A-wing, la nave más rápida de la flota rebelde. Liviano y ágil, diseñado principalmente para interceptación.",
    "29": "Bombardero B-wing, nave de ataque pesado especializada en asaltos contra naves capitales imperiales.",
    
    // Naves de las precuelas
    "31": "Crucero diplomático de la República, usado por los Jedi en misiones oficiales como embajadores de la República Galáctica.",
    "32": "Nave de control droide, enorme estación espacial esférica que controla remotamente a los ejércitos de droides separatistas.",
    "39": "Caza estelar N-1 de Naboo, elegante nave de diseño aerodinámico con acabados cromados, pilotada por Anakin en Episodio I.",
    "40": "Nave real de Naboo, lujoso yate plateado usado por la reina Amidala. Conocido por su elegante diseño y escudos avanzados.",
    "41": "Scimitar, nave de infiltración usada por Darth Maul. Equipada con tecnología de camuflaje avanzada.",
    "48": "Caza estelar Jedi, pequeña pero versátil nave que requiere un anillo de hiperimpulsor externo para viajes interestelares.",
    "52": "Nave de asalto de la República, utilizada para transportar clones y vehículos de guerra durante las Guerras Clon.",
    "63": "Crucero de ataque de la República, precursor del Destructor Estelar Imperial, utilizado extensivamente en las Guerras Clon.",
    "64": "Yate estelar de Naboo J-type, nave diplomática usada por Padmé Amidala durante las Guerras Clon.",
    "65": "Interceptor Jedi Eta-2, evolución del caza estelar Delta-7, más pequeño y ágil. Utilizado por Anakin y Obi-Wan.",
    "66": "ARC-170, robusto caza de reconocimiento de la República con tres tripulantes y gran potencia de fuego.",
    "74": "Caza estelar Belbullab-22, utilizado por el General Grievous durante las Guerras Clon."
};

// Categorización de facciones para agrupar naves
export const SHIP_FACTIONS = {
    REBELLION: "Alianza Rebelde",
    EMPIRE: "Imperio Galáctico",
    REPUBLIC: "República Galáctica",
    SEPARATIST: "Alianza Separatista",
    INDEPENDENT: "Independiente",
    UNKNOWN: "Desconocida"
};

// Asignación de facciones a cada nave
export const SHIP_FACTION_MAP = {
    "2": SHIP_FACTIONS.REBELLION,
    "3": SHIP_FACTIONS.EMPIRE,
    "5": SHIP_FACTIONS.EMPIRE,
    "9": SHIP_FACTIONS.EMPIRE,
    "10": SHIP_FACTIONS.REBELLION,
    "11": SHIP_FACTIONS.REBELLION,
    "12": SHIP_FACTIONS.REBELLION,
    "13": SHIP_FACTIONS.EMPIRE,
    "15": SHIP_FACTIONS.EMPIRE,
    "17": SHIP_FACTIONS.REBELLION,
    "21": SHIP_FACTIONS.INDEPENDENT,
    "22": SHIP_FACTIONS.EMPIRE,
    "23": SHIP_FACTIONS.REBELLION,
    "27": SHIP_FACTIONS.REBELLION,
    "28": SHIP_FACTIONS.REBELLION,
    "29": SHIP_FACTIONS.REBELLION,
    "31": SHIP_FACTIONS.REPUBLIC,
    "32": SHIP_FACTIONS.SEPARATIST,
    "39": SHIP_FACTIONS.REPUBLIC,
    "40": SHIP_FACTIONS.REPUBLIC,
    "41": SHIP_FACTIONS.SEPARATIST,
    "43": SHIP_FACTIONS.REPUBLIC,
    "47": SHIP_FACTIONS.INDEPENDENT,
    "48": SHIP_FACTIONS.REPUBLIC,
    "49": SHIP_FACTIONS.REPUBLIC,
    "52": SHIP_FACTIONS.REPUBLIC,
    "58": SHIP_FACTIONS.SEPARATIST,
    "59": SHIP_FACTIONS.SEPARATIST,
    "61": SHIP_FACTIONS.EMPIRE,
    "63": SHIP_FACTIONS.REPUBLIC,
    "64": SHIP_FACTIONS.REPUBLIC,
    "65": SHIP_FACTIONS.REPUBLIC,
    "66": SHIP_FACTIONS.REPUBLIC,
    "68": SHIP_FACTIONS.SEPARATIST,
    "74": SHIP_FACTIONS.SEPARATIST,
    "75": SHIP_FACTIONS.REPUBLIC
};