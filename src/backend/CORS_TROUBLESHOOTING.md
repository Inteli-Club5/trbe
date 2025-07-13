# CORS Troubleshooting Guide

## Problema: Erro de CORS na API de Futebol

### Sintomas
- Erro no console do navegador: "Access to fetch at 'http://localhost:5001/api/football/...' from origin 'http://localhost:3000' has been blocked by CORS policy"
- Requisições da API de futebol falhando no frontend
- Erro 403 ou 405 nas requisições

### Soluções Implementadas

#### 1. Configuração de CORS Melhorada
O servidor backend agora tem uma configuração de CORS mais robusta que permite múltiplas origens:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

#### 2. Proxy do Next.js
Em desenvolvimento, o Next.js agora faz proxy das requisições da API para evitar problemas de CORS:

```javascript
// next.config.mjs
async rewrites() {
  if (process.env.NODE_ENV === 'development') {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
    ];
  }
  return [];
}
```

#### 3. API Client Atualizado
O frontend agora usa o backend como proxy em vez de acessar diretamente a API externa:

```typescript
// Antes (causava CORS)
export const apiFootballClient = new ApiClient("https://api.football-data.org");

// Depois (usa proxy)
export const apiFootballClient = apiClient; // Usa o mesmo cliente que acessa o backend
```

### Como Testar

#### 1. Teste da API Backend
```bash
cd src/backend
npm run test:football
```

#### 2. Teste Manual no Navegador
1. Abra o DevTools (F12)
2. Vá para a aba Console
3. Execute:
```javascript
fetch('/api/football/competitions')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

#### 3. Teste com curl
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:5001/api/football/competitions
```

### Verificações Comuns

#### 1. Verificar se o Backend está Rodando
```bash
curl http://localhost:5001/api/health
```

#### 2. Verificar Portas
- Backend: `http://localhost:5001`
- Frontend: `http://localhost:3000`

#### 3. Verificar Variáveis de Ambiente
```bash
# Backend (.env)
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Problemas Comuns e Soluções

#### 1. "CORS blocked origin"
- Verifique se a origem está na lista `allowedOrigins`
- Adicione a origem se necessário

#### 2. "Failed to fetch"
- Verifique se o backend está rodando
- Verifique se as portas estão corretas
- Verifique se não há firewall bloqueando

#### 3. "API key invalid"
- Verifique se a API key do football-data.org está configurada
- Verifique se a key tem permissões adequadas

#### 4. "Network Error"
- Verifique a conectividade de rede
- Verifique se o proxy do Next.js está funcionando

### Debugging

#### 1. Logs do Backend
```bash
cd src/backend
npm run dev
# Observe os logs de CORS no console
```

#### 2. Logs do Frontend
```bash
cd src/frontend
npm run dev
# Observe os logs no console do navegador
```

#### 3. Network Tab
1. Abra DevTools
2. Vá para a aba Network
3. Faça uma requisição
4. Verifique se há erros de CORS

### Configuração de Produção

Para produção, certifique-se de:

1. Configurar `FRONTEND_URL` no backend
2. Configurar `NEXT_PUBLIC_API_URL` no frontend
3. Usar HTTPS em produção
4. Configurar domínios corretos no CORS

### Comandos Úteis

```bash
# Reiniciar backend
cd src/backend && npm run dev

# Reiniciar frontend
cd src/frontend && npm run dev

# Testar API
cd src/backend && npm run test:football

# Verificar logs
cd src/backend && npm run railway:logs
``` 