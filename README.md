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

## 🚀 Funcionalidades

### Frontend (React)
- **Landing Page** - Apresentação da plataforma
- **Sistema de Login** - Autenticação com roles (admin/user)
- **Dashboard** - Painel principal com estatísticas
- **Candidaturas** - Formulário multi-etapa para freelancers
- **Admin Panel** - Gestão de candidaturas com filtros
- **Gestão de Prestadores** - CRUD de service providers
- **Gestão de Clientes** - CRUD de empresas clientes
- **Gestão de Fornecedores** - CRUD de empresas fornecedoras
- **Sistema de Faturamento** - Geração e controle de faturas

### Backend (API)
- **Autenticação JWT** - Sistema seguro de autenticação
- **CRUD Completo** - Para todas as entidades
- **Upload de Arquivos** - Para documentos e licenças
- **Filtros e Paginação** - Para listagens otimizadas
- **Rate Limiting** - Proteção contra abuso
- **Validação de Dados** - Com Zod schemas
- **Logs Estruturados** - Para monitoramento

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

### URLs dos Serviços
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Nginx (Proxy)**: http://localhost:80
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Executar individualmente

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
npm install
npm run dev
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

### Credenciais Demo
```
Admin: username: admin, password: admin
User:  username: user,  password: user
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
- `GET /api/bills/:id/pdf` - Gerar PDF

### Uploads
- `POST /api/uploads/documents` - Upload de arquivos
- `GET /api/uploads/:id` - Download de arquivos

## 🔧 Desenvolvimento

### Comandos Úteis
```bash
# Logs dos containers
docker-compose logs -f

# Rebuild dos containers
docker-compose build --no-cache

# Parar todos os serviços
docker-compose down

# Limpar volumes (cuidado!)
docker-compose down -v
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

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique os logs: `docker-compose logs`
2. Verifique o status: `docker-compose ps`
3. Reinicie os serviços: `docker-compose restart`

---

**Labor Hive Manager** - Conectando talentos com oportunidades 🚀
