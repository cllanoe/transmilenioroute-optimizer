import { Request, Response } from 'express';
import { EventEmitter } from 'events';

interface Stop {
    name: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    estimatedTime: string;
}

interface TransmilenioRoute {
    id: string;
    name: string;
    stops: Stop[];
    distance: number;
    estimatedDuration: string;
    frequency: string;
    status: string;
    lastUpdated: string;
}

interface Node {
    station: string;
    distance: number;
    path: string[];
    routeName?: string;
}

interface RouteResponse {
    type: string;
    stops: { name: string; coordinates: { lat: number; lng: number; } | null; }[];
    distance: number;
    estimatedDuration: string;
    routes: string[];
    logs: string[];
    // Para rutas directas
    routeName?: string;
    frequency?: string;
    // Para rutas con transbordo
    firstLeg?: {
        routeName: string;
        stops: { name: string; coordinates: { lat: number; lng: number; } | null; }[];
        distance: number;
        estimatedDuration: string;
        frequency: string;
    };
    transferStation?: string;
    transferType?: string;
    secondLeg?: {
        routeName: string;
        stops: { name: string; coordinates: { lat: number; lng: number; } | null; }[];
        distance: number;
        estimatedDuration: string;
        frequency: string;
    };
    totalDistance?: number;
}

export class RouteController {
    // Change access modifier to protected
    protected testRoutes: TransmilenioRoute[];

    private mainTransferStations = [
        "Calle 72",        // Conexión central para todas las troncales
        "Escuela Militar", // Conexión entre troncal Norte y Sur
        "Calle 76",        // Conexión entre troncales Norte y Suba
        "Estación Calle 80", // Conexión con troncal 80
        "Santa Isabel",    // Conexión sur
        "Minuto"          // Conexión occidental
    ];

    private routeEmitter: EventEmitter;

    constructor() {
        this.testRoutes = []; // Initialize empty array
        this.loadRoutes(); // Load routes in constructor
        this.routeEmitter = new EventEmitter();
    }

    // Remove old getRoutes methods and replace with this single method
   
