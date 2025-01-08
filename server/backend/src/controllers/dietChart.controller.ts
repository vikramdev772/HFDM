import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { Prisma } from '@prisma/client';

export const dietChartController = {
  async create(req: Request, res: Response) {
    try {
      const dietChartData: Prisma.DietChartCreateInput = {
        patient: { connect: { id: parseInt(req.body.patientId) } },
        mealType: req.body.mealType,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions
      };

      const dietChart = await prisma.dietChart.create({
        data: dietChartData
      });
      res.status(201).json(dietChart);
    } catch (error) {
      console.error('Error creating diet chart:', error);
      res.status(500).json({ message: 'Error creating diet chart' });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const dietCharts = await prisma.dietChart.findMany({
        include: {
          patient: true
        }
      });
      res.json(dietCharts);
    } catch (error) {
      console.error('Error fetching diet charts:', error);
      res.status(500).json({ message: 'Error fetching diet charts' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const updateData: Prisma.DietChartUpdateInput = {
        mealType: req.body.mealType,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions
      };

      const dietChart = await prisma.dietChart.update({
        where: { id },
        data: updateData
      });
      res.json(dietChart);
    } catch (error) {
      console.error('Error updating diet chart:', error);
      res.status(500).json({ message: 'Error updating diet chart' });
    }
  }
};

