
// src/controllers/dietChart.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const dietChartController = {
  async create(req: Request, res: Response) {
    try {
      const dietChart = await prisma.dietChart.create({
        data: req.body
      });
      res.status(201).json(dietChart);
    } catch (error) {
      res.status(500).json({ message: 'Error creating diet chart' });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const dietCharts = await prisma.dietChart.findMany({
        include: {
          patient: true,
          mealPreparations: true
        }
      });
      res.json(dietCharts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching diet charts' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const dietChart = await prisma.dietChart.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(dietChart);
    } catch (error) {
      res.status(500).json({ message: 'Error updating diet chart' });
    }
  }
};
