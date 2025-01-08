import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { Prisma } from '@prisma/client';

export const deliveryController = {
  async assignDelivery(req: Request, res: Response) {
    try {
      const { deliveryId, staffId } = req.body;
      const delivery = await prisma.mealDelivery.update({
        where: { id: parseInt(deliveryId) },
        data: {
          status: 'IN_PROGRESS'
        }
      });
      res.json(delivery);
    } catch (error) {
      console.error('Error assigning delivery:', error);
      res.status(500).json({ message: 'Error assigning delivery' });
    }
  },

  async markComplete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const delivery = await prisma.mealDelivery.update({
        where: { id },
        data: {
          status: 'DELIVERED',
          deliveryTime: new Date()
        }
      });
      res.json(delivery);
    } catch (error) {
      console.error('Error updating delivery status:', error);
      res.status(500).json({ message: 'Error updating delivery status' });
    }
  }
};

