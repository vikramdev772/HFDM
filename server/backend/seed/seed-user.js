import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function seedUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('Password@2025', 10)

    // Create the manager user
    const user = await prisma.user.create({
      data: {
        email: 'hospital_manager@xyz.com',
        password: hashedPassword,
        name: 'Hospital Manager',
        role: 'MANAGER'
      }
    })

    console.log('User created successfully:', {
      id: user.id,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    console.error('Error seeding user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedUser()