import { DietChart, MealDelivery } from '@prisma/client'

export interface IPatient {
  id: number
  name: string
  roomNumber: string
  bedNumber: string
  floorNumber: string
  age: number
  gender: string
  contactInfo: string
  emergencyContact: string
  diseases: string[]
  allergies: string[]
  createdAt: Date
  updatedAt: Date
  dietCharts?: DietChart[]
  mealDeliveries?: MealDelivery[]
}

export interface ICreatePatientDTO {
  name: string
  roomNumber: string
  bedNumber: string
  floorNumber: string
  age: number
  gender: string
  contactInfo: string
  emergencyContact: string
  diseases: string[]
  allergies: string[]
}

export interface IUpdatePatientDTO extends Partial<ICreatePatientDTO> {}

