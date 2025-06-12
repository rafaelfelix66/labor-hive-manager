import { prisma } from './database';
import { hashPassword } from './auth';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      console.log('👤 Admin user already exists, skipping seed');
      return;
    }

    // Create admin user with specified credentials
    const adminPasswordHash = await hashPassword('aron$199');
    
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@laborpro.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
      },
    });

    console.log('✅ Admin user created successfully:', {
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
    });

    // Create a regular user for testing
    const userPasswordHash = await hashPassword('user123');
    
    const regularUser = await prisma.user.create({
      data: {
        username: 'user',
        email: 'user@laborpro.com',
        passwordHash: userPasswordHash,
        role: 'user',
      },
    });

    console.log('✅ Regular user created successfully:', {
      id: regularUser.id,
      username: regularUser.username,
      email: regularUser.email,
      role: regularUser.role,
    });

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};