    private loadRoutes(): void {
        // Move route initialization here
        this.testRoutes = [
            {
                id: "route1",
                name: "Ruta Norte-Centro",
                stops: [
                    {
                        name: "Portal Norte",
                        coordinates: { lat: 4.7545, lng: -74.0913 },
                        estimatedTime: "05:30"
                    },
                    {
                        name: "Calle 100",
                        coordinates: { lat: 4.6866, lng: -74.0578 },
                        estimatedTime: "05:45"
                    },
                    {
                        name: "Calle 72",
                        coordinates: { lat: 4.6585, lng: -74.0630 },
                        estimatedTime: "06:00"
                    }
                ],
                distance: 8.5,
                estimatedDuration: "30 minutos",
                frequency: "cada 5 minutos",
                status: "activa",
                lastUpdated: new Date().toISOString()
            },
            {
                id: "route2",
                name: "Ruta Occidente-Centro",
                stops: [
                    {
                        name: "Portal 80",
                        coordinates: { lat: 4.6907, lng: -74.1216 },
                        estimatedTime: "05:45"
                    },
                    {
                        name: "Minuto",
                        coordinates: { lat: 4.6761, lng: -74.1001 },
                        estimatedTime: "06:00"
                    },
                    {
                        name: "Calle 72",
                        coordinates: { lat: 4.6585, lng: -74.0630 },
                        estimatedTime: "06:15"
                    }
                ],
                distance: 10.2,
                estimatedDuration: "35 minutos",
                frequency: "cada 8 minutos",
                status: "activa",
                lastUpdated: new Date().toISOString()
            },
            {
                id: "route3",
                name: "Ruta Sur-Centro",
                stops: [
                    {
                        name: "Portal Sur",
                        coordinates: { lat: 4.5781, lng: -74.1351 },
                        estimatedTime: "05:15"
                    },
                    {
                        name: "Madelena",
                        coordinates: { lat: 4.5912, lng: -74.1567 },
                        estimatedTime: "05:30"
                    },
                    {
                        name: "Comuneros",
                        coordinates: { lat: 4.5989, lng: -74.1123 },
                        estimatedTime: "05:45"
                    },
                    {
                        name: "Centro",
                        coordinates: { lat: 4.6097, lng: -74.0817 },
                        estimatedTime: "06:00"
                    }
                ],
                distance: 12.3,
                estimatedDuration: "45 minutos",
                frequency: "cada 6 minutos",
                status: "activa",
                lastUpdated: new Date().toISOString()
            },
            {
                id: "route4",
                name: "Ruta Express Suba",
                stops: [
                    {
                        name: "Portal Suba",
                        coordinates: { lat: 4.7445, lng: -74.0936 },
                        estimatedTime: "06:00"
                    },
                    {
                        name: "Humedal Córdoba",
                        coordinates: { lat: 4.7201, lng: -74.0671 },
                        estimatedTime: "06:15"
                    },
                    {
                        name: "Pepe Sierra",
                        coordinates: { lat: 4.6984, lng: -74.0527 },
                        estimatedTime: "06:25"
                    },
                    {
                        name: "Virrey",
                        coordinates: { lat: 4.6741, lng: -74.0541 },
                        estimatedTime: "06:35"
                    }
                ],
                distance: 9.8,
                estimatedDuration: "35 minutos",
                frequency: "cada 7 minutos",
                status: "activa",
                lastUpdated: new Date().toISOString()
            },
            {
                id: "route5",
                name: "Ruta Express Américas",
                stops: [
                    {
                        name: "Portal Américas",
                        coordinates: { lat: 4.6289, lng: -74.1619 },
                        estimatedTime: "05:30"
                    },
                    {
                        name: "Banderas",
                        coordinates: { lat: 4.6317, lng: -74.1458 },
                        estimatedTime: "05:45"
                    },
                    {
                        name: "Ricaurte",
                        coordinates: { lat: 4.6147, lng: -74.1001 },
                        estimatedTime: "06:00"
                    },
                    {
                        name: "San Façon",
                        coordinates: { lat: 4.6147, lng: -74.0898 },
                        estimatedTime: "06:15"
                    }
                ],
                distance: 11.5,
                estimatedDuration: "45 minutos",
                frequency: "cada 4 minutos",
                status: "activa",
                lastUpdated: new Date().toISOString()
            },
            {
                id: "route6",
                name: "Ruta Calle 80",
                stops: [
                    {
                        name: "Portal 80",
                        coordinates: { lat: 4.6907, lng: -74.1216 },
                        estimatedTime: "05:30"
                    },
                    {
                        name: "Estación Calle 80",
                        coordinates: { lat: 4.6691, lng: -74.0866 },
                        estimatedTime: "05:45"
                    },
                    {
                        name: "Minuto",
                        coordinates: { lat: 4.6761, lng: -74.1001 },
                        estimatedTime: "06:00"
                    }
                ],
                distance: 7.5,
                estimatedDuration: "25 minutos",
                frequency: "cada 4 minutos",
                status: "activa",
                lastUpdated: new Date().toISOString()
            },
            {
                id: "route7",
                name: "Ruta Suba-76",
                stops: [
                    {
                        name: "Portal Suba",
                        coordinates: { lat: 4.7445, lng: -74.0936 },
                        estimatedTime: "05:30"
                    },
                    {
                        name: "Calle 76",
                        coordinates: { lat: 4.6665, lng: -74.0630 },
                        estimatedTime: "05:45"
                    },
                    {
                        name: "Calle 72",
                        coordinates: { lat: 4.6585, lng: -74.0630 },
                        estimatedTime: "06:00"
                    }
                ],
                distance: 8.2,
                estimatedDuration: "30 minutos",
                frequency: "cada 5 minutos",
                status: "activa",
                lastUpdated: new Date().toISOString()
            },
            {
                id: "route8",
                name: "Ruta Norte-80",
                stops: [
                    {
                        name: "Portal Norte",
                        coordinates: { lat: 4.7545, lng: -74.0913 },
                        estimatedTime: "05:30"
                    },
                    {
                        name: "Calle 100",
                        coordinates: { lat: 4.6866, lng: -74.0578 },
                        estimatedTime: "05:45"
                    },
                    {
                        name: "Estación Calle 80",
                        coordinates: { lat: 4.6691, lng: -74.0866 },
                        estimatedTime: "06:00"
                    }
                ],
                distance: 9.0,
                estimatedDuration: "30 minutos",
                frequency: "cada 6 minutos",
                status: "activa",
                lastUpdated: new Date().toISOString()
            },
            {
                id: "troncal-norte",
                name: "Troncal Portal Norte",
                stops: [
                    {
                        name: "Portal Norte",
                        coordinates: { lat: 4.7545, lng: -74.0913 },
                        estimatedTime: "05:00"
                    },
                    {
                        name: "Calle 100",
                        coordinates: { lat: 4.6866, lng: -74.0578 },
                        estimatedTime: "05:15"
                    },
                    {
                        name: "Calle 76",
                        coordinates: { lat: 4.6665, lng: -74.0630 },
                        estimatedTime: "05:30"
                    },
                    {
                        name: "Calle 72",
                        coordinates: { lat: 4.6585, lng: -74.0630 },
                        estimatedTime: "05:45"
                    },
                    {
                        name: "Estación Calle 80",
                        coordinates: { lat: 4.6691, lng: -74.0866 },
                        estimatedTime: "06:00"
                    }
                ],
                distance: 12.0,
                estimatedDuration: "60 minutos",
                frequency: "cada 3 minutos",
                status: "activa",
                lastUpdated: new Date().toISOString()
            },
            {
                id: "troncal-suba",
                name: "Troncal Portal Suba",
                stops: [
                    {
                        name: "Portal Suba",
                        coordinates: { lat: 4.7445, lng: -74.0936 },
                        estimatedTime: "05:00"
                    },
                    {
                        name: "Humedal Córdoba",
                        coordinates: { lat: 4.7201, lng: -74.0671 },
                        estimatedTime: "05:15"
                    },
                    {
                        name: "Calle 76",
                        coordinates: { lat: 4.6665, lng: -74.0630 },
                        estimatedTime: "05:30"
                    },
                    {
                        name: "Calle 72",
                        coordinates: { lat: 4.6585, lng: -74.0630 },
                        estimatedTime: "05:45"
                    },
                    {
                        name: "Estación Calle 80",
                        coordinates: { lat: 4.6691, lng: -74.0866 },
                        estimatedTime: "06:00"
                    }
                ],
                distance: 11.5,
                estimatedDuration: "60 minutos",
                frequency: "cada 3 minutos",
                status: "activa",
                lastUpdated: new Date().toISOString()
            },
            {
                id: "troncal-80",
                name: "Troncal Portal 80",
                stops: [
                    {
                        name: "Portal 80",
                        coordinates: { lat: 4.6907, lng: -74.1216 },
                        estimatedTime: "05:00"
                    },
                    {
                        name: "Minuto",
                        coordinates: { lat: 4.6761, lng: -74.1001 },
                        estimatedTime: "05:15"
                    },
                    {
                        name: "Estación Calle 80",
                        coordinates: { lat: 4.6691, lng: -74.0866 },
                        estimatedTime: "05:30"
                    },
                    {
                        name: "Calle 76",
                        coordinates: { lat: 4.6665, lng: -74.0630 },
                        estimatedTime: "05:45"
                    },
                    {
                        name: "Calle 72",
                        coordinates: { lat: 4.6585, lng: -74.0630 },
                        estimatedTime: "06:00"
                    }
                ],
                distance: 10.0,
                estimatedDuration: "60 minutos",
                frequency: "cada 3 minutos",
                status: "activa",
                lastUpdated: new Date().toISOString()
            },
            {
                id: "troncal-norte-completa",
                name: "Troncal Norte Completa",
                stops: [
                    {
                        name: "Portal Norte",
                        coordinates: { lat: 4.7545, lng: -74.0913 },
                        estimatedTime: "05:00"
                    },
                    {
                        name: "Calle 100",
                        coordinates: { lat: 4.6866, lng: -74.0578 },
                        estimatedTime: "05:15"
                    },
                    {
                        name: "Pepe Sierra",
                        coordinates: { lat: 4.6984, lng: -74.0527 },
                        estimatedTime: "05:25"
                    },
                    {
                        name: "Virrey",
                        coordinates: { lat: 4.6741, lng: -74.0541 },
                        estimatedTime: "05:35"
                    },
                    {
                        name: "Calle 76",
                        coordinates: { lat: 4.6665, lng: -74.0630 },
                        estimatedTime: "05:45"
                    },
                    {
                        name: "Calle 72",
                        coordinates: { lat: 4.6585, lng: -74.0630 },
                        estimatedTime: "05:55"
                    }
                ],
                distance: 13.0,
                estimatedDuration: "55 minutos",
                frequency: "cada 3 minutos",
                status: "activa",
                lastUpdated: new Date().toISOString()
            },
            {
                id: "troncal-suba-completa",
                name: "Troncal Suba Completa",
                stops: [
                    {
                        name: "Portal Suba",
                        coordinates: { lat: 4.7445, lng: -74.0936 },
                        estimatedTime: "05:00"
                    },
                    {
                        name: "Humedal Córdoba",
                        coordinates: { lat: 4.7201, lng: -74.0671 },
                        estimatedTime: "05:15"
                    },
                    {
                        name: "Shaio",
                        coordinates: { lat: 4.7101, lng: -74.0661 },
                        estimatedTime: "05:25"
                    },
                    {
                        name: "Calle 76",
                        coordinates: { lat: 4.6665, lng: -74.0630 },
                        estimatedTime: "05:35"
                    },
                    {
                        name: "Calle 72",
                        coordinates: { lat: 4.6585, lng: -74.0630 },
                        estimatedTime: "05:45"
                    }
                ],
                distance: 11.0,
                estimatedDuration: "45 minutos",
                frequency: "cada 3 minutos",
                status: "activa",
                lastUpdated: new Date().toISOString()
            },
            {
                id: "troncal-sur-completa",
                name: "Troncal Sur Completa",
                stops: [
                    {
                        name: "Portal Sur",
                        coordinates: { lat: 4.5781, lng: -74.1351 },
                        estimatedTime: "05:00"
                    },
                    {
                        name: "Madelena",
                        coordinates: { lat: 4.5912, lng: -74.1567 },
                        estimatedTime: "05:15"
                    },
                    {
                        name: "Comuneros",
                        coordinates: { lat: 4.5989, lng: -74.1123 },
                        estimatedTime: "05:25"
                    },
                    {
                        name: "Santa Isabel",
                        coordinates: { lat: 4.6097, lng: -74.0917 },
                        estimatedTime: "05:35"
                    },
                    {
                        name: "Escuela Militar",
                        coordinates: { lat: 4.6741, lng: -74.0541 },
                        estimatedTime: "05:45"
                    },
                    {
                        name: "Calle 72",
                        coordinates: { lat: 4.6585, lng: -74.0630 },
                        estimatedTime: "05:55"
                    }
                ],
                distance: 13.5,
                estimatedDuration: "55 minutos",
                frequency: "cada 3 minutos",
                status: "activa",
                lastUpdated: new Date().toISOString()
            }
        ];
    }

 
    
