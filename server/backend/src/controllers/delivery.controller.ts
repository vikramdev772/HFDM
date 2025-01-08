
// src/controllers/delivery.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const deliveryController = {
  async assignDelivery(req: Request, res: Response) {
    try {
      const { deliveryId, staffId } = req.body;
      const delivery = await prisma.mealDelivery.update({
        where: { id: deliveryId },
        data: {
          assignedTo: staffId,
          status: 'IN_PROGRESS'
        }
      });
      res.json(delivery);
    } catch (error) {
      res.status(500).json({ message: 'Error assigning delivery' });
    }
  },

  async markComplete(req: Request, res: Response) {
    try {
      const delivery = await prisma.mealDelivery.update({
        where: { id: req.params.id },
        data: {
          status: 'DELIVERED',
          deliveryTime: new Date()
        }
      });
      res.json(delivery);
    } catch (error) {
      res.status(500).json({ message: 'Error updating delivery status' });
    }
  }
};