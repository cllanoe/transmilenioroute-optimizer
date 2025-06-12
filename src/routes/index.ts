import { Router } from 'express';
import { RouteController } from '../controllers/routeController';

const router = Router();
const routeController = new RouteController();

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

export default router;