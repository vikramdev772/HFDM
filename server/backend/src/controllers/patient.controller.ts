import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { Patient, Prisma } from '@prisma/client';

export const patientController = {
  async create(req: Request, res: Response) {
    try {
      const patientData: Prisma.PatientCreateInput = {
        name: req.body.name,
        roomNumber: req.body.roomNumber,
        bedNumber: req.body.bedNumber,
        floorNumber: req.body.floorNumber,
        age: parseInt(req.body.age),
        gender: req.body.gender,
        contactInfo: req.body.contactInfo,
        emergencyContact: req.body.emergencyContact,
        diseases: req.body.diseases,
        allergies: req.body.allergies
      };

      const patient = await prisma.patient.create({
        data: patientData
      });
      res.status(201).json(patient);
    } catch (error) {
      console.error('Create patient error:', error);
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
      console.error('Get all patients error:', error);
      res.status(500).json({ message: 'Error fetching patients' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const patient = await prisma.patient.findUnique({
        where: { id },
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
      console.error('Get patient by ID error:', error);
      res.status(500).json({ message: 'Error fetching patient' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const updateData: Prisma.PatientUpdateInput = {
        name: req.body.name,
        roomNumber: req.body.roomNumber,
        bedNumber: req.body.bedNumber,
        floorNumber: req.body.floorNumber,
        age: req.body.age ? parseInt(req.body.age) : undefined,
        gender: req.body.gender,
        contactInfo: req.body.contactInfo,
        emergencyContact: req.body.emergencyContact,
        diseases: req.body.diseases,
        allergies: req.body.allergies
      };

      const patient = await prisma.patient.update({
        where: { id },
        data: updateData
      });
      res.json(patient);
    } catch (error) {
      console.error('Update patient error:', error);
      res.status(500).json({ message: 'Error updating patient' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await prisma.patient.delete({
        where: { id }
      });
      res.status(204).send();
    } catch (error) {
      console.error('Delete patient error:', error);
      res.status(500).json({ message: 'Error deleting patient' });
    }
  }
};