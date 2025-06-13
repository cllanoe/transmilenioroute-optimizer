import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';
import path from 'path';

const app: Application = express();

// Essential middleware first - ORDER IS IMPORTANT
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes BEFORE static files
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
    // Set JSON headers explicitly
    res.setHeader('Content-Type', 'application/json');
    next();
}, routes);

// Static files after API routes
app.use(express.static('public'));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('\n🔄 Nueva petición:');
    console.log(`📨 ${req.method} ${req.path}`);
    console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    next();
});

// Error handler at the end
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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


export default app;