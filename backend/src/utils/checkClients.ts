import { prisma } from './database';

const checkClients = async () => {
  try {
    console.log('🔍 Consultando clientes na base de dados...');
    
    const clients = await prisma.company.findMany({
      where: { type: 'client' },
      orderBy: { companyName: 'asc' }
    });
    
    console.log(`📊 Total de clientes encontrados: ${clients.length}`);
    console.log('\n📋 Lista de clientes:');
    console.log('----------------------------------------');
    
    clients.forEach((client, index) => {
      console.log(`${index + 1}. ${client.companyName}`);
      console.log(`   Entidade: ${client.entity}`);
      console.log(`   Endereço: ${client.street}, ${client.city}, ${client.state} ${client.zipCode}`);
      console.log(`   Classe WC: ${client.wcClass || 'N/A'}`);
      console.log(`   Markup: ${client.markupType ? `${client.markupValue} (${client.markupType})` : 'N/A'}`);
      console.log(`   Comissão: ${client.commission ? `${client.commission}%` : 'N/A'}`);
      console.log(`   Designado para: ${client.assignedTo || 'Não designado'}`);
      console.log(`   Status: ${client.active ? 'Ativo' : 'Inativo'}`);
      console.log(`   Notas: ${client.internalNotes || 'Nenhuma'}`);
      console.log('----------------------------------------');
    });
    
  } catch (error) {
    console.error('❌ Erro ao consultar clientes:', error);
  }
};

checkClients();