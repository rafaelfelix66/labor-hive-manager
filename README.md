# Labor Hive Manager

Sistema de gestão de terceirização de serviços freelancers com arquitetura em containers Docker.

## 📋 Descrição

O Labor Hive Manager é uma plataforma completa para gerenciar serviços de freelancers, conectando prestadores de serviços qualificados com clientes empresariais. O sistema inclui gestão de candidaturas, prestadores, customers, fornecedores e faturamento.

## 🏗️ Arquitetura

```
├── frontend/          # Aplicação React (Vite + TypeScript + Tailwind)
├── backend/           # API Node.js (Express + TypeScript + PostgreSQL)
├── nginx/             # Proxy reverso e load balancer
├── docker/            # Scripts e configurações do Docker
└── docker-compose.yml # Orquestração dos containers
```

## ✨ Funcionalidades

### Frontend (React)
- **Landing Page** - Apresentação da plataforma
- **Sistema de Login** - Autenticação com roles (admin/user)
- **Dashboard** - Painel principal com estatísticas e gráficos
- **Candidaturas** - Formulário multi-etapa para freelancers
- **Admin Panel** - Gestão de candidaturas com filtros avançados
- **Gestão de Prestadores** - CRUD completo de service providers
- **Gestão de Customers** - CRUD completo de empresas customers
- **Gestão de Fornecedores** - CRUD completo de empresas fornecedoras
- **Sistema de Faturamento** - Geração, controle e relatórios de faturas
- **📄 Geração de PDF** - Faturas profissionais em PDF
- **📊 Gráficos Financeiros** - Visualização de dados de billing
- **🔍 Busca e Filtros** - Sistema avançado de filtros para todas as entidades

### 🆕 Novas Funcionalidades v2.0
- **🎨 EOM Staffing Branding** - Logo corporativo em todas as páginas e favicon personalizado
- **🏷️ Gestão de Serviços Dinâmica** - Sistema completo de criação e gestão de tipos de serviço
- **📝 Formulário de Aplicação Aprimorado** - Data de nascimento em formato US, validação obrigatória de termos
- **📁 Sistema de Upload de Arquivos** - Upload completo de licenças com visualização e download
- **🔍 Visualização de Licenças** - Sistema robusto para visualizar e baixar documentos de motorista
- **📊 Dashboard Aprimorado** - Estatísticas em tempo real com melhor tratamento de erros
- **🔒 Validação de Formulários** - Checkbox obrigatório para aceite de termos e condições

