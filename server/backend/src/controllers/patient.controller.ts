
// src/controllers/patient.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const patientController = {
  async create(req: Request, res: Response) {
    try {
      const patient = await prisma.patient.create({
        data: req.body
      });
      res.status(201).json(patient);
    } catch (error) {
      res.status(500).json({ message: 'Error creating patient' });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const patients = await prisma.patient.findMany({
        include: {
          dietCharts: true,
          mealDeliveries: true
        }
      });
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching patients' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const patient = await prisma.patient.findUnique({
        where: { id: req.params.id },
        include: {
          dietCharts: true,
          mealDeliveries: true
        }
      });
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching patient' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const patient = await prisma.patient.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: 'Error updating patient' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await prisma.patient.delete({
        where: { id: req.params.id }
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting patient' });
    }
  }
};
