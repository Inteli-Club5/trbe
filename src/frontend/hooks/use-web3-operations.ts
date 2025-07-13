"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { useToast } from "./use-toast";

interface Web3OperationsState {
  isConnected: boolean;
  address: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useWeb3Operations() {
  const { address, isConnected } = useAppKitAccount();
  const appKit = useAppKit();
  const { toast } = useToast();

  const [state, setState] = useState<Web3OperationsState>({
    isConnected: false,
    address: null,
    isLoading: false,
    error: null,
  });

  // Initialize when wallet connects
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isConnected,
      address: address || null,
    }));
  }, [isConnected, address]);

  // Generic operation wrapper with error handling
  const executeOperation = useCallback(async <T>(
    operationFn: () => Promise<T>,
    successMessage?: string
  ): Promise<T | null> => {
    if (!state.isConnected || !state.address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await operationFn();
      
      if (successMessage) {
        toast({
          title: "Success",
          description: successMessage,
        });
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      return result;
    } catch (error: any) {
      console.error("Web3 operation error:", error);
      
      const errorMessage = error.message || "Operation failed";
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  }, [state.isConnected, state.address, toast]);

  // Get signer for blockchain operations
  const getSigner = useCallback((): ethers.Signer | null => {
    if (!window.ethereum) {
      toast({
        title: "No Wallet",
        description: "No wallet provider found",
        variant: "destructive",
      });
      return null;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      return provider.getSigner();
    } catch (error) {
      console.error("Failed to get signer:", error);
      toast({
        title: "Wallet Error",
        description: "Failed to get wallet signer",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Check if user is on correct network
  const checkNetwork = useCallback(async (): Promise<boolean> => {
    if (!window.ethereum) return false;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const expectedChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "88882");
      
      return network.chainId === expectedChainId;
    } catch (error) {
      console.error("Failed to check network:", error);
      return false;
    }
  }, []);

  // Switch to correct network
  const switchNetwork = useCallback(async (): Promise<boolean> => {
    if (!window.ethereum) {
      toast({
        title: "No Wallet",
        description: "No wallet provider found",
        variant: "destructive",
      });
      return false;
    }

    try {
      const expectedChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "88882");
      
      await (window.ethereum as any).request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${expectedChainId.toString(16)}` }],
      });
      
      toast({
        title: "Network Switched",
        description: "Successfully switched to Chiliz Spicy Testnet",
      });
      
      return true;
    } catch (error: any) {
      console.error("Failed to switch network:", error);
      
      if (error.code === 4902) {
        // Network doesn't exist, add it
        try {
          await (window.ethereum as any).request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${(parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "88882")).toString(16)}`,
                chainName: "Chiliz Spicy Testnet",
                nativeCurrency: {
                  name: "CHZ",
                  symbol: "CHZ",
                  decimals: 18,
                },
                rpcUrls: ["https://spicy-rpc.chiliz.com"],
                blockExplorerUrls: ["https://spicy-explorer.chiliz.com"],
              },
            ],
          });
          
          toast({
            title: "Network Added",
            description: "Successfully added Chiliz Spicy Testnet",
          });
          
          return true;
        } catch (addError) {
          console.error("Failed to add network:", addError);
          toast({
            title: "Network Error",
            description: "Failed to add network",
            variant: "destructive",
          });
          return false;
        }
      }
      
      toast({
        title: "Network Error",
        description: "Failed to switch network",
        variant: "destructive",
      });
      
      return false;
    }
  }, [toast]);

  // Wallet operations
  const connectWallet = useCallback(() => {
    if (!isConnected) {
      appKit.open();
    }
  }, [isConnected, appKit]);

  const disconnectWallet = useCallback(() => {
    appKit.close();
  }, [appKit]);

  // Blockchain operations (these will use the existing blockchain functions)
  const executeBlockchainOperation = useCallback(async <T>(
    operationFn: (signer: ethers.Signer) => Promise<T>,
    successMessage?: string
  ): Promise<T | null> => {
    return executeOperation(async () => {
      const signer = getSigner();
      if (!signer) {
        throw new Error("Failed to get wallet signer");
      }

      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        const switched = await switchNetwork();
        if (!switched) {
          throw new Error("Please switch to Chiliz Spicy Testnet");
        }
      }

      return await operationFn(signer);
    }, successMessage);
  }, [executeOperation, getSigner, checkNetwork, switchNetwork]);

  return {
    // State
    ...state,
    
    // Network operations
    checkNetwork,
    switchNetwork,
    
    // Wallet operations
    connectWallet,
    disconnectWallet,
    
    // Utility functions
    getSigner,
    executeOperation,
    executeBlockchainOperation,
  };
} 