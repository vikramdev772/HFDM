
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('\n\t ✅ Successfully connected to the database');
  } catch (error) {
    console.error('\n\t ❌ Failed to connect to the database:', error);
    process.exit(1);
  }
}

export { prisma };
