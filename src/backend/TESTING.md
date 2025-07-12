# 🧪 Testing Guide - Backend

Este guia explica como executar e escrever testes para o backend do TRBE.

## 📋 Pré-requisitos

1. **Node.js** instalado (versão 18 ou superior)
2. **Dependências** instaladas: `npm install`
3. **Jest** configurado para testes

## 🚀 Executando Testes

### Todos os testes
```bash
npm test
```

### Testes em modo watch (desenvolvimento)
```bash
npm run test:watch
```

### Testes com cobertura
```bash
npm run test:coverage
```

### Testes específicos
```bash
# Apenas testes do servidor
npm run test:server

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration
```

## 📁 Estrutura de Testes

```
src/backend/
├── server.test.js          # Testes principais da API
├── jest.config.js          # Configuração do Jest
├── tests/
│   ├── unit/               # Testes unitários
│   ├── integration/        # Testes de integração
│   └── fixtures/           # Dados de teste
└── services/
    └── *.test.js           # Testes dos serviços
```

## 🧪 Tipos de Testes

### 1. Testes de API (server.test.js)
- ✅ Endpoints de health check
- ✅ Endpoints de usuários
- ✅ Endpoints de blockchain
- ✅ Endpoints de fan clubs
- ✅ Tratamento de erros

### 2. Testes Unitários
- ✅ Serviços individuais
- ✅ Utilitários
- ✅ Validações

### 3. Testes de Integração
- ✅ Banco de dados
- ✅ Blockchain
- ✅ APIs externas

## 🔧 Configuração

### Variáveis de Ambiente para Testes
```env
NODE_ENV=test
RPC_URL=https://test-rpc.com
CHAIN_ID=88882
CONTRACT_ADDRESS_SCORE_USER=0x0000000000000000000000000000000000000001
CONTRACT_ADDRESS_FAN_CLUBS=0x0000000000000000000000000000000000000002
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

### Mocks Configurados
- **Ethers.js**: Mock para evitar chamadas reais ao blockchain
- **Prisma**: Mock para evitar conexões reais ao banco
- **Express**: Testes de endpoints com supertest

## 📊 Cobertura de Testes

### Endpoints Testados
- ✅ `GET /api/health` - Health check básico
- ✅ `GET /api/health/detailed` - Health check detalhado
- ✅ `GET /api/users` - Listar usuários
- ✅ `GET /api/users/:id` - Buscar usuário por ID
- ✅ `POST /api/users` - Criar usuário
- ✅ `GET /getReputation/:userAddress` - Buscar reputação
- ✅ `POST /calculateReputation` - Calcular reputação
- ✅ `POST /fanclub/create` - Criar fan club
- ✅ `GET /fanclub/:id/checkMember/:user` - Verificar membro
- ✅ `GET /fanclub/:id/balance` - Buscar saldo
- ✅ `GET /fanclub/:id/price` - Buscar preço
- ✅ `GET /fanclub/:id/members` - Listar membros

### Cenários de Erro Testados
- ✅ Endereços inválidos
- ✅ Parâmetros ausentes
- ✅ Dados inválidos
- ✅ Rotas inexistentes
- ✅ Erros de servidor

## 🛠️ Escrevendo Novos Testes

### Exemplo de Teste de Endpoint
```javascript
describe('User Endpoints', () => {
  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      displayName: 'Test User'
    };

    const res = await request(app)
      .post('/api/users')
      .send(userData);
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

### Exemplo de Teste de Serviço
```javascript
describe('UserService', () => {
  it('should create user successfully', async () => {
    const userData = { email: 'test@example.com' };
    const result = await userService.createUser(userData);
    
    expect(result).toBeDefined();
    expect(result.email).toBe(userData.email);
  });
});
```

## 🔍 Debugging

### Logs de Teste
```bash
# Verbose mode
npm test -- --verbose

# Debug mode
DEBUG=* npm test
```

### Testes Específicos
```bash
# Teste específico por nome
npm test -- --testNamePattern="should create user"

# Teste específico por arquivo
npm test server.test.js
```

## 📈 Relatórios

### Cobertura
Após executar `npm run test:coverage`, os relatórios estarão em:
- `coverage/lcov-report/index.html` - Relatório HTML
- `coverage/lcov.info` - Relatório LCOV

### Performance
```bash
# Testes com timing
npm test -- --verbose --detectOpenHandles
```

## ⚠️ Boas Práticas

1. **Isolamento**: Cada teste deve ser independente
2. **Mocks**: Use mocks para dependências externas
3. **Cleanup**: Limpe dados após cada teste
4. **Naming**: Use nomes descritivos para testes
5. **Assertions**: Teste um comportamento por vez

## 🆘 Troubleshooting

### Erro: "Cannot find module"
- Verifique se as dependências estão instaladas
- Execute `npm install`

### Erro: "Timeout"
- Aumente o timeout no `jest.config.js`
- Verifique se os mocks estão funcionando

### Erro: "Database connection"
- Verifique se o Prisma está mockado corretamente
- Use `NODE_ENV=test`

### Erro: "Blockchain connection"
- Verifique se o ethers está mockado
- Use endereços de teste válidos 