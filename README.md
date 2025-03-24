Thought for 1 second### Documentação do Sistema de Reserva de Equipamentos Audiovisuais

## Visão Geral

O Sistema de Reserva de Equipamentos Audiovisuais é uma plataforma web desenvolvida para gerenciar o empréstimo de equipamentos audiovisuais em ambiente escolar. A aplicação permite que professores reservem equipamentos disponíveis e que administradores gerenciem todo o sistema, incluindo usuários, equipamentos e reservas.

## Arquitetura do Sistema

O sistema foi desenvolvido utilizando as seguintes tecnologias:

- **Next.js**: Framework React com App Router para estruturação das páginas
- **TypeScript**: Para tipagem estática e melhor organização do código
- **Tailwind CSS**: Para estilização responsiva
- **Shadcn/UI**: Biblioteca de componentes para interface de usuário
- **LocalStorage**: Para simular um banco de dados persistente no navegador


## Estrutura de Arquivos

```plaintext
├── app/                      # Páginas da aplicação (Next.js App Router)
│   ├── layout.tsx            # Layout principal da aplicação
│   ├── page.tsx              # Página inicial (login)
│   └── dashboard/            # Área logada do sistema
│       ├── layout.tsx        # Layout do dashboard
│       ├── page.tsx          # Dashboard principal
│       ├── reservar/         # Página de reserva de equipamentos
│       └── gerenciar/        # Página de gerenciamento (admin)
├── components/               # Componentes reutilizáveis
│   ├── ui/                   # Componentes de UI (shadcn)
│   ├── auth-provider.tsx     # Provedor de autenticação
│   ├── app-sidebar.tsx       # Barra lateral da aplicação
│   ├── header.tsx            # Cabeçalho da aplicação
│   ├── login-form.tsx        # Formulário de login
│   ├── equipment-grid.tsx    # Grade de equipamentos
│   ├── reservation-list.tsx  # Lista de reservas
│   ├── reservation-form.tsx  # Formulário de reserva
│   └── *-management.tsx      # Componentes de gerenciamento
├── services/                 # Serviços para comunicação com o "backend"
│   ├── user-service.ts       # Serviço de usuários
│   ├── equipment-service.ts  # Serviço de equipamentos
│   └── reservation-service.ts # Serviço de reservas
├── types/                    # Definições de tipos TypeScript
│   └── index.ts              # Tipos principais (User, Equipment, Reservation)
└── hooks/                    # Hooks personalizados
    ├── use-mobile.tsx        # Hook para detectar dispositivos móveis
    └── use-toast.ts          # Hook para notificações toast
```

## Modelos de Dados

O sistema utiliza três modelos principais de dados:

