"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const optimization_1 = require("./modules/optimization");
// Datos de ejemplo
const routes = [
    { id: "route1", stops: ["A", "B", "C"], distance: 10 },
    { id: "route2", stops: ["A", "D", "E"], distance: 8 }
];
const result = (0, optimization_1.optimizeTravelTime)(routes, {});
console.log("Ruta óptima:", result.route);
console.log("Tiempo estimado:", result.travelTime);