    // If called as internal method


    public optimizeRoute(req: Request, res: Response): Promise<RouteResponse> {
        return new Promise((resolve, reject) => {
            try {
                console.log('\n🚀 Iniciando optimización de ruta');
                const { startStation, endStation } = req.body;
                
                if (!startStation || !endStation) {
                    console.log('❌ Error: Faltan parámetros');
                    res.status(400).json({
                        status: 'error',
                        message: 'Se requieren estación de origen y destino'
                    });
                    return reject(new Error('Faltan parámetros'));
                }

                console.log(`\n🔍 Buscando ruta de ${startStation} a ${endStation}`);
                const route = this.calculateBestRoute(startStation, endStation);

                if (!route) {
                    console.log('❌ No se encontró una ruta válida');
                    res.status(404).json({
                        status: 'error',
                        message: 'No se encontró una ruta válida'
                    });
                    return reject(new Error('No se encontró ruta'));
                }

                // Mostrar detalles de la ruta en la terminal
                console.log('\n📍 Detalles de la ruta encontrada:');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log(`🚉 Estaciones: ${route.stops.map(s => s.name).join(' → ')}`);
                console.log(`📏 Distancia total: ${route.distance.toFixed(2)} km`);
                console.log(`⏱️ Tiempo estimado: ${route.estimatedDuration}`);
                console.log(`🚌 Rutas: ${route.routes.join(', ')}`);
                console.log('📝 Logs:');
                route.logs.forEach(log => console.log(`   ${log}`));
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

                res.status(200).json({
                    status: 'success',
                    data: route
                });
                return resolve(route);
            } catch (error) {
                console.error('❌ Error en optimizeRoute:', error);
                if (!res.headersSent) {
                    res.status(500).json({
                        status: 'error',
                        message: error instanceof Error ? error.message : 'Error interno del servidor'
                    });
                }
                return reject(error);
            }
        });
    }

