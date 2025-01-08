import { Patient } from '@prisma/client'

export interface IDietChart {
  id: number
  patientId: number
  mealType: string
  ingredients: string[]
  instructions: string[]
  createdAt: Date
  updatedAt: Date
  patient?: Patient
}

export interface ICreateDietChartDTO {
  patientId: number
  mealType: string
  ingredients: string[]
  instructions: string[]
}

export interface IUpdateDietChartDTO extends Partial<ICreateDietChartDTO> {}

