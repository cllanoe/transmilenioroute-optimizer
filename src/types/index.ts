export interface Route {
    id: string;
    stops: string[];
    distance: number;
    // otros campos relevantes según tus necesidades
}

export interface OptimizationResult {
    route: Route;
    travelTime: number;
}