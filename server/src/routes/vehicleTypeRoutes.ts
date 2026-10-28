import { Router } from 'express';
import { VehicleTypeController } from '../controllers/vehicleTypeController';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { Permission } from '../config/constants';

export const vehicleTypeRouter = Router();

// Public route for landing page, customer booking widget, and apps
vehicleTypeRouter.get('/public', VehicleTypeController.getActiveVehicleTypes);

// Admin-protected routes
vehicleTypeRouter.use(authenticate);
vehicleTypeRouter.get('/', requirePermission(Permission.VEHICLES_VIEW), VehicleTypeController.getVehicleTypes);
vehicleTypeRouter.get('/:id', requirePermission(Permission.VEHICLES_VIEW), VehicleTypeController.getVehicleTypeById);
vehicleTypeRouter.post('/', requirePermission(Permission.VEHICLES_CREATE), VehicleTypeController.createVehicleType);
vehicleTypeRouter.put('/:id', requirePermission(Permission.VEHICLES_EDIT), VehicleTypeController.updateVehicleType);
vehicleTypeRouter.patch('/:id/status', requirePermission(Permission.VEHICLES_EDIT), VehicleTypeController.toggleStatus);
vehicleTypeRouter.delete('/:id', requirePermission(Permission.VEHICLES_DELETE), VehicleTypeController.deleteVehicleType);