### Usuário (User)

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "teacher";
}
```

### Equipamento (Equipment)

```typescript
interface Equipment {
  id: string;
  name: string;
  type: string;
  description: string;
  location: string;
  available: boolean;
}
```

### Reserva (Reservation)

```typescript
interface Reservation {
  id: string;
  userId: string;
  equipmentId: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: "active" | "returned" | "canceled";
}
```

## Telas do Sistema

### 1. Tela de Login

**Arquivo:** `app/page.tsx` e `components/login-form.tsx`

**Descrição:** Página inicial do sistema onde os usuários fazem login para acessar o dashboard.

**Funcionalidades:**

- Formulário de login com validação de campos
- Autenticação de usuários (email e senha)
- Redirecionamento para o dashboard após login bem-sucedido
- Feedback visual de erros de autenticação


**Componentes principais:**

- `LoginForm`: Formulário de login com validação usando Zod
- `AuthProvider`: Contexto de autenticação que gerencia o estado do usuário logado


**Fluxo de dados:**

1. Usuário insere email e senha
2. O sistema valida os dados usando Zod
3. O serviço de autenticação verifica as credenciais
4. Se válido, o usuário é redirecionado para o dashboard


### 2. Dashboard Principal

**Arquivo:** `app/dashboard/page.tsx`

**Descrição:** Página principal após o login, exibindo um resumo das informações relevantes para o usuário.

**Funcionalidades:**

- Exibição de estatísticas (equipamentos disponíveis, reservas ativas, próxima devolução)
- Lista de equipamentos disponíveis para reserva
- Lista de reservas ativas do usuário
- Acesso rápido à página de gerenciamento (para administradores)


**Componentes principais:**

- `EquipmentGrid`: Exibe os equipamentos em formato de cards
- `ReservationList`: Lista as reservas ativas do usuário
- Cards de estatísticas com informações resumidas


**Fluxo de dados:**

1. Ao carregar, o dashboard busca dados de equipamentos e reservas
2. Para usuários comuns, filtra apenas suas próprias reservas
3. Para administradores, exibe todas as reservas e um botão de acesso ao gerenciamento


### 3. Página de Reserva

**Arquivo:** `app/dashboard/reservar/page.tsx` e `components/reservation-form.tsx`

**Descrição:** Página onde os usuários podem reservar equipamentos disponíveis.

**Funcionalidades:**

- Formulário para seleção de equipamento
- Seleção de datas de retirada e devolução com calendário
- Campo para informar o propósito da reserva
- Validação de dados antes da submissão


**Componentes principais:**

- `ReservationForm`: Formulário de reserva com validação usando Zod
- Calendário para seleção de datas
- Select para escolha de equipamentos disponíveis


**Fluxo de dados:**

1. O sistema carrega a lista de equipamentos disponíveis
2. Usuário seleciona equipamento, datas e informa o propósito
3. Ao submeter, o sistema cria uma nova reserva
4. O equipamento é marcado como indisponível
5. Usuário é redirecionado para o dashboard com mensagem de sucesso


### 4. Página de Gerenciamento (Administrador)

**Arquivo:** `app/dashboard/gerenciar/page.tsx`

**Descrição:** Página exclusiva para administradores, permitindo o gerenciamento completo do sistema.

**Funcionalidades:**

- Gerenciamento de reservas (visualizar, alterar status)
- Gerenciamento de usuários (criar, editar, excluir)
- Gerenciamento de equipamentos (criar, editar, excluir)
- Filtros e busca em cada seção


**Componentes principais:**

- `ReservationManagement`: Gerencia todas as reservas do sistema
- `UserManagement`: Gerencia usuários (professores e administradores)
- `EquipmentManagement`: Gerencia o cadastro de equipamentos


**Fluxo de dados:**

1. O sistema carrega todos os dados (usuários, equipamentos e reservas)
2. Administrador pode filtrar e buscar informações em cada aba
3. Ações como criar, editar ou excluir são processadas e persistidas
4. Feedback visual é fornecido após cada ação


#### 4.1 Gerenciamento de Reservas

**Funcionalidades específicas:**

- Visualização de todas as reservas do sistema
- Filtros por status (ativo, devolvido, cancelado)
- Busca por equipamento, usuário ou propósito
- Alteração de status das reservas (marcar como devolvido, cancelar, reativar)


#### 4.2 Gerenciamento de Usuários

**Funcionalidades específicas:**

- Listagem de todos os usuários
- Criação de novos usuários (professores ou administradores)
- Edição de dados de usuários existentes
- Exclusão de usuários
- Busca por nome ou email


#### 4.3 Gerenciamento de Equipamentos

**Funcionalidades específicas:**

- Listagem de todos os equipamentos
- Cadastro de novos equipamentos
- Edição de informações de equipamentos
- Exclusão de equipamentos
- Busca por nome, tipo ou localização


## Componentes Principais

### Barra Lateral (Sidebar)

**Arquivo:** `components/app-sidebar.tsx` e `components/ui/sidebar.tsx`

**Descrição:** Barra lateral de navegação presente em todas as páginas após o login.

**Funcionalidades:**

- Navegação entre as páginas principais
- Exibição de informações do usuário logado
- Opção de logout
- Responsiva (colapsa em dispositivos móveis)


### Cabeçalho (Header)

**Arquivo:** `components/header.tsx`

**Descrição:** Cabeçalho presente em todas as páginas após o login.

**Funcionalidades:**

- Botão para expandir/colapsar a barra lateral
- Título da aplicação
- Acesso rápido ao gerenciamento (para administradores)
- Menu de notificações
- Menu de perfil do usuário com opção de logout


### Provedor de Autenticação

**Arquivo:** `components/auth-provider.tsx`

**Descrição:** Contexto React que gerencia o estado de autenticação do usuário.

**Funcionalidades:**

- Armazenamento do usuário logado
- Funções de login e logout
- Persistência do login usando localStorage
- Proteção de rotas (redirecionamento para login quando não autenticado)


## Serviços

### Serviço de Usuários

**Arquivo:** `services/user-service.ts`

**Descrição:** Gerencia operações relacionadas a usuários.

**Funcionalidades:**

- Autenticação de usuários
- Listagem de usuários
- Criação, edição e exclusão de usuários
- Inicialização com usuários padrão (admin e professor)


### Serviço de Equipamentos

**Arquivo:** `services/equipment-service.ts`

**Descrição:** Gerencia operações relacionadas a equipamentos.

**Funcionalidades:**

- Listagem de equipamentos
- Criação, edição e exclusão de equipamentos
- Atualização de disponibilidade de equipamentos
- Inicialização com equipamentos padrão


### Serviço de Reservas

**Arquivo:** `services/reservation-service.ts`

**Descrição:** Gerencia operações relacionadas a reservas.

**Funcionalidades:**

- Listagem de todas as reservas
- Filtragem de reservas por usuário ou equipamento
- Criação de novas reservas
- Atualização de status de reservas (ativo, devolvido, cancelado)


## Fluxos de Usuário

### Fluxo do Professor

1. **Login**: Professor acessa o sistema com suas credenciais
2. **Dashboard**: Visualiza equipamentos disponíveis e suas reservas ativas
3. **Reserva**: Acessa a página de reserva, seleciona equipamento e datas
4. **Confirmação**: Recebe confirmação da reserva e retorna ao dashboard
5. **Acompanhamento**: Visualiza suas reservas ativas no dashboard


### Fluxo do Administrador

1. **Login**: Administrador acessa o sistema com suas credenciais
2. **Dashboard**: Visualiza estatísticas gerais e todas as reservas
3. **Gerenciamento**: Acessa a página de gerenciamento através do botão no dashboard ou header
4. **Administração**: Gerencia reservas, usuários e equipamentos conforme necessário
5. **Monitoramento**: Acompanha todas as atividades do sistema


## Recursos Técnicos

### Persistência de Dados

O sistema utiliza localStorage para simular um banco de dados, permitindo que os dados persistam entre sessões do navegador. Cada serviço (user, equipment, reservation) gerencia seu próprio espaço no localStorage.

### Autenticação

A autenticação é simulada usando localStorage. Quando um usuário faz login, suas informações são armazenadas e um token é criado. O sistema verifica esse token em cada carregamento de página protegida.

### Responsividade

O sistema é totalmente responsivo, adaptando-se a diferentes tamanhos de tela:

- Em dispositivos móveis, a barra lateral se transforma em um menu deslizante
- Tabelas se ajustam com scroll horizontal quando necessário
- Layouts flexíveis que se reorganizam em telas menores


### Validação de Dados

Todos os formulários utilizam a biblioteca Zod para validação de dados, garantindo que apenas informações válidas sejam processadas pelo sistema.

## Credenciais Padrão

O sistema é inicializado com dois usuários padrão:

1. **Administrador**

1. Email: [admin@escola.edu.br](mailto:admin@escola.edu.br)
2. Senha: admin123



2. **Professor**

1. Email: [professor@escola.edu.br](mailto:professor@escola.edu.br)
2. Senha: professor123





## Considerações Finais

O Sistema de Reserva de Equipamentos Audiovisuais foi projetado para ser intuitivo, responsivo e fácil de usar. A interface foi desenvolvida pensando na experiência do usuário, com feedback visual para todas as ações e navegação simplificada.

A arquitetura do código segue boas práticas de desenvolvimento, com separação clara de responsabilidades, componentes reutilizáveis e tipagem estática para maior segurança.

Embora utilize localStorage para persistência de dados (simulando um banco de dados), a estrutura do sistema foi projetada para facilitar a integração com um backend real no futuro, bastando adaptar os serviços para consumir APIs externas.
