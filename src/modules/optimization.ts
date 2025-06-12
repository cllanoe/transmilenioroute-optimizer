interface Route {
    id: string;
    stops: string[];
    distance: number;
}

interface OptimizationResult {
    route: Route;
    travelTime: number;
}

export function optimizeTravelTime(routes: Route[], userPreferences: any): OptimizationResult {
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

function calculateTravelTime(route: Route, userPreferences: any): number {
    // Ejemplo: calcula el tiempo de viaje basado en la distancia y número de paradas.
    const baseTime = route.distance * 2; // 2 minutos por kilómetro
    const additionalTime = route.stops.length * 1; // 1 minuto por parada
    return baseTime + additionalTime;
}