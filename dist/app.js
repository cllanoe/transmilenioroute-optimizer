"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Essential middleware first - ORDER IS IMPORTANT
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API routes BEFORE static files
app.use('/api', (req, res, next) => {
    // Set JSON headers explicitly
    res.setHeader('Content-Type', 'application/json');
    next();
}, routes_1.default);
// Static files after API routes
app.use(express_1.default.static('public'));
// Logging middleware
app.use((req, res, next) => {
    console.log('\n🔄 Nueva petición:');
    console.log(`📨 ${req.method} ${req.path}`);
    console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    next();
});
// Error handler at the end
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Error interno del servidor'
    });
});
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
exports.default = app;
