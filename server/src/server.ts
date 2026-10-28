import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';
import { ENV } from './config/environment';
import { connectDB } from './config/db';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { SimulationService } from './services/simulationService';
import { TrackingService } from './services/trackingService';
import { VehicleTypeService } from './services/vehicleTypeService';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
export const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

import path from 'path';
import fs from 'fs';

// Security & Utility Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // 1000 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
});
// Serve Static Uploads (documents & driver KYC files)
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Mount Master API Router
app.use('/api', apiRouter);

// Serve Frontend in Production / Unified Deployment
const clientDistCandidates = [
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(__dirname, '../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
];

const clientDistPath = clientDistCandidates.find((p) => fs.existsSync(p));

if (clientDistPath) {
  logger.info(`Serving static frontend build from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

// Socket.IO Real-Time Event Handlers
io.on('connection', (socket) => {
  logger.info(`⚡ Socket connected: ${socket.id}`);

  socket.on('join:fleet', () => {
    socket.join('admin-fleet');
    logger.debug(`Socket ${socket.id} joined admin-fleet`);
  });

  socket.on('join:booking', (bookingId: string) => {
    if (bookingId) {
      socket.join(`booking:${bookingId}`);
      logger.debug(`Socket ${socket.id} joined room booking:${bookingId}`);
    }
  });

  socket.on('join:driver', (driverId: string) => {
    if (driverId) {
      socket.join(`driver:${driverId}`);
      logger.debug(`Socket ${socket.id} joined room driver:${driverId}`);
    }
  });

  socket.on('join:customer', (customerId: string) => {
    if (customerId) {
      socket.join(`customer:${customerId}`);
      logger.debug(`Socket ${socket.id} joined room customer:${customerId}`);
    }
  });

  socket.on('driver:location_update', async (data) => {
    try {
      const { driverId, bookingId, lat, lng, heading, speed, address } = data;
      if (!driverId || lat === undefined || lng === undefined) return;

      const updated = await TrackingService.updateDriverLocation(
        driverId,
        Number(lat),
        Number(lng),
        Number(heading || 0),
        Number(speed || 0),
        address || 'In Transit'
      );

      const locationPayload = {
        driverId,
        bookingId,
        lat: Number(lat),
        lng: Number(lng),
        heading: Number(heading || 0),
        speed: Number(speed || 0),
        timestamp: new Date().toISOString(),
      };

      // Broadcast to Admin Fleet Map
      io.to('admin-fleet').emit('driver:moved', updated);

      // Broadcast live to customer app tracking this specific booking
      if (bookingId) {
        io.to(`booking:${bookingId}`).emit('trip:location_update', locationPayload);
      }
      io.emit('driver:location_broadcast', locationPayload);
    } catch (err) {
      logger.error('Error handling driver location update:', err);
    }
  });

  socket.on('driver:status_change', (data) => {
    io.emit('driver:status_changed', data);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Start Server and Database Connection
const startServer = async () => {
  try {
    await connectDB();
    await VehicleTypeService.seedDefaultVehicleTypes().catch((e) =>
      logger.warn(`VehicleType seed warning: ${e.message}`)
    );

    server.listen(ENV.PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
      logger.info(`📍 API endpoint: http://0.0.0.0:${ENV.PORT}/api`);

      // Start Background Fleet Simulation Engine
      if (ENV.SIMULATION_ENABLED) {
        SimulationService.startSimulation();
      }
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