    private calculateBestRoute(startStation: string, endStation: string) {
        console.log(`🔍 Buscando ruta: ${startStation} → ${endStation}`);
        const startTime = performance.now();

        try {
            // Intentar con Dijkstra primero
            console.log('Aplicando algoritmo de Dijkstra...');
            const dijkstraRoute = this.findShortestPath(startStation, endStation);
            
            if (dijkstraRoute) {
                const executionTime = performance.now() - startTime;
                console.log(`✅ Ruta Dijkstra encontrada en ${executionTime.toFixed(2)}ms`);
                console.log('📍 Detalles de la ruta:', {
                    tipo: dijkstraRoute.type,
                    distancia: dijkstraRoute.distance,
                    duracion: dijkstraRoute.estimatedDuration,
                    paradas: dijkstraRoute.stops.length
                });
                return dijkstraRoute;
            }
            
            console.log('⚠️ Dijkstra no encontró ruta, intentando ruta directa...');
            const directRoute = this.findDirectRoute(startStation, endStation);
            
            if (directRoute) {
                console.log('✅ Ruta directa encontrada');
                return directRoute;
            }

            console.log('❌ No se encontró ninguna ruta válida');
            return null;

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.error('❌ Error en la búsqueda:', errorMessage);
            if (error instanceof Error) {
                console.error('Stack:', error.stack);
            }
            return null;
        }
    }

