
import express, { Request, Response, NextFunction } from 'express';
import { login } from '../controllers/auth.controller';
import { patientController } from '../controllers/patient.controller';
import { dietChartController } from '../controllers/dietChart.controller';
import { deliveryController } from '../controllers/delivery.controller';
import { verifyToken, checkRole } from '../middlewares/auth.middleware';

const router = express.Router();

// Auth routes
router.post('/login', login);

// Patient routes
router.get('/patients', verifyToken, checkRole(['MANAGER', 'PANTRY']), patientController.getAll);
router.get('/patients/:id', verifyToken, checkRole(['MANAGER', 'PANTRY']), patientController.getById);
router.post('/patients', verifyToken, checkRole(['MANAGER']), patientController.create);
router.put('/patients/:id', verifyToken, checkRole(['MANAGER']), patientController.update);
router.delete('/patients/:id', verifyToken, checkRole(['MANAGER']), patientController.delete);

// Diet Chart routes
router.get('/diet-charts', verifyToken, checkRole(['MANAGER', 'PANTRY']), dietChartController.getAll);
router.post('/diet-charts', verifyToken, checkRole(['MANAGER']), dietChartController.create);
router.put('/diet-charts/:id', verifyToken, checkRole(['MANAGER']), dietChartController.update);

// Delivery routes
router.post('/deliveries/assign', verifyToken, checkRole(['MANAGER', 'PANTRY']), deliveryController.assignDelivery);
router.put('/deliveries/:id/complete', verifyToken, checkRole(['DELIVERY']), deliveryController.markComplete);

export default router;

