import { PrismaClient, EntityType, MarkupType } from '@prisma/client';

const prisma = new PrismaClient();

const suppliersData = [
  {
    companyName: 'ABC Construction Supply',
    entity: EntityType.Corporation,
    type: 'supplier',
    street: '123 Industrial Drive',
    suite: 'Unit A',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    country: 'Brazil',
    wcClass: 'A',
    markupType: MarkupType.Percent,
    markupValue: 15.5,
    commission: 8.0,
    assignedTo: 'Manager A',
    internalNotes: 'Reliable supplier for construction materials. Good payment history.',
    active: true,
  },
  {
    companyName: 'TechFlow Systems LLC',
    entity: EntityType.LLC,
    type: 'supplier',
    street: '456 Technology Blvd',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipCode: '20234-567',
    country: 'Brazil',
    wcClass: 'B',
    markupType: MarkupType.Dollar,
    markupValue: 50.0,
    commission: 12.5,
    assignedTo: 'Manager B',
    internalNotes: 'Specialized in IT infrastructure and networking solutions.',
    active: true,
  },
  {
    companyName: 'Elite Cleaning Services',
    entity: EntityType.LLC,
    type: 'supplier',
    street: '789 Service Road',
    suite: 'Floor 2',
    city: 'Belo Horizonte',
    state: 'MG',
    zipCode: '30123-456',
    country: 'Brazil',
    wcClass: 'C',
    markupType: MarkupType.Percent,
    markupValue: 20.0,
    commission: 10.0,
    assignedTo: 'Manager C',
    internalNotes: 'Commercial and residential cleaning services. Available 24/7.',
    active: true,
  },
  {
    companyName: 'Prime Security Group',
    entity: EntityType.Corporation,
    type: 'supplier',
    street: '321 Safety Street',
    city: 'Porto Alegre',
    state: 'RS',
    zipCode: '90234-567',
    country: 'Brazil',
    wcClass: 'D',
    markupType: MarkupType.Percent,
    markupValue: 18.0,
    commission: 15.0,
    assignedTo: 'Manager D',
    internalNotes: 'Security services including guards, surveillance, and alarm systems.',
    active: true,
  },
  {
    companyName: 'GreenSpace Landscaping',
    entity: EntityType.Partnership,
    type: 'supplier',
    street: '654 Garden Ave',
    city: 'Curitiba',
    state: 'PR',
    zipCode: '80234-567',
    country: 'Brazil',
    wcClass: 'A',
    markupType: MarkupType.Dollar,
    markupValue: 75.0,
    commission: 9.5,
    assignedTo: 'Manager A',
    internalNotes: 'Full landscaping services including maintenance and design.',
    active: true,
  },
  {
    companyName: 'FastTrack Logistics',
    entity: EntityType.LLC,
    type: 'supplier',
    street: '987 Transport Way',
    suite: 'Warehouse 5',
    city: 'Salvador',
    state: 'BA',
    zipCode: '40234-567',
    country: 'Brazil',
    wcClass: 'E',
    markupType: MarkupType.Percent,
    markupValue: 12.0,
    commission: 7.5,
    assignedTo: 'Manager B',
    internalNotes: 'Transportation and logistics services. Same-day delivery available.',
    active: true,
  },
  {
    companyName: 'Superior Catering Co.',
    entity: EntityType.Corporation,
    type: 'supplier',
    street: '147 Culinary Court',
    city: 'Fortaleza',
    state: 'CE',
    zipCode: '60234-567',
    country: 'Brazil',
    wcClass: 'B',
    markupType: MarkupType.Percent,
    markupValue: 25.0,
    commission: 11.0,
    assignedTo: 'Manager C',
    internalNotes: 'Corporate catering and event services. Specialized in large events.',
    active: true,
  },
  {
    companyName: 'Metro HVAC Solutions',
    entity: EntityType.LLC,
    type: 'supplier',
    street: '258 Climate Control Dr',
    city: 'Recife',
    state: 'PE',
    zipCode: '50234-567',
    country: 'Brazil',
    wcClass: 'C',
    markupType: MarkupType.Dollar,
    markupValue: 100.0,
    commission: 13.5,
    assignedTo: 'Manager D',
    internalNotes: 'HVAC installation, maintenance, and emergency repair services.',
    active: true,
  },
  {
    companyName: 'Digital Marketing Plus',
    entity: EntityType.Partnership,
    type: 'supplier',
    street: '369 Media Street',
    suite: 'Suite 301',
    city: 'Brasília',
    state: 'DF',
    zipCode: '70234-567',
    country: 'Brazil',
    markupType: MarkupType.Percent,
    markupValue: 30.0,
    commission: 14.0,
    assignedTo: 'Manager A',
    internalNotes: 'Digital marketing, SEO, and social media management services.',
    active: false,
  },
  {
    companyName: 'Reliable Maintenance Corp',
    entity: EntityType.Corporation,
    type: 'supplier',
    street: '741 Repair Road',
    city: 'Goiânia',
    state: 'GO',
    zipCode: '74234-567',
    country: 'Brazil',
    wcClass: 'A',
    markupType: MarkupType.Dollar,
    markupValue: 60.0,
    commission: 9.0,
    internalNotes: 'General maintenance and repair services for commercial properties.',
    active: true,
  },
];

async function seedSuppliers() {
  try {
    console.log('🌱 Starting suppliers seeding...');

    // Check if suppliers already exist
    const existingSuppliers = await prisma.company.count({
      where: { type: 'supplier' }
    });
    if (existingSuppliers > 0) {
      console.log(`⚠️  Found ${existingSuppliers} existing suppliers. Skipping seeding.`);
      return;
    }

    // Create suppliers
    const createdSuppliers = await prisma.company.createMany({
      data: suppliersData,
      skipDuplicates: true,
    });

    console.log(`✅ Successfully created ${createdSuppliers.count} suppliers`);
    
    // Log the created suppliers
    const suppliers = await prisma.company.findMany({
      where: { type: 'supplier' },
      select: {
        id: true,
        companyName: true,
        entity: true,
        city: true,
        assignedTo: true,
        active: true,
      },
    });

    console.log('\n📋 Created suppliers:');
    suppliers.forEach((supplier: any, index: number) => {
      console.log(`${index + 1}. ${supplier.companyName} (${supplier.entity}) - ${supplier.city} - ${supplier.assignedTo || 'Unassigned'} - ${supplier.active ? 'Active' : 'Inactive'}`);
    });

  } catch (error) {
    console.error('❌ Error seeding suppliers:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Allow running this script directly
if (require.main === module) {
  seedSuppliers()
    .then(() => {
      console.log('🎉 Suppliers seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Suppliers seeding failed:', error);
      process.exit(1);
    });
}

export default seedSuppliers;