import { StarWarsApp } from './app.js';
import './pwa.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = new StarWarsApp();
    app.init();
    
    console.log('Star Wars Starships App initialized');
});