    private findDirectRoute(startStation: string, endStation: string): RouteResponse | null {
        const possibleRoutes = this.testRoutes.filter(route => {
            const stationNames = route.stops.map(stop => stop.name);
            return stationNames.includes(startStation) && stationNames.includes(endStation);
        });

        if (possibleRoutes.length === 0) return null;

        // Encontrar la ruta más corta
        let bestRoute = possibleRoutes[0];
        let shortestDistance = bestRoute.distance;

        for (const route of possibleRoutes) {
            if (route.distance < shortestDistance) {
                bestRoute = route;
                shortestDistance = route.distance;
            }
        }

        const startIndex = bestRoute.stops.findIndex(stop => stop.name === startStation);
        const endIndex = bestRoute.stops.findIndex(stop => stop.name === endStation);
        const relevantStops = bestRoute.stops.slice(
            Math.min(startIndex, endIndex),
            Math.max(startIndex, endIndex) + 1
        );

        return {
            type: 'direct',
            routeName: bestRoute.name,
            stops: relevantStops,
            distance: bestRoute.distance,
            estimatedDuration: bestRoute.estimatedDuration,
            frequency: bestRoute.frequency,
            routes: [bestRoute.name],
            logs: [`Ruta directa encontrada: ${bestRoute.name}`]
        };
    }

    // Modificar el método findRouteWithTransfer para manejar mejor los transbordos
    private findRouteWithTransfer(startStation: string, endStation: string): RouteResponse | null {
        const startRoutes = this.testRoutes.filter(route => 
            route.stops.some(stop => stop.name === startStation)
        );

        const endRoutes = this.testRoutes.filter(route => 
            route.stops.some(stop => stop.name === endStation)
        );

        let bestTransferRoute = null;
        let shortestTotalDistance = Infinity;

        // Para cada estación de transbordo principal
        for (const transferStation of this.mainTransferStations) {
            // Buscar rutas que conecten origen con transbordo
            const routesToTransfer = this.testRoutes.filter(route =>
                route.stops.some(stop => stop.name === startStation) &&
                route.stops.some(stop => stop.name === transferStation)
            );

            // Buscar rutas que conecten transbordo con destino
            const routesFromTransfer = this.testRoutes.filter(route =>
                route.stops.some(stop => stop.name === transferStation) &&
                route.stops.some(stop => stop.name === endStation)
            );

            // Si encontramos ambas partes de la ruta
            if (routesToTransfer.length > 0 && routesFromTransfer.length > 0) {
                const firstLeg = this.findDirectRoute(startStation, transferStation);
                const secondLeg = this.findDirectRoute(transferStation, endStation);

                if (firstLeg && secondLeg) {
                    const totalDistance = firstLeg.distance + secondLeg.distance;

                    if (totalDistance < shortestTotalDistance) {
                        shortestTotalDistance = totalDistance;
                        bestTransferRoute = {
                            type: 'transfer',
                            // Add required properties from RouteResponse interface
                            stops: [...firstLeg.stops, ...secondLeg.stops],
                            distance: totalDistance,
                            routes: [routesToTransfer[0].name, routesFromTransfer[0].name],
                            estimatedDuration: `${parseInt(firstLeg.estimatedDuration) + parseInt(secondLeg.estimatedDuration)} minutos`,

                            logs: [`Ruta con transbordo encontrada en: ${transferStation}`],
                            // Optional transfer-specific properties
                            firstLeg: {
                                routeName: routesToTransfer[0].name,
                                stops: firstLeg.stops,
                                distance: firstLeg.distance,
                                estimatedDuration: firstLeg.estimatedDuration,
                                frequency: routesToTransfer[0].frequency
                            },
                            transferStation: transferStation,
                            transferType: 'estación de conexión',
                            secondLeg: {
                                routeName: routesFromTransfer[0].name,
                                stops: secondLeg.stops,
                                distance: secondLeg.distance,
                                estimatedDuration: secondLeg.estimatedDuration,
                                frequency: routesFromTransfer[0].frequency
                            },
                            totalDistance: totalDistance
                        };
                    }
                }
            }
        }

        return bestTransferRoute;
    }