### 🆕 Novas Funcionalidades v3.0
- **🌐 Sistema de Tradução Bilíngue** - Suporte completo para inglês e espanhol
- **🏠 Homepage Redesignada** - Foco em recrutamento de profissionais com design EOM
- **🎨 Brand Colors Atualizados** - Cores oficiais da EOM (#18407c azul, #e74a3e laranja)
- **🌍 Language Switcher** - Alternância de idioma na homepage e formulário de aplicação
- **💰 Monthly Revenue Fix** - Correção do cálculo de receita mensal no dashboard
- **🔧 Ngrok Integration** - Scripts para exposição do site na internet via ngrok
- **📱 Responsive Design** - Design responsivo aprimorado com imagens profissionais

### 🆕 Novas Funcionalidades v4.0 - Refatoração de Schema e Estabilidade
- **🗃️ Migração de Schema Completa** - Transição de Clients/Providers/Services para Customers/Employees/Jobs
- **🔄 Sistema de Aplicação-Employee** - Applications aprovadas são automaticamente convertidas em Employees
- **📊 Dashboard Otimizado** - APIs de estatísticas mais eficientes e tratamento robusto de erros
- **🛠️ Correções de Schema** - Resolvidos problemas de sincronização entre banco e aplicação
- **💼 Gestão de Funcionários** - Sistema completo de employees com dados pessoais e profissionais
- **🏢 Gestão de Clientes** - Migração de clients para customers com estrutura otimizada
- **🎯 Tipos de Trabalho** - Jobs substituem services com melhor estruturação
- **🔧 Estabilidade de Produção** - Correções críticas para ambiente de produção Docker

### Backend (API)
- **Autenticação JWT** - Sistema seguro de autenticação
- **CRUD Completo** - Para todas as entidades (Users, Applications, Providers, Clients, Suppliers, Bills)
- **📄 Geração de PDF** - Sistema robusto com Puppeteer para faturas
- **Upload de Arquivos** - Para documentos e licenças com Multer
- **Filtros e Paginação** - Para listagens otimizadas
- **Rate Limiting** - Proteção contra abuso
- **Validação de Dados** - Com Zod schemas
- **Logs Estruturados** - Para monitoramento
- **🧮 Cálculos Automáticos** - Markup, comissões e lucros em tempo real
- **📊 Relatórios** - APIs para dados de dashboard e relatórios

### Banco de Dados
- **PostgreSQL** - Banco principal com relacionamentos
- **Redis** - Cache e sessões
- **Migrações** - Scripts de inicialização

## 🛠️ Tecnologias

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- React Router DOM
- TanStack Query
- React Hook Form + Zod

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- Redis para cache
- JWT para autenticação
- Multer para uploads
- Puppeteer para geração de PDF
- Helmet + CORS para segurança

### DevOps
- Docker + Docker Compose
- Nginx como proxy reverso
- Estrutura multi-container

## 🚀 Como Executar

### Pré-requisitos
- Docker
- Docker Compose

### Executar o projeto completo
```bash
# Clonar o repositório
git clone <repository-url>
cd labor-hive-manager

# Executar todos os serviços
docker-compose up -d

# Verificar status dos containers
docker-compose ps
```

### 🌐 URLs dos Serviços

#### 🐳 Produção (Docker - Recomendado)
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Prisma Studio**: http://localhost:5555
- **Nginx (Proxy)**: http://localhost:80
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

#### 💻 Desenvolvimento (modo local)
- **Frontend**: http://localhost:5174 (Vite dev server - porta dinâmica)
- **Backend API**: http://localhost:3001/api (Express server)
- **PostgreSQL**: localhost:5432 (requer Docker/container)
- **Prisma Studio**: http://localhost:5555

> **⚠️ IMPORTANTE**: 
> - O Vite pode usar portas dinâmicas (5173, 5174, etc.) quando a porta padrão está ocupada
> - O PostgreSQL DEVE estar rodando via Docker mesmo em desenvolvimento local
> - Para desenvolvimento: Backend sempre em 3001, Frontend em 517X (dinâmico)

### Executar individualmente

#### Pré-requisito: Banco de dados
```bash
# O PostgreSQL DEVE estar rodando via Docker antes de iniciar os serviços
docker-compose up postgres -d
# Ou iniciar apenas o banco:
docker run --name postgres-dev -e POSTGRES_PASSWORD=password -e POSTGRES_DB=labor_hive -p 5432:5432 -d postgres:15
```

#### Frontend (porta dinâmica 517X)
```bash
cd frontend
npm install
npm run dev  # Inicia em http://localhost:5174 (ou próxima porta disponível)
```

#### Backend (porta 3001)
```bash
cd backend
npm install
npm run dev  # Inicia em http://localhost:3001
```

#### Prisma Studio (porta 5555)
```bash
# Via Docker (recomendado)
docker-compose up -d prisma-studio

# Local (alternativo)
cd backend
npx prisma studio
```

#### Verificar se os serviços estão rodando
```bash
# Verificar portas em uso
lsof -i :5174  # Frontend (ou 5173, 5175, etc.)
lsof -i :3001  # Backend
lsof -i :5432  # PostgreSQL

# Ver processos em execução
ps aux | grep -E "(vite|node|postgres)" | grep -v grep

# Testar conectividade
curl http://localhost:3001/health  # Backend
curl http://localhost:5174/       # Frontend
```

## 📁 Estrutura de Dados v4.0

### Principais Entidades
- **Users** - Usuários do sistema (admin/manager/user)
- **Applications** - Candidaturas de freelancers
- **Employees** - Funcionários aprovados (ex-Applications)
- **Customers** - Empresas clientes (ex-Clients)
- **Jobs** - Tipos de trabalho disponíveis (ex-Services)
- **Bills** - Faturas e pagamentos

### Relacionamentos
```
Users 1:N Applications (reviewed_by)
Applications 1:1 Employees (applicationId)
Customers 1:N Bills
Employees 1:N Bills
Jobs são referenciados como array em Applications e Employees
```

### Schema Atualizado
```prisma
model Application {
  id          Int           @id @default(autoincrement())
  firstName   String
  lastName    String
  email       String
  // ... outros campos pessoais
  jobs        String[]      // Array de tipos de trabalho
  status      ApplicationStatus
  employees   Employee[]    // Relacionamento com funcionários
  reviewer    User?         @relation(fields: [reviewedBy], references: [id])
}

model Employee {
  id              Int       @id @default(autoincrement())
  firstName       String
  lastName        String
  email           String    @unique
  phone           String
  // ... dados pessoais e de endereço
  jobs            String[]  // Tipos de trabalho que executa
  hourlyRate      Decimal
  assignedTo      String
  applicationId   Int?      // Referência à aplicação original
  bills           Bill[]
  application     Application? @relation(fields: [applicationId], references: [id])
}

model Customer {
  id          Int       @id @default(autoincrement())
  companyName String
  entity      EntityType
  type        String
  // ... dados da empresa
  bills       Bill[]
}

model Bill {
  id            Int        @id @default(autoincrement())
  billNumber    String     @unique
  customerId    Int
  employeeId    Int
  job           String
  hoursWorked   Decimal
  totalCustomer Decimal
  totalEmployee Decimal
  customer      Customer   @relation(fields: [customerId], references: [id])
  employee      Employee   @relation(fields: [employeeId], references: [id])
}

model Job {
  id                Int      @id @default(autoincrement())
  name              String   @unique
  description       String?
  averageHourlyRate Decimal
  active            Boolean  @default(true)
}
```

## 🔐 Autenticação

O sistema utiliza JWT tokens com diferentes roles:
- **admin** - Acesso completo ao sistema
- **manager** - Gestão de candidaturas e prestadores
- **user** - Acesso básico ao dashboard

### 🔑 Credenciais Demo
```
Admin: username: admin, password: aron$199
User:  username: user,  password: user123
```

## 🔧 Detalhes das Novas Funcionalidades v2.0

### 🎨 EOM Staffing Branding
- **Logo Atualizado**: Substituição completa do LaborPro pelo logo da EOM Staffing
- **Favicon Personalizado**: Ícone personalizado na aba do navegador
- **Metadados SEO**: Título e descrições atualizados para EOM Staffing
- **Tamanhos Responsivos**: Logo em tamanhos otimizados (h-12 no dashboard, h-16 no login)

### 🏷️ Sistema de Gestão de Serviços
- **CRUD Completo**: Criar, editar, excluir e listar tipos de serviço
- **Taxa Média por Hora**: Campo para definir preço médio de cada serviço
- **Status Ativo/Inativo**: Controle de visibilidade dos serviços
- **Integração com Formulários**: Carregamento dinâmico de serviços nas aplicações
- **API Endpoints**: `/api/services` com filtros e paginação

### 📁 Sistema de Upload de Arquivos
- **Upload Seguro**: Multer com validação de tipos de arquivo (JPG, PNG, PDF)
- **Armazenamento Local**: Sistema robusto de armazenamento em `/app/uploads`
- **Drag & Drop**: Interface intuitiva para upload de licenças
- **Feedback Visual**: Indicadores de progresso e status de upload
- **Validação de Tamanho**: Limite de 10MB por arquivo

### 🔍 Visualização de Licenças de Motorista
- **Visualização Inline**: Abrir documentos em nova aba do navegador
- **Download Direto**: Botão de download com nome original do arquivo
- **Verificação de Arquivo**: Validação se arquivo existe antes de tentar abrir
- **Fallback para Arquivos Antigos**: Mensagens explicativas para referências temporárias
- **Debug Logging**: Logs detalhados para troubleshooting

### 📝 Melhorias no Formulário de Aplicação
- **Data US Format**: Campo de data de nascimento em formato MM/DD/YYYY
- **Validação Obrigatória**: Checkbox de termos e condições obrigatório
- **Upload Integrado**: Sistema de upload de licença no passo 2
- **Feedback em Inglês**: Todas as mensagens de upload em inglês
- **Prevenção de Envio**: Botão bloqueado até aceitar os termos

### 📊 Dashboard Aprimorado
- **Tratamento de Erros**: Cada API call com tratamento individual de falhas
- **Estatísticas Robustas**: Cálculos funcionam mesmo com falha em algumas APIs
- **Rate Limiting Fix**: Configuração de rate limiting que não bloqueia CORS
- **Logs Detalhados**: Console logs para diagnóstico de problemas

### 🔒 Segurança e Validação
- **CORS Configurado**: Headers corretos para cross-origin requests
- **Rate Limiting Inteligente**: Bypass para OPTIONS requests (CORS preflight)
- **Validação de Schema**: Prisma schema atualizado com novos campos
- **Error Boundaries**: Tratamento gracioso de erros na UI

### 🌐 Sistema de Tradução v3.0
- **Bilíngue Completo**: Suporte nativo para inglês (EN) e espanhol (ES)
- **Translation System**: Sistema simples e eficiente sem dependências complexas
- **Language Switcher**: Botão de alternância de idioma com persistência no localStorage
- **Homepage Traduzida**: Textos principais da landing page em ambos idiomas
- **Application Form**: Formulário de aplicação completamente traduzido
- **Professional UI**: Interface limpa sem emojis, apenas siglas EN/ES
- **Automatic Reload**: Aplicação automática das traduções após troca de idioma

### 🎨 Homepage Redesign v3.0
- **EOM Branding**: Design focado na marca EOM Staffing
- **Hero Section**: Seção principal com gradiente azul EOM (#18407c)
- **Professional Images**: Imagens do Unsplash para trabalhadores e construção
- **Call-to-Action**: Botões de ação focados em recrutamento de profissionais
- **Brand Colors**: Paleta oficial EOM (azul #18407c, laranja #e74a3e)
- **Typography**: Tipografia moderna e hierarquia visual clara
- **Mobile Responsive**: Design completamente responsivo para todos dispositivos

## 🔧 Detalhes das Correções v4.0 - Schema e Estabilidade

### 🗃️ Migração de Schema Completa
- **Transição Entities**: Clients → Customers, Providers → Employees, Services → Jobs
- **Prisma Schema**: Completamente reestruturado com relacionamentos corretos
- **Database Migration**: Reset completo com preservação da lógica de negócio
- **Seed Data**: Dados de exemplo atualizados para nova estrutura

### 🔄 Sistema Application-Employee Otimizado
- **Approval Workflow**: Applications aprovadas criam automaticamente Employees
- **Data Transfer**: Todos os dados pessoais transferidos da Application para Employee
- **Referência Bidirecional**: Employee mantém referência à Application original via `applicationId`
- **Status Sync**: Status da Application sincronizado com ativação do Employee

### 🛠️ Correções Críticas de Produção
- **Schema Sync Issues**: Resolvidos erros de `employees` include inválido
- **Prisma Client**: Regeneração forçada após mudanças de schema
- **Frontend Fixes**: Correções em `employee.application.firstName` → `employee.firstName`
- **API Stability**: Todas as APIs de dashboard funcionando sem erros 500

### 💼 Sistema de Employees Completo
- **Dados Pessoais**: firstName, lastName, email, phone, dateOfBirth, ssn, gender
- **Endereço**: address1, suite, city, state, zipCode
- **Contato Emergência**: emergencyContactName, phone, relation
- **Trabalho**: jobs[], hourlyRate, assignedTo, workExperience[]
- **Sistema**: applicationId, active, timestamps

### 🏢 Sistema de Customers Otimizado
- **Empresa**: companyName, entity (Corporation/LLC/Partnership), type
- **Endereço**: street, suite, city, state, zipCode, country
- **Financeiro**: wcClass, markupType, markupValue, commission
- **Gestão**: assignedTo, internalNotes, active status

### 🎯 Sistema de Jobs Estruturado
- **Básico**: name (único), description
- **Financeiro**: averageHourlyRate para estimativas
- **Status**: active para controle de visibilidade
- **Integration**: Usado como array em Applications e Employees

### 🔧 Melhorias de Estabilidade
- **Error Handling**: Tratamento robusto de erros em todas as APIs
- **Container Fixes**: Correções de permissões e builds Docker
- **Database Reset**: Processo seguro de reset com seed automático
- **Production Ready**: Ambiente de produção estável e funcional

## 📝 API Endpoints v4.0

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuário atual

### Candidaturas
- `GET /api/applications` - Listar candidaturas com filtros e paginação
- `POST /api/applications` - Criar candidatura (formulário público)
- `PUT /api/applications/:id` - Atualizar/aprovar candidatura (cria Employee automaticamente)
- `DELETE /api/applications/:id` - Excluir candidatura
- `GET /api/applications/stats` - Estatísticas de candidaturas

### Funcionários (Novo v4.0)
- `GET /api/employees` - Listar funcionários ativos
- `GET /api/employees/:id` - Obter funcionário específico
- `PUT /api/employees/:id` - Atualizar dados do funcionário
- `DELETE /api/employees/:id` - Desativar funcionário

### Clientes (Customers v4.0)
- `GET /api/customers` - Listar clientes com filtros
- `POST /api/customers` - Criar novo cliente
- `PUT /api/customers/:id` - Atualizar cliente
- `DELETE /api/customers/:id` - Excluir cliente
- `GET /api/customers/:id` - Obter cliente específico

### Fornecedores
- `GET /api/suppliers` - Listar fornecedores
- `POST /api/suppliers` - Criar fornecedor
- `PUT /api/suppliers/:id` - Atualizar fornecedor
- `DELETE /api/suppliers/:id` - Excluir fornecedor

### Faturamento
- `GET /api/bills` - Listar faturas com dados completos de Customer e Employee
- `POST /api/bills` - Criar fatura (requer customerId e employeeId)
- `PUT /api/bills/:id` - Atualizar fatura
- `DELETE /api/bills/:id` - Excluir fatura
- `GET /api/bills/:id/pdf` - **Gerar PDF da fatura**
- `GET /api/bills/reports` - Relatórios de faturamento

### Tipos de Trabalho (Jobs v4.0)
- `GET /api/jobs` - Listar tipos de trabalho disponíveis
- `POST /api/jobs` - Criar novo tipo de trabalho
- `PUT /api/jobs/:id` - Atualizar tipo de trabalho
- `DELETE /api/jobs/:id` - Excluir tipo de trabalho
- `GET /api/jobs/:id` - Obter tipo de trabalho específico

### Uploads (Aprimorado v2.0)
- `POST /api/uploads/license` - **Upload de licença de motorista**
- `GET /api/uploads/files/:filename` - **Visualizar arquivo uploadado**
- `GET /api/uploads/download/:filename` - **Download direto do arquivo**
- `POST /api/uploads/documents` - Upload de documentos diversos
- `GET /api/uploads/:id` - Download de arquivos (legacy)

## 🔧 Desenvolvimento

### 🛠️ Comandos Úteis
```bash
# Iniciar todos os serviços
docker-compose up -d

# Iniciar serviços específicos
docker-compose up -d backend frontend prisma-studio

# Logs dos containers
docker-compose logs -f

# Logs de um serviço específico
docker-compose logs -f backend

# Rebuild dos containers
docker-compose build --no-cache

# Parar todos os serviços
docker-compose down

# Parar serviço específico
docker-compose stop prisma-studio

# Limpar volumes (cuidado!)
docker-compose down -v

# Verificar status
docker-compose ps
```

### Variáveis de Ambiente
Copie `.env.example` para `.env` em cada serviço e configure:

```bash
# Backend
DATABASE_URL=postgresql://postgres:password@postgres:5432/labor_hive
JWT_SECRET=your-secure-secret
REDIS_URL=redis://redis:6379
```

## 📊 Monitoramento

O sistema inclui:
- Health checks para todos os serviços
- Logs estruturados
- Rate limiting
- Error handling centralizado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## 🆘 Troubleshooting

### Problemas Comuns

#### 1. Erro "Can't reach database server at localhost:5432"
**CAUSA COMUM**: O container PostgreSQL parou de rodar (não é um erro de código)

```bash
# 1. Verificar se PostgreSQL está rodando
lsof -i :5432

# 2. Se não estiver, verificar logs para confirmar que era funcional antes
tail -f /home/rafael/labor-hive-manager/backend/server.log

# 3. Tentar reiniciar PostgreSQL via Docker
docker-compose up postgres -d

# 4. Se houver erro de permissão Docker:
sudo systemctl start docker
sudo usermod -aG docker $USER
newgrp docker

# 5. Alternativa sem sudo (rodar PostgreSQL diretamente):
docker run --name postgres-labor -e POSTGRES_PASSWORD=password -e POSTGRES_DB=labor_hive -p 5432:5432 -d postgres:15-alpine
```

**IMPORTANTE**: Este erro indica que o banco PostgreSQL parou, NÃO é um problema no código!

**STATUS ATUAL**: 
- ✅ Frontend Local: http://localhost:5174 (Vite dev server)
- ✅ Frontend Docker: http://localhost:3000 (container)
- ✅ Backend Docker: http://localhost:5000 (container)
- ✅ PostgreSQL: localhost:5432 (container - funcionando)

**CONFIGURAÇÃO**: 
- Modo desenvolvimento local: Frontend (5174) + Backend Docker (5000)
- Modo produção Docker: Frontend (3000) + Backend (5000)

#### 2. Frontend não acessível (porta dinâmica)
```bash
# O Vite usa portas dinâmicas (5173, 5174, 5175...)
# Verificar qual porta está sendo usada:
ps aux | grep vite
lsof -i :5173 || lsof -i :5174 || lsof -i :5175

# Acessar no navegador a porta correta mostrada pelo comando acima
```

#### 3. Backend retorna 500 Internal Server Error
```bash
# Verificar logs do backend
tail -f /home/rafael/labor-hive-manager/backend/server.log

# Verificar se o banco está conectado
curl http://localhost:3001/health
```

#### 4. Problemas com Docker
```bash
# Verificar status do Docker
sudo systemctl status docker

# Reiniciar Docker se necessário
sudo systemctl restart docker

# Verificar permissões
sudo usermod -aG docker $USER
```

### Suporte

Para dúvidas ou problemas:

**📖 Documentação Disponível:**
- `DOCKER_TROUBLESHOOTING_GUIDE.md` - Guia completo de troubleshooting
- `QUICK_COMMANDS.md` - Comandos rápidos para operações comuns
- `PORT_MAPPING.md` - Mapeamento de portas e configurações

**🔧 Comandos Básicos:**
```bash
# Status geral
docker ps && curl -s http://localhost:5000/health

# Logs de erro
docker compose logs --tail=20 | grep -i error

# Reset completo  
docker compose down && docker compose up --build -d
```

**🌐 Acessos:**
- **Sistema**: http://localhost:3000 (admin/aron$199)
- **Backend**: http://localhost:5000/api/health
- **Prisma Studio**: http://localhost:5555
- **PDF Generator**: http://localhost:5000/api/bills/{id}/pdf

---

**Labor Hive Manager** - Conectando talentos com oportunidades 🚀
