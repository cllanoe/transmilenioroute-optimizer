"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routeController_1 = require("../controllers/routeController");
const router = (0, express_1.Router)();
const routeController = new routeController_1.RouteController();
router.post('/optimize', (req, res) => {
    console.log('📨 Request received:', req.body);
    routeController.optimizeRoute(req, res)
        .catch(error => {
        console.error('🔴 Route error:', error);
        if (!res.headersSent) {
            res.status(500).json({
                status: 'error',
                message: error instanceof Error ? error.message : 'Internal server error'
            });
        }
    });
});
exports.default = router;