    private findShortestPath(startStation: string, endStation: string): RouteResponse | null {
        const startTime = performance.now();
        console.log('🔍 Iniciando búsqueda de ruta más corta...');

        // 1. Construir el grafo una sola vez
        const graph = new Map<string, Map<string, number>>();
        this.testRoutes.forEach(route => {
            const weight = route.distance / (route.stops.length - 1);
            for (let i = 0; i < route.stops.length - 1; i++) {
                const a = route.stops[i].name;
                const b = route.stops[i + 1].name;
                if (!graph.has(a)) graph.set(a, new Map());
                if (!graph.has(b)) graph.set(b, new Map());
                graph.get(a)!.set(b, Math.min(graph.get(a)!.get(b) ?? Infinity, weight));
                graph.get(b)!.set(a, Math.min(graph.get(b)!.get(a) ?? Infinity, weight));
            }
        });
        console.log('📊 Grafo construido');

        // 2. Inicializar estructuras
        const distances = new Map<string, number>();
        const previous = new Map<string, string>();
        const visited = new Set<string>();

        for (const node of graph.keys()) {
            distances.set(node, node === startStation ? 0 : Infinity);
        }

        console.log('⚙️ Estructuras inicializadas');

        // 3. Bucle principal
        while (visited.size < graph.size) {
            let current: string | null = null;
            let minDist = Infinity;

            // Encontrar el nodo más cercano no visitado
            for (const [node, dist] of distances) {
                if (!visited.has(node) && dist < minDist) {
                    minDist = dist;
                    current = node;
                }
            }

            if (current === null || current === endStation) break;

            visited.add(current);
            console.log(`🔄 Procesando estación: ${current}`);

            // Actualizar distancias
            const neighbors = graph.get(current)!;
            for (const [neighbor, weight] of neighbors) {
                if (visited.has(neighbor)) continue;
                const alt = minDist + weight;
                if (alt < (distances.get(neighbor) ?? Infinity)) {
                    distances.set(neighbor, alt);
                    previous.set(neighbor, current);
                }
            }
        }

        // 4. Reconstruir la ruta
        if (!previous.has(endStation) && startStation !== endStation) {
            console.log('❌ No se encontró ruta');
            return null;
        }

        const path: string[] = [];
        let current = endStation;
        while (current !== startStation) {
            path.unshift(current);
            current = previous.get(current)!;
        }
        path.unshift(startStation);

        const executionTime = performance.now() - startTime;
        console.log(`✅ Ruta encontrada en ${executionTime.toFixed(2)}ms`);
        console.log('🛣️ Ruta:', path.join(' → '));

        const response: RouteResponse = {
            type: 'dijkstra',
            stops: path.map(station => ({
                name: station,
                coordinates: this.getStationCoordinates(station)
            })),
            distance: distances.get(endStation)!,
            estimatedDuration: `${Math.round(distances.get(endStation)! * 3)} minutos`,
            routes: this.getRoutesForPath(path),
            logs: [`Ruta encontrada en ${executionTime.toFixed(2)}ms: ${path.join(' → ')}`]
        };

        console.log('📤 Enviando respuesta');
        return response;
    }

