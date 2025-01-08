import express, { Request, Response, NextFunction, RequestHandler } from 'express'; 
import { login } from '../controllers/auth.controller';
import { patientController } from '../controllers/patient.controller';
import { dietChartController } from '../controllers/dietChart.controller';
import { deliveryController } from '../controllers/delivery.controller';
import { verifyToken, checkRole } from '../middlewares/auth.middleware';

const router = express.Router();

// Auth routes
router.post('/login', login as RequestHandler);

// Patient routes
router.get(
  '/patients', 
  verifyToken as RequestHandler, 
  checkRole(['MANAGER', 'PANTRY']) as RequestHandler, 
  patientController.getAll as RequestHandler
);

router.get(
  '/patients/:id', 
  verifyToken as RequestHandler, 
  checkRole(['MANAGER', 'PANTRY']) as RequestHandler, 
  patientController.getById as RequestHandler
);

router.post(
  '/patients', 
  verifyToken as RequestHandler, 
  checkRole(['MANAGER']) as RequestHandler, 
  patientController.create as RequestHandler
);

router.put(
  '/patients/:id', 
  verifyToken as RequestHandler, 
  checkRole(['MANAGER']) as RequestHandler, 
  patientController.update as RequestHandler
);

router.delete(
  '/patients/:id', 
  verifyToken as RequestHandler, 
  checkRole(['MANAGER']) as RequestHandler, 
  patientController.delete as RequestHandler
);

// Diet Chart routes
router.get(
  '/diet-charts', 
  verifyToken as RequestHandler, 
  checkRole(['MANAGER', 'PANTRY']) as RequestHandler, 
  dietChartController.getAll as RequestHandler
);

router.post(
  '/diet-charts', 
  verifyToken as RequestHandler, 
  checkRole(['MANAGER']) as RequestHandler, 
  dietChartController.create as RequestHandler
);

router.put(
  '/diet-charts/:id', 
  verifyToken as RequestHandler, 
  checkRole(['MANAGER']) as RequestHandler, 
  dietChartController.update as RequestHandler
);

// Delivery routes
router.post(
  '/deliveries/assign', 
  verifyToken as RequestHandler, 
  checkRole(['MANAGER', 'PANTRY']) as RequestHandler, 
  deliveryController.assignDelivery as RequestHandler
);

router.put(
  '/deliveries/:id/complete', 
  verifyToken as RequestHandler, 
  checkRole(['DELIVERY']) as RequestHandler, 
  deliveryController.markComplete as RequestHandler
);

export default router;
