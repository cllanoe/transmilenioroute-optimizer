"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeTravelTime = void 0;
function optimizeTravelTime(routes, userPreferences) {
    let bestRoute = routes[0];
    let bestTime = calculateTravelTime(bestRoute, userPreferences);
    for (let i = 1; i < routes.length; i++) {
        const currentTime = calculateTravelTime(routes[i], userPreferences);
        if (currentTime < bestTime) {
            bestRoute = routes[i];
            bestTime = currentTime;
        }
    }
    return {
        route: bestRoute,
        travelTime: bestTime,
    };
}
exports.optimizeTravelTime = optimizeTravelTime;
function calculateTravelTime(route, userPreferences) {
    // Ejemplo: calcula el tiempo de viaje basado en la distancia y número de paradas.
    const baseTime = route.distance * 2; // 2 minutos por kilómetro
    const additionalTime = route.stops.length * 1; // 1 minuto por parada
    return baseTime + additionalTime;
}
