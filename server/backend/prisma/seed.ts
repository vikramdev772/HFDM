// // prisma/seed.ts
// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// async function main() {
//   // Clear existing data
//   await prisma.$transaction([
//     prisma.mealDelivery.deleteMany(),
//     prisma.mealPreparation.deleteMany(),
//     prisma.dietChart.deleteMany(),
//     prisma.patient.deleteMany(),
//     prisma.deliveryStaff.deleteMany(),
//     prisma.pantryStaff.deleteMany(),
//     prisma.manager.deleteMany(),
//     prisma.user.deleteMany(),
//   ]);

//   // Create users
//   const hashedPassword = await bcrypt.hash('Password@2025', 10);

//   const manager = await prisma.user.create({
//     data: {
//       email: 'hospital_manager@xyz.com',
//       password: hashedPassword,
//       role: 'MANAGER',
//       name: 'John Manager',
//       managerProfile: {
//         create: {}
//       }
//     }
//   });

//   const pantryStaff = await prisma.user.create({
//     data: {
//       email: 'hospital_pantry@xyz.com',
//       password: hashedPassword,
//       role: 'PANTRY',
//       name: 'Sarah Pantry',
//       pantryStaff: {
//         create: {
//           location: 'Main Kitchen'
//         }
//       }
//     }
//   });

//   const deliveryStaff = await prisma.user.create({
//     data: {
//       email: 'hospital_delivery@xyz.com',
//       password: hashedPassword,
//       role: 'DELIVERY',
//       name: 'Mike Delivery',
//       deliveryStaff: {
//         create: {}
//       }
//     }
//   });

//   // Create patients
//   const patient1 = await prisma.patient.create({
//     data: {
//       name: 'Alice Johnson',
//       roomNumber: '201',
//       bedNumber: 'A',
//       floorNumber: '2',
//       age: 45,
//       gender: 'Female',
//       contactInfo: '+1234567890',
//       emergencyContact: '+1987654321',
//       diseases: ['Diabetes', 'Hypertension'],
//       allergies: ['Peanuts', 'Shellfish']
//     }
//   });

//   const patient2 = await prisma.patient.create({
//     data: {
//       name: 'Bob Smith',
//       roomNumber: '305',
//       bedNumber: 'B',
//       floorNumber: '3',
//       age: 62,
//       gender: 'Male',
//       contactInfo: '+1122334455',
//       emergencyContact: '+1555666777',
//       diseases: ['Heart Disease'],
//       allergies: ['Lactose']
//     }
//   });

//   // Create diet charts
//   const dietChart1 = await prisma.dietChart.create({
//     data: {
//       patientId: patient1.id,
//       mealType: 'MORNING',
//       ingredients: ['Oatmeal', 'Fresh Fruits', 'Sugar-free Yogurt'],
//       instructions: ['No added sugar', 'Serve warm']
//     }
//   });

//   // Create meal preparations
//   const mealPrep1 = await prisma.mealPreparation.create({
//     data: {
//       dietChartId: dietChart1.id,
//       assignedTo: pantryStaff.pantryStaff!.id,
//       status: 'IN_PREPARATION'
//     }
//   });

//   // Create meal deliveries
//   const delivery1 = await prisma.mealDelivery.create({
//     data: {
//       patientId: patient1.id,
//       mealPrepId: mealPrep1.id,
//       assignedTo: deliveryStaff.deliveryStaff!.id,
//       status: 'IN_PROGRESS',
//       deliveryTime: new Date(),
//       notes: 'Handle with care'
//     }
//   });

//   console.log('Seed data created successfully');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.$transaction([
    prisma.mealDelivery.deleteMany(),
    prisma.dietChart.deleteMany(),
    prisma.patient.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Create users
  const hashedPassword = await bcrypt.hash('Password@2025', 10);

  const manager = await prisma.user.create({
    data: {
      email: 'hospital_manager@xyz.com',
      password: hashedPassword,
      role: 'MANAGER',
      name: 'John Manager'
    }
  });

  const pantryStaff = await prisma.user.create({
    data: {
      email: 'hospital_pantry@xyz.com',
      password: hashedPassword,
      role: 'PANTRY',
      name: 'Sarah Pantry'
    }
  });

  const deliveryStaff = await prisma.user.create({
    data: {
      email: 'hospital_delivery@xyz.com',
      password: hashedPassword,
      role: 'DELIVERY',
      name: 'Mike Delivery'
    }
  });

  // Create patients
  const patient1 = await prisma.patient.create({
    data: {
      name: 'Alice Johnson',
      roomNumber: '201',
      bedNumber: 'A',
      floorNumber: '2',
      age: 45,
      gender: 'Female',
      contactInfo: '+1234567890',
      emergencyContact: '+1987654321',
      diseases: ['Diabetes', 'Hypertension'],
      allergies: ['Peanuts', 'Shellfish']
    }
  });

  const patient2 = await prisma.patient.create({
    data: {
      name: 'Bob Smith',
      roomNumber: '305',
      bedNumber: 'B',
      floorNumber: '3',
      age: 62,
      gender: 'Male',
      contactInfo: '+1122334455',
      emergencyContact: '+1555666777',
      diseases: ['Heart Disease'],
      allergies: ['Lactose']
    }
  });

  // Create diet charts
  const dietChart1 = await prisma.dietChart.create({
    data: {
      patientId: patient1.id,
      mealType: 'MORNING',
      ingredients: ['Oatmeal', 'Fresh Fruits', 'Sugar-free Yogurt'],
      instructions: ['No added sugar', 'Serve warm']
    }
  });

  // Create meal deliveries
  const delivery1 = await prisma.mealDelivery.create({
    data: {
      patientId: patient1.id,
      status: 'IN_PROGRESS',
      deliveryTime: new Date(),
      notes: 'Handle with care'
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });