
const { execSync } = require('child_process');

try {
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('Applying database migrations...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  
  console.log('Prisma setup completed successfully!');
} catch (error) {
  console.error('An error occurred during Prisma setup:', error.message);
}
