import { PrismaClient, BillStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBills() {
  try {
    console.log('🧾 Starting bills seeding...');

    // Check if bills already exist
    const existingBills = await prisma.bill.count();
    if (existingBills > 0) {
      console.log(`⚠️  Found ${existingBills} existing bills. Skipping seeding.`);
      return;
    }

    // Get some clients and providers for the bills
    const clients = await prisma.company.findMany({
      where: { type: 'client', active: true },
      take: 5
    });

    const providers = await prisma.serviceProvider.findMany({
      where: { active: true },
      take: 8
    });

    if (clients.length === 0 || providers.length === 0) {
      console.log('⚠️  No clients or providers found. Please seed clients and providers first.');
      return;
    }

    console.log(`📋 Found ${clients.length} clients and ${providers.length} providers`);

    // Bill data with realistic scenarios - adjusted for available providers
    const billsData = [
      {
        clientId: clients[0].id,
        providerId: providers[0].id,
        service: 'Encanamento Residencial',
        hoursWorked: 8.0,
        serviceRate: 35.0,
        status: 'Paid' as BillStatus,
        dueDate: new Date('2024-12-15'),
        paidDate: new Date('2024-12-10'),
        createdAt: new Date('2024-12-01')
      },
      {
        clientId: clients[1].id,
        providerId: providers[1].id,
        service: 'Limpeza Comercial',
        hoursWorked: 12.0,
        serviceRate: 25.0,
        status: 'Pending' as BillStatus,
        dueDate: new Date('2024-12-20'),
        createdAt: new Date('2024-12-05')
      },
      {
        clientId: clients[2].id,
        providerId: providers[2].id,
        service: 'Jardinagem e Paisagismo',
        hoursWorked: 6.5,
        serviceRate: 28.0,
        status: 'Paid' as BillStatus,
        dueDate: new Date('2024-12-18'),
        paidDate: new Date('2024-12-16'),
        createdAt: new Date('2024-12-03')
      },
      {
        clientId: clients[0].id,
        providerId: providers[0].id,
        service: 'Elétrica Industrial',
        hoursWorked: 10.0,
        serviceRate: 45.0,
        status: 'Overdue' as BillStatus,
        dueDate: new Date('2024-12-10'),
        createdAt: new Date('2024-11-25')
      },
      {
        clientId: clients[3] ? clients[3].id : clients[0].id,
        providerId: providers[1].id,
        service: 'Pintura Externa',
        hoursWorked: 16.0,
        serviceRate: 22.0,
        status: 'Paid' as BillStatus,
        dueDate: new Date('2024-12-12'),
        paidDate: new Date('2024-12-11'),
        createdAt: new Date('2024-11-28')
      },
      {
        clientId: clients[1].id,
        providerId: providers[2].id,
        service: 'Carpintaria Personalizada',
        hoursWorked: 20.0,
        serviceRate: 38.0,
        status: 'Pending' as BillStatus,
        dueDate: new Date('2024-12-25'),
        createdAt: new Date('2024-12-08')
      },
      {
        clientId: clients[4] ? clients[4].id : clients[2].id,
        providerId: providers[0].id,
        service: 'Manutenção Hidráulica',
        hoursWorked: 4.5,
        serviceRate: 35.0,
        status: 'Paid' as BillStatus,
        dueDate: new Date('2024-12-14'),
        paidDate: new Date('2024-12-13'),
        createdAt: new Date('2024-12-02')
      }
    ].slice(0, Math.min(providers.length * 2, 10)); // Limit bills based on available providers

    // Calculate totals with client markup and commission
    const billsWithCalculations = await Promise.all(
      billsData.map(async (billData, index) => {
        const client = clients.find(c => c.id === billData.clientId);
        const baseTotal = billData.hoursWorked * billData.serviceRate;
        
        let totalClient = baseTotal;
        let totalProvider = baseTotal;

        // Apply client markup if configured
        if (client?.markupType && client?.markupValue) {
          if (client.markupType === 'Percent') {
            totalClient = baseTotal * (1 + parseFloat(client.markupValue.toString()) / 100);
          } else if (client.markupType === 'Dollar') {
            totalClient = baseTotal + parseFloat(client.markupValue.toString());
          }
        }

        // Apply commission deduction if configured
        if (client?.commission) {
          const commissionAmount = totalProvider * (parseFloat(client.commission.toString()) / 100);
          totalProvider = totalProvider - commissionAmount;
        }

        // Generate unique bill number
        const billNumber = `BILL-${String(index + 1).padStart(4, '0')}`;

        return {
          ...billData,
          billNumber,
          totalClient,
          totalProvider
        };
      })
    );

    // Create the bills
    const createdBills = await prisma.bill.createMany({
      data: billsWithCalculations,
      skipDuplicates: true,
    });

    console.log(`✅ Successfully created ${createdBills.count} bills`);
    
    // Log summary
    const billsSummary = await prisma.bill.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { totalClient: true }
    });

    console.log('\n📊 Bills Summary:');
    billsSummary.forEach((summary) => {
      const status = summary.status === 'Paid' ? 'Pagas' : 
                    summary.status === 'Pending' ? 'Pendentes' : 'Vencidas';
      const total = parseFloat(summary._sum.totalClient?.toString() || '0');
      console.log(`${status}: ${summary._count.id} faturas - Total: $${total.toFixed(2)}`);
    });

    // Calculate total revenue and profit
    const totalRevenue = billsSummary.reduce((acc, curr) => 
      acc + parseFloat(curr._sum.totalClient?.toString() || '0'), 0);
    
    const paidRevenue = billsSummary
      .filter(s => s.status === 'Paid')
      .reduce((acc, curr) => acc + parseFloat(curr._sum.totalClient?.toString() || '0'), 0);

    console.log(`\n💰 Receita Total: $${totalRevenue.toFixed(2)}`);
    console.log(`💵 Receita Realizada: $${paidRevenue.toFixed(2)}`);

  } catch (error) {
    console.error('❌ Error seeding bills:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Allow running this script directly
if (require.main === module) {
  seedBills()
    .then(() => {
      console.log('🎉 Bills seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Bills seeding failed:', error);
      process.exit(1);
    });
}

export default seedBills;