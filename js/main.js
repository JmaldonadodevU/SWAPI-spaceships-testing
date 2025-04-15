import { StarWarsApp } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = new StarWarsApp();
    app.init();
    
    console.log('Star Wars Starships App initialized');
});