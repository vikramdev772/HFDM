import { Patient } from '@prisma/client'

export interface IMealDelivery {
  id: number
  patientId: number
  status: string
  deliveryTime?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
  patient?: Patient
}

export interface ICreateMealDeliveryDTO {
  patientId: number
  status: string
  deliveryTime?: Date
  notes?: string
}

export interface IUpdateMealDeliveryDTO extends Partial<ICreateMealDeliveryDTO> {}

