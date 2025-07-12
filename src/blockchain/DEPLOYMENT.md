# 🚀 Deployment Guide

Este guia explica como fazer o deploy dos contratos do Tribe no blockchain.

## 📋 Pré-requisitos

1. **Node.js** instalado (versão 16 ou superior)
2. **Chave privada** configurada no arquivo `.env`
3. **Saldo** na carteira para gas fees

## 🔧 Configuração

### 1. Configurar variáveis de ambiente

Crie um arquivo `.env` na pasta `src/blockchain/`:

```env
PRIVATE_KEY=sua_chave_privada_aqui
```

### 2. Instalar dependências

```bash
cd src/blockchain
npm install
```

## 🚀 Deploy

### Deploy na rede Spicy (Testnet)

```bash
npm run deploy
```

### Deploy na rede local (Hardhat)

```bash
npm run deploy:local
```

## ✅ Verificação

### Verificar contratos na rede Spicy

```bash
npm run verify
```

### Verificar contratos na rede local

```bash
npm run verify:local
```

## 📊 Contratos Deployados

Após o deploy, os endereços dos contratos serão salvos em `contract-addresses.json`:

```json
{
  "networks": {
    "spicy": {
      "FanClubs": "0x...",
      "ScoreUser": "0x..."
    }
  }
}
```

## 🧪 Testes

### Executar todos os testes

```bash
npm run test:all
```

### Testes individuais

```bash
npm run test:fanclubs
npm run test:scoreuser
npm run test:nftbadge
```

## 📝 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run deploy` | Deploy na rede Spicy |
| `npm run deploy:local` | Deploy na rede local |
| `npm run verify` | Verificar contratos na Spicy |
| `npm run verify:local` | Verificar contratos local |
| `npm run test:all` | Executar todos os testes |
| `npm run compile` | Compilar contratos |
| `npm run clean` | Limpar cache de compilação |

## 🔍 Verificação no Block Explorer

Após o deploy, você pode verificar os contratos no block explorer da Chiliz:

1. Acesse: https://spicy-explorer.chiliz.com/
2. Cole o endereço do contrato
3. Verifique o código fonte

## ⚠️ Importante

- **Nunca** compartilhe sua chave privada
- **Sempre** teste em rede local primeiro
- **Verifique** os endereços antes de usar no frontend
- **Mantenha** backup dos endereços dos contratos

## 🆘 Troubleshooting

### Erro: "Insufficient funds"
- Adicione mais CHZ à sua carteira

### Erro: "Contract verification failed"
- Verifique se os contratos foram compilados: `npm run compile`

### Erro: "Network not found"
- Verifique se está conectado à rede correta
- Use `npx hardhat console --network spicy` para testar conexão 