"use client";

import { createAppKit } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { defineChain } from 'viem';

// Suppress Coinbase Wallet SDK errors in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args[0];
    if (typeof message === 'string' && message.includes('Cross-Origin-Opener-Policy')) {
      return; // Suppress this specific error
    }
    originalConsoleError.apply(console, args);
  };
}

// Suppress Coinbase Wallet SDK errors in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args[0];
    if (typeof message === 'string' && message.includes('Cross-Origin-Opener-Policy')) {
      return; // Suppress this specific error
    }
    originalConsoleError.apply(console, args);
  };
}

const projectId = "57c477a65b9453509e76c6ea34782ba6"; // ✅ Substitua pelo real

const SOCIOS_WALLET_ID = "56843177b5e89d4bcb19a27dab7c49e0f33d8d3a6c8c4c7e5274f605e92befd6"; 

const chilizChain = defineChain({
  id: 88882,
  name: "Chiliz Spicy Testnet",
  network: "chiliz-spicy",
  nativeCurrency: {
    name: "CHZ",
    symbol: "CHZ",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://spicy-rpc.chiliz.com"],
    },
    public: {
      http: ["https://spicy-rpc.chiliz.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Chiliz Explorer",
      url: "https://spicy-explorer.chiliz.com",
    },
  },
});

const metadata = {
  name: "TRBE Platform",
  description: "Fan engagement powered by CHZ and Twitter",
  url: "https://trbe.io",
  icons: ["https://trbe.io/favicon.ico"],
};

// Initialize AppKit with error handling
try {
  createAppKit({
    adapters: [new Ethers5Adapter()],
    metadata,
    networks: [chilizChain],
    projectId,
    
  // Configurações para mostrar APENAS a Socios Wallet
  featuredWalletIds: [SOCIOS_WALLET_ID],
    includeWalletIds: [SOCIOS_WALLET_ID], // Adicione esta linha
  excludeWalletIds: [
    // IDs das wallets que queremos excluir explicitamente
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
    "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase
  ],
  
  features: {
      analytics: true,
      email: false, // Desabilitar login por email
    socials: [], // Remover logins sociais
    emailShowWallets: false, // Não mostrar outras wallets na tela de email
  },
  
  // Configurações adicionais para limitar opções
  allWallets: "HIDE", // Ocultar botão "All Wallets"
  
  // Desabilitar outras integrações que podem causar conflitos
  enableWalletConnect: true,
  enableInjected: false, // Desabilitar detecção automática de wallets injetadas
  enableCoinbaseWallet: false, // Desabilitar explicitamente Coinbase
  });
} catch (error) {
  // Log error but don't break the app
  if (process.env.NODE_ENV === 'development') {
    console.warn('AppKit initialization error:', error);
  }
}

export function AppKit({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}