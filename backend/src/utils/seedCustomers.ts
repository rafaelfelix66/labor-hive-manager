import { prisma } from './database';

const customersData = [
  {
    companyName: "Tech Solutions Inc.",
    entity: "Corporation" as const,
    type: "customer",
    street: "789 Business Blvd",
    suite: "Suite 200",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210",
    country: "USA",
    wcClass: "A",
    markupType: "Percent" as const,
    markupValue: 20.00,
    commission: 12.50,
    assignedTo: "Sales Rep A",
    internalNotes: "Cliente de alto valor, sempre paga em dia. Projetos de tecnologia principalmente.",
    active: true
  },
  {
    companyName: "Green Industries LLC",
    entity: "LLC" as const,
    type: "customer",
    street: "321 Corporate Way",
    city: "San Diego",
    state: "CA",
    zipCode: "92101",
    country: "USA",
    wcClass: "B",
    markupType: "Dollar" as const,
    markupValue: 75.00,
    commission: 15.00,
    assignedTo: "Sales Rep B",
    internalNotes: "Cliente sazonal, principalmente projetos de verão. Focado em sustentabilidade.",
    active: true
  },
  {
    companyName: "Metropolitan Construction Corp",
    entity: "Corporation" as const,
    type: "customer",
    street: "1455 Industrial Ave",
    suite: "Building C",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "USA",
    wcClass: "A",
    markupType: "Percent" as const,
    markupValue: 25.00,
    commission: 18.00,
    assignedTo: "Sales Rep C",
    internalNotes: "Grande empresa de construção. Projetos de larga escala, pagamentos mensais.",
    active: true
  },
  {
    companyName: "Coastal Property Management",
    entity: "LLC" as const,
    type: "customer",
    street: "2890 Ocean Drive",
    city: "Santa Monica",
    state: "CA",
    zipCode: "90401",
    country: "USA",
    wcClass: "C",
    markupType: "Percent" as const,
    markupValue: 18.00,
    commission: 10.00,
    assignedTo: "Sales Rep A",
    internalNotes: "Gestão de propriedades residenciais. Múltiplos contratos pequenos e médios.",
    active: true
  },
  {
    companyName: "Elite Commercial Services",
    entity: "Partnership" as const,
    type: "customer",
    street: "567 Executive Plaza",
    suite: "Floor 15",
    city: "Beverly Hills",
    state: "CA",
    zipCode: "90210",
    country: "USA",
    wcClass: "B",
    markupType: "Dollar" as const,
    markupValue: 100.00,
    commission: 20.00,
    assignedTo: "Sales Rep D",
    internalNotes: "Serviços comerciais premium. Cliente exigente mas bem pagante.",
    active: true
  },
  {
    companyName: "Harbor Manufacturing Inc.",
    entity: "Corporation" as const,
    type: "customer",
    street: "3400 Port Authority Rd",
    city: "Long Beach",
    state: "CA",
    zipCode: "90802",
    country: "USA",
    wcClass: "A",
    markupType: "Percent" as const,
    markupValue: 22.00,
    commission: 14.00,
    assignedTo: "Sales Rep B",
    internalNotes: "Indústria manufatureira. Necessidades de manutenção industrial e segurança.",
    active: true
  },
  {
    companyName: "Sunshine Retail Group",
    entity: "LLC" as const,
    type: "customer",
    street: "8900 Shopping Center Blvd",
    city: "Irvine",
    state: "CA",
    zipCode: "92618",
    country: "USA",
    wcClass: "C",
    markupType: "Percent" as const,
    markupValue: 15.00,
    commission: 8.00,
    assignedTo: "Sales Rep C",
    internalNotes: "Rede de varejo. Serviços de limpeza e manutenção em múltiplas lojas.",
    active: true
  },
  {
    companyName: "Pacific Healthcare Solutions",
    entity: "Corporation" as const,
    type: "customer",
    street: "1200 Medical Center Dr",
    suite: "Suite 300",
    city: "Pasadena",
    state: "CA",
    zipCode: "91101",
    country: "USA",
    wcClass: "A",
    markupType: "Dollar" as const,
    markupValue: 85.00,
    commission: 16.00,
    assignedTo: "Sales Rep A",
    internalNotes: "Setor de saúde. Padrões rigorosos de limpeza e manutenção especializada.",
    active: true
  },
  {
    companyName: "Mountain View Logistics",
    entity: "LLC" as const,
    type: "customer",
    street: "4500 Warehouse District",
    city: "Riverside",
    state: "CA",
    zipCode: "92501",
    country: "USA",
    wcClass: "B",
    markupType: "Percent" as const,
    markupValue: 19.00,
    commission: 11.00,
    assignedTo: "Sales Rep B",
    internalNotes: "Centro de distribuição. Serviços de segurança e limpeza industrial.",
    active: true
  },
  {
    companyName: "Golden State Entertainment",
    entity: "Partnership" as const,
    type: "customer",
    street: "7800 Entertainment Blvd",
    suite: "Studio 5",
    city: "Burbank",
    state: "CA",
    zipCode: "91505",
    country: "USA",
    wcClass: "C",
    markupType: "Dollar" as const,
    markupValue: 60.00,
    commission: 13.00,
    assignedTo: "Sales Rep D",
    internalNotes: "Indústria de entretenimento. Eventos esporádicos, mas bem remunerados.",
    active: false
  }
];

export const seedCustomers = async () => {
  try {
    console.log('🏢 Iniciando seed de clientes...');
    
    // Verificar se já existem clientes
    const existingCustomersCount = await prisma.customer.count({
      where: { type: 'customer' }
    });
    
    if (existingCustomersCount > 0) {
      console.log(`📊 Já existem ${existingCustomersCount} clientes na base. Pulando seed...`);
      return;
    }
    
    // Inserir clientes de exemplo
    for (const customerData of customersData) {
      await prisma.customer.create({
        data: customerData
      });
      console.log(`✅ Cliente criado: ${customerData.companyName}`);
    }
    
    console.log(`🎉 ${customersData.length} clientes de exemplo inseridos com sucesso!`);
    
  } catch (error) {
    console.error('❌ Erro ao inserir clientes:', error);
    throw error;
  }
};

// Executar o seed se o arquivo for chamado diretamente
if (require.main === module) {
  seedCustomers()
    .then(() => {
      console.log('✅ Seed de clientes concluído');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro no seed de clientes:', error);
      process.exit(1);
    });
}