import { prisma } from './database';

const createSampleApplications = async () => {
  const applications = [
    {
      firstName: "João",
      lastName: "Silva",
      email: "joao.silva@email.com",
      phone: "(11) 98765-4321",
      dateOfBirth: new Date('1985-03-15'),
      ssn: "123-45-6789",
      gender: "Male" as const,
      englishLevel: 85,
      hasDriversLicense: true,
      workExperience: ["Encanamento", "Instalação hidráulica"],
      address1: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      emergencyContactName: "Maria Silva",
      emergencyContactPhone: "(11) 98765-1234",
      emergencyContactRelation: "Esposa",
      howDidYouHear: "Internet",
      status: "approved" as const
    },
    {
      firstName: "Carlos",
      lastName: "Santos",
      email: "carlos.santos@email.com",
      phone: "(11) 97654-3210",
      dateOfBirth: new Date('1980-07-22'),
      ssn: "987-65-4321",
      gender: "Male" as const,
      englishLevel: 70,
      hasDriversLicense: true,
      workExperience: ["Elétrica", "Automação"],
      address1: "Av. Paulista, 456",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
      emergencyContactName: "Ana Santos",
      emergencyContactPhone: "(11) 97654-1111",
      emergencyContactRelation: "Irmã",
      howDidYouHear: "Indicação",
      status: "approved" as const
    },
    {
      firstName: "Rafael",
      lastName: "Costa",
      email: "rafael.costa@email.com",
      phone: "(11) 96543-2109",
      dateOfBirth: new Date('1990-11-08'),
      ssn: "456-78-9012",
      gender: "Male" as const,
      englishLevel: 95,
      hasDriversLicense: true,
      workExperience: ["Paisagismo", "Jardinagem"],
      address1: "Rua Verde, 789",
      city: "São Paulo",
      state: "SP",
      zipCode: "04567-890",
      emergencyContactName: "Pedro Costa",
      emergencyContactPhone: "(11) 96543-0000",
      emergencyContactRelation: "Pai",
      howDidYouHear: "Redes sociais",
      status: "approved" as const
    },
    {
      firstName: "Ana",
      lastName: "Oliveira",
      email: "ana.oliveira@email.com",
      phone: "(11) 95432-1098",
      dateOfBirth: new Date('1988-05-12'),
      ssn: "321-54-8765",
      gender: "Female" as const,
      englishLevel: 75,
      hasDriversLicense: false,
      workExperience: ["Limpeza", "Organização"],
      address1: "Rua Limpa, 321",
      city: "São Paulo",
      state: "SP",
      zipCode: "02345-678",
      emergencyContactName: "José Oliveira",
      emergencyContactPhone: "(11) 95432-5555",
      emergencyContactRelation: "Marido",
      howDidYouHear: "Jornal",
      status: "approved" as const
    },
    {
      firstName: "Lucas",
      lastName: "Pereira",
      email: "lucas.pereira@email.com",
      phone: "(11) 94321-0987",
      dateOfBirth: new Date('1992-09-30'),
      ssn: "654-32-1098",
      gender: "Male" as const,
      englishLevel: 60,
      hasDriversLicense: true,
      workExperience: ["Construção", "Carpintaria"],
      address1: "Rua da Construção, 654",
      city: "São Paulo",
      state: "SP",
      zipCode: "03456-789",
      emergencyContactName: "Sandra Pereira",
      emergencyContactPhone: "(11) 94321-7777",
      emergencyContactRelation: "Mãe",
      howDidYouHear: "Amigo",
      status: "approved" as const
    }
  ];

  const createdApplications = [];
  for (const appData of applications) {
    const app = await prisma.application.create({
      data: appData
    });
    createdApplications.push(app);
  }

  return createdApplications;
};

const providersData = [
  {
    services: ["Plumbing", "Pipe Installation"],
    hourlyRate: 45.00,
    assignedTo: "Manager A",
    active: true
  },
  {
    services: ["Electrical", "Automation"],
    hourlyRate: 50.00,
    assignedTo: "Manager B",
    active: true
  },
  {
    services: ["Landscaping", "Gardening"],
    hourlyRate: 35.00,
    assignedTo: "Manager A",
    active: true
  },
  {
    services: ["Cleaning", "Janitorial"],
    hourlyRate: 25.00,
    assignedTo: "Manager C",
    active: true
  },
  {
    services: ["Construction", "Carpentry"],
    hourlyRate: 40.00,
    assignedTo: "Manager B",
    active: false
  }
];

export const seedProviders = async () => {
  try {
    console.log('👷 Iniciando seed de provedores de serviço...');
    
    // Verificar se já existem provedores
    const existingProvidersCount = await prisma.serviceProvider.count();
    
    if (existingProvidersCount > 0) {
      console.log(`📊 Já existem ${existingProvidersCount} provedores na base. Pulando seed...`);
      return;
    }
    
    // Criar aplicações de exemplo
    console.log('📝 Criando aplicações de exemplo...');
    const applications = await createSampleApplications();
    
    // Inserir provedores de exemplo
    for (let i = 0; i < providersData.length; i++) {
      const providerData = providersData[i];
      const application = applications[i];
      
      await prisma.serviceProvider.create({
        data: {
          applicationId: application.id,
          services: providerData.services,
          hourlyRate: providerData.hourlyRate,
          assignedTo: providerData.assignedTo,
          active: providerData.active
        }
      });
      
      console.log(`✅ Provedor criado: ${application.firstName} ${application.lastName}`);
    }
    
    console.log(`🎉 ${providersData.length} provedores de serviço inseridos com sucesso!`);
    
  } catch (error) {
    console.error('❌ Erro ao inserir provedores:', error);
    throw error;
  }
};

// Executar o seed se o arquivo for chamado diretamente
if (require.main === module) {
  seedProviders()
    .then(() => {
      console.log('✅ Seed de provedores concluído');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro no seed de provedores:', error);
      process.exit(1);
    });
}