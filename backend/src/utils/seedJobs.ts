import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedJobs() {
  try {
    console.log('🔧 Starting jobs seeding...');

    // Check if jobs already exist
    const existingJobs = await prisma.job.count();
    if (existingJobs > 0) {
      console.log(`⚠️  Found ${existingJobs} existing jobs. Skipping seeding.`);
      return;
    }

    // English jobs data
    const jobsData = [
      {
        name: "Residential Plumbing",
        description: "Plumbing services for residential properties including repairs, installations, and maintenance",
        averageHourlyRate: 35.00
      },
      {
        name: "Commercial Plumbing",
        description: "Professional plumbing services for commercial buildings and facilities",
        averageHourlyRate: 42.00
      },
      {
        name: "Electrical Installation",
        description: "Electrical wiring, outlet installation, and electrical system setup",
        averageHourlyRate: 45.00
      },
      {
        name: "Electrical Repair",
        description: "Troubleshooting and repair of electrical systems and components",
        averageHourlyRate: 40.00
      },
      {
        name: "House Painting - Interior",
        description: "Interior painting services including walls, ceilings, and trim work",
        averageHourlyRate: 30.00
      },
      {
        name: "House Painting - Exterior",
        description: "Exterior painting services for homes and buildings",
        averageHourlyRate: 35.00
      },
      {
        name: "Commercial Cleaning",
        description: "Professional cleaning services for offices and commercial spaces",
        averageHourlyRate: 25.00
      },
      {
        name: "Residential Cleaning",
        description: "House cleaning and maintenance services",
        averageHourlyRate: 22.00
      },
      {
        name: "Landscaping Design",
        description: "Landscape design and garden planning services",
        averageHourlyRate: 32.00
      },
      {
        name: "Lawn Maintenance",
        description: "Regular lawn care, mowing, and landscape maintenance",
        averageHourlyRate: 28.00
      },
      {
        name: "Construction - General",
        description: "General construction and building services",
        averageHourlyRate: 38.00
      },
      {
        name: "Carpentry",
        description: "Custom carpentry work and woodworking services",
        averageHourlyRate: 36.00
      },
      {
        name: "HVAC Installation",
        description: "Heating, ventilation, and air conditioning system installation",
        averageHourlyRate: 48.00
      },
      {
        name: "HVAC Repair",
        description: "HVAC system maintenance and repair services",
        averageHourlyRate: 45.00
      },
      {
        name: "Roofing",
        description: "Roof installation, repair, and maintenance services",
        averageHourlyRate: 40.00
      }
    ];

    // Create the jobs
    const createdJobs = await prisma.job.createMany({
      data: jobsData,
      skipDuplicates: true,
    });

    console.log(`✅ Successfully created ${createdJobs.count} jobs`);
    
    // Log summary
    const jobsByCategory = await prisma.job.groupBy({
      by: ['name'],
      _avg: { averageHourlyRate: true }
    });

    console.log('\n📊 Jobs Summary:');
    jobsByCategory.forEach((job) => {
      const avgRate = parseFloat(job._avg.averageHourlyRate?.toString() || '0');
      console.log(`${job.name}: $${avgRate.toFixed(2)}/hour`);
    });

    // Calculate average rate across all jobs
    const totalAverage = jobsByCategory.reduce((acc, curr) => 
      acc + parseFloat(curr._avg.averageHourlyRate?.toString() || '0'), 0) / jobsByCategory.length;
    
    console.log(`\n💰 Average Job Rate: $${totalAverage.toFixed(2)}/hour`);

  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Allow running this script directly
if (require.main === module) {
  seedJobs()
    .then(() => {
      console.log('🎉 Jobs seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Jobs seeding failed:', error);
      process.exit(1);
    });
}

export default seedJobs;