    private heuristic(station1: string, station2: string): number {
        const coord1 = this.getStationCoordinates(station1);
        const coord2 = this.getStationCoordinates(station2);
        
        if (!coord1 || !coord2) return Infinity;
        
        return Math.sqrt(
            Math.pow(coord1.lat - coord2.lat, 2) + 
            Math.pow(coord1.lng - coord2.lng, 2)
        );
    }

    private findShortestPathAStar(startStation: string, endStation: string): RouteResponse | null {
        const startTime = performance.now();
        let iterationCount = 0;
        const maxIterations = 1000; // Límite de seguridad
        
        // Función para emitir estado
        const emitStatus = (message: string) => {
            const currentTime = ((performance.now() - startTime) / 1000).toFixed(1);
            this.routeEmitter.emit('progress', { 
                progress: Math.min(99, Math.round((iterationCount / maxIterations) * 100)),
                message: `⏱️ ${currentTime}s | ${message} | Iteración: ${iterationCount}`,
                timeElapsed: currentTime
            });
        };

        const openSet = new Set<string>([startStation]);
        const closedSet = new Set<string>();
        const gScore = new Map<string, number>();
        const fScore = new Map<string, number>();
        const previous = new Map<string, string>();
        const graph = new Map<string, Map<string, number>>();

        // Inicializar grafo
        this.testRoutes.forEach(route => {
            for (let i = 0; i < route.stops.length - 1; i++) {
                const current = route.stops[i].name;
                const next = route.stops[i + 1].name;
                const distance = route.distance / (route.stops.length - 1);

                if (!graph.has(current)) graph.set(current, new Map());
                if (!graph.has(next)) graph.set(next, new Map());

                graph.get(current)!.set(next, distance);
                graph.get(next)!.set(current, distance);
            }
        });

        // Inicializar scores
        gScore.set(startStation, 0);
        fScore.set(startStation, this.heuristic(startStation, endStation));

        let progress = 0;
        const totalStations = graph.size;

        while (openSet.size > 0 && iterationCount < maxIterations) {
            iterationCount++;
            
            // Emitir estado cada 10 iteraciones
            if (iterationCount % 10 === 0) {
                emitStatus(`Analizando ${openSet.size} estaciones pendientes`);
            }

            // Encontrar nodo con menor fScore
            let current = Array.from(openSet).reduce((a, b) => 
                (fScore.get(a) || Infinity) < (fScore.get(b) || Infinity) ? a : b
            );

            if (current === endStation) {
                const executionTime = (performance.now() - startTime) / 1000;
                emitStatus(`✅ ¡Ruta encontrada! (${executionTime.toFixed(1)}s)`);
                const path: string[] = [];
                while (current) {
                    path.unshift(current);
                    current = previous.get(current)!;
                }

                return {
                    type: 'astar',
                    stops: path.map(station => ({
                        name: station,
                        coordinates: this.getStationCoordinates(station)
                    })),
                    distance: gScore.get(endStation)!,
                    estimatedDuration: `${Math.round(gScore.get(endStation)! * 3)} minutos`,
                    routes: this.getRoutesForPath(path),
                    logs: [`✅ Ruta A* encontrada en ${executionTime.toFixed(2)}ms: ${path.join(' → ')}`]
                };
            }

           
            if (performance.now() - startTime > 10000) { // 10 segundos máximo
                emitStatus('⚠️ Tiempo excedido, abortando búsqueda');
                return null;
            }

            openSet.delete(current);
            closedSet.add(current);

            // Emitir progreso
            const newProgress = Math.round((closedSet.size / totalStations) * 100);
            if (newProgress > progress) {
                progress = newProgress;
                this.routeEmitter.emit('progress', { 
                    progress, 
                    message: `🔍 A* analizando... ${progress}%` 
                });
            }

            // Evaluar vecinos
            const neighbors = graph.get(current) || new Map();
            for (const [neighbor, distance] of neighbors) {
                if (closedSet.has(neighbor)) continue;

                const tentativeGScore = gScore.get(current)! + distance;

                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                } else if (tentativeGScore >= (gScore.get(neighbor) || Infinity)) {
                    continue;
                }

                previous.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                fScore.set(neighbor, tentativeGScore + this.heuristic(neighbor, endStation));
            }
        }

