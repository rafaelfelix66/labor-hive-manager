# Labor Hive Manager

Sistema de gestão de terceirização de serviços freelancers com arquitetura em containers Docker.

## 📋 Descrição

O Labor Hive Manager é uma plataforma completa para gerenciar serviços de freelancers, conectando prestadores de serviços qualificados com clientes empresariais. O sistema inclui gestão de candidaturas, prestadores, clientes, fornecedores e faturamento.

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
- **Gestão de Clientes** - CRUD completo de empresas clientes
- **Gestão de Fornecedores** - CRUD completo de empresas fornecedoras
- **Sistema de Faturamento** - Geração, controle e relatórios de faturas
- **📄 Geração de PDF** - Faturas profissionais em PDF
- **📊 Gráficos Financeiros** - Visualização de dados de billing
- **🔍 Busca e Filtros** - Sistema avançado de filtros para todas as entidades

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

## 📁 Estrutura de Dados

### Principais Entidades
- **Users** - Usuários do sistema (admin/manager/user)
- **Applications** - Candidaturas de freelancers
- **Service Providers** - Prestadores aprovados
- **Companies** - Clientes e fornecedores
- **Bills** - Faturas e pagamentos

### Relacionamentos
```
Users 1:N Applications (reviewed_by)
Applications 1:1 Service_Providers
Companies (clients) 1:N Bills
Service_Providers 1:N Bills
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

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuário atual

### Candidaturas
- `GET /api/applications` - Listar candidaturas
- `POST /api/applications` - Criar candidatura
- `PUT /api/applications/:id` - Atualizar candidatura
- `DELETE /api/applications/:id` - Excluir candidatura

### Prestadores
- `GET /api/providers` - Listar prestadores
- `POST /api/providers` - Criar prestador
- `PUT /api/providers/:id` - Atualizar prestador

### Clientes/Fornecedores
- `GET /api/clients` - Listar clientes
- `GET /api/suppliers` - Listar fornecedores
- `POST /api/clients` - Criar cliente
- `POST /api/suppliers` - Criar fornecedor

### Faturamento
- `GET /api/bills` - Listar faturas
- `POST /api/bills` - Criar fatura
- `PUT /api/bills/:id` - Atualizar fatura
- `DELETE /api/bills/:id` - Excluir fatura
- `GET /api/bills/:id/pdf` - **Gerar PDF da fatura**
- `GET /api/bills/reports` - Relatórios de faturamento

### Uploads
- `POST /api/uploads/documents` - Upload de arquivos
- `GET /api/uploads/:id` - Download de arquivos

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
