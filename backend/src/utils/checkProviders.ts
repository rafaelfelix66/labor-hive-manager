import { prisma } from './database';

const checkProviders = async () => {
  try {
    console.log('🔍 Consultando provedores na base de dados...');
    
    const providers = await prisma.serviceProvider.findMany({
      include: {
        application: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            englishLevel: true,
            hasDriversLicense: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`📊 Total de provedores encontrados: ${providers.length}`);
    console.log('\n📋 Lista de provedores:');
    console.log('----------------------------------------');
    
    providers.forEach((provider, index) => {
      console.log(`${index + 1}. ${provider.application.firstName} ${provider.application.lastName}`);
      console.log(`   Email: ${provider.application.email}`);
      console.log(`   Telefone: ${provider.application.phone}`);
      console.log(`   Serviços: ${provider.services.join(', ')}`);
      console.log(`   Taxa/hora: $${provider.hourlyRate}`);
      console.log(`   Inglês: ${provider.application.englishLevel}%`);
      console.log(`   Licença: ${provider.application.hasDriversLicense ? 'Sim' : 'Não'}`);
      console.log(`   Designado para: ${provider.assignedTo}`);
      console.log(`   Status: ${provider.active ? 'Ativo' : 'Inativo'}`);
      console.log('----------------------------------------');
    });
    
  } catch (error) {
    console.error('❌ Erro ao consultar provedores:', error);
  }
};

checkProviders();