        if (iterationCount >= maxIterations) {
            emitStatus('⚠️ Máximo de iteraciones alcanzado');
            return null;
        }

        return null;
    }

    private findGreedyRoute(startStation: string, endStation: string): RouteResponse | null {
        const startTime = performance.now();
        
        // Función para calcular la distancia euclidiana entre dos estaciones
        const getDistance = (station1: string, station2: string): number => {
            const coord1 = this.getStationCoordinates(station1);
            const coord2 = this.getStationCoordinates(station2);
            if (!coord1 || !coord2) return Infinity;
            return Math.sqrt(
                Math.pow(coord1.lat - coord2.lat, 2) + 
                Math.pow(coord1.lng - coord2.lng, 2)
            );
        };

        const path: string[] = [startStation];
        let current = startStation;
        const visited = new Set<string>([startStation]);
        let totalDistance = 0;

        while (current !== endStation) {
            let bestNextStation: string | null = null;
            let bestDistance = Infinity;

            // Recorre las rutas disponibles y evalúa las estaciones vecinas
            this.testRoutes.forEach((route) => {
                const currentIndex = route.stops.findIndex(stop => stop.name === current);
                if (currentIndex === -1) return;

                [-1, 1].forEach(direction => {
                    const nextIndex = currentIndex + direction;
                    if (nextIndex < 0 || nextIndex >= route.stops.length) return;
                    
                    const nextStation = route.stops[nextIndex].name;
                    if (visited.has(nextStation)) return;

                    const distanceToEnd = getDistance(nextStation, endStation);
                    if (distanceToEnd < bestDistance) {
                        bestDistance = distanceToEnd;
                        bestNextStation = nextStation;
                    }
                });
            });

            if (!bestNextStation) {
                console.log('❌ No se encontró camino. Estaciones visitadas:', visited.size, 'Ruta parcial:', path.join(' → '));
                return null;
            }

            visited.add(bestNextStation);
            path.push(bestNextStation);
            const stepDistance = getDistance(current, bestNextStation);
            totalDistance += stepDistance;
            console.log(`🔄 De ${current} a ${bestNextStation} (distancia: ${stepDistance.toFixed(2)})`);
            current = bestNextStation;

            // Evitar loops infinitos
            if (path.length > 100) {
                console.log('❌ Demasiadas iteraciones en búsqueda greedy. Ruta parcial:', path.join(' → '));
                return null;
            }
        }

        const executionTime = performance.now() - startTime;
        console.log(`✅ Ruta greedy encontrada en ${executionTime.toFixed(2)}ms`);
        console.log(`🛣️ Ruta greedy: ${path.join(' → ')}`);
        console.log(`ℹ️ Info adicional: Iteraciones: ${path.length}, Distancia total: ${totalDistance.toFixed(2)}, Estaciones visitadas: ${visited.size}`);
        console.log(`🤖 Algoritmo utilizado: Greedy`);

        return {
            type: 'greedy',
            stops: path.map(station => ({
                name: station,
                coordinates: this.getStationCoordinates(station)
            })),
            distance: totalDistance,
            estimatedDuration: `${Math.round(totalDistance * 3)} minutos`,
            routes: this.getRoutesForPath(path),
            logs: [
                `Ruta greedy encontrada en ${executionTime.toFixed(2)}ms`,
                `Ruta: ${path.join(' → ')}`,
                `Iteraciones: ${path.length}`,
                `Distancia total: ${totalDistance.toFixed(2)}`,
                `Estaciones visitadas: ${visited.size}`,
                `Algoritmo utilizado: Greedy`
            ]
        };
    }

    private getStationCoordinates(stationName: string): { lat: number; lng: number; } | null {
        const station = this.testRoutes
            .flatMap(route => route.stops)
            .find(stop => stop.name === stationName);
        
        return station ? station.coordinates : null;
    }

    private getRoutesForPath(path: string[]): string[] {
        const routes: string[] = [];
        const visitedStations = new Set<string>();

        for (const station of path) {
            const route = this.testRoutes.find(route => 
                route.stops.some(stop => stop.name === station) &&
                !visitedStations.has(station)
            );

            if (route) {
                routes.push(route.name);
                route.stops.forEach(stop => visitedStations.add(stop.name));
            }
        }

        return routes;
    }
}
