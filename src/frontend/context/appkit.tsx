"use client";

import { createAppKit } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { defineChain } from 'viem';

const projectId = "57c477a65b9453509e76c6ea34782ba6"; // ✅ Substitua pelo real

const SOCIOS_WALLET_ID = "56843177b5e89d4bcb19a27dab7c49e0f33d8d3a6c8c4c7e5274f605e92befd6"; // ✅ Verifique se está correto

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
  url: "https://trbe.io", // deve bater com o domínio
  icons: ["https://trbe.io/favicon.ico"],
};

createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata,
  networks: [chilizChain],
  projectId,
  featuredWalletIds: [SOCIOS_WALLET_ID],
  features: {
    analytics: true,
  },
});

export function AppKit({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
