import { optimizeTravelTime } from "./modules/optimization";

interface Route {
    id: string;
    stops: string[];
    distance: number;
}

interface OptimizationResult {
    route: Route;
    travelTime: number;
}

// Datos de ejemplo
const routes: Route[] = [
    { id: "route1", stops: ["A", "B", "C"], distance: 10 },
    { id: "route2", stops: ["A", "D", "E"], distance: 8 }
];

const result = optimizeTravelTime(routes, {});
console.log("Ruta óptima:", result.route);
console.log("Tiempo estimado:", result.travelTime);