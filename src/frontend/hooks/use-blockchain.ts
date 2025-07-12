"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import {
  getFanClubsContract,
  getScoreUserContract,
  getFanClubData,
  getUserReputation,
  createFanClub,
  joinFanClub,
  leaveFanClub,
  updateFanClubPrice,
  withdrawFromFanClub,
  calculateReputation,
  switchToChilizNetwork,
  formatEther,
  formatAddress,
  parseContractError,
} from "@/lib/blockchain";
import { type FanClub, type FanClubId, type UserAddress, type ReputationData } from "@/lib/contracts";
import { useToast } from "./use-toast";

interface BlockchainState {
  isConnected: boolean;
  address: string | null;
  signer: ethers.Signer | null;
  provider: ethers.providers.Web3Provider | null;
  isCorrectNetwork: boolean;
  isLoading: boolean;
  error: string | null;
}

interface TransactionState {
  isPending: boolean;
  hash: string | null;
  error: string | null;
}

export function useBlockchain() {
  const { address, isConnected } = useAppKitAccount();
  const appKit = useAppKit();
  const { toast } = useToast();

  const [state, setState] = useState<BlockchainState>({
    isConnected: false,
    address: null,
    signer: null,
    provider: null,
    isCorrectNetwork: false,
    isLoading: false,
    error: null,
  });

  const [transactionState, setTransactionState] = useState<TransactionState>({
    isPending: false,
    hash: null,
    error: null,
  });

  // Initialize blockchain connection
  useEffect(() => {
    const initializeBlockchain = async () => {
      if (!isConnected || !address) {
        setState(prev => ({
          ...prev,
          isConnected: false,
          address: null,
          signer: null,
          provider: null,
          isCorrectNetwork: false,
        }));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Check if ethereum provider is available
        if (!window.ethereum) {
          throw new Error("No wallet detected");
        }

        // Create ethers provider from window.ethereum
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        
        // Request account access
        await provider.send("eth_requestAccounts", []);
        
        const signer = provider.getSigner();
        
        // Verify signer has an address
        const signerAddress = await signer.getAddress();
        if (!signerAddress) {
          throw new Error("No account connected to signer");
        }

        // Check if we're on the correct network
        const network = await provider.getNetwork();
        const isCorrectNetwork = network.chainId === 88882; // Chiliz Spicy Testnet (hardcoded for now)

        setState(prev => ({
          ...prev,
          isConnected: true,
          address,
          signer,
          provider,
          isCorrectNetwork,
          isLoading: false,
        }));

        if (!isCorrectNetwork) {
          toast({
            title: "Wrong Network",
            description: "Please switch to Chiliz Spicy Testnet",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to initialize blockchain:", error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Failed to connect to blockchain",
        }));
      }
    };

    initializeBlockchain();
  }, [isConnected, address, toast]);

  // Switch to correct network
  const switchNetwork = useCallback(async () => {
    try {
      const success = await switchToChilizNetwork();
      if (success) {
        toast({
          title: "Network Switched",
          description: "Successfully connected to Chiliz Spicy Testnet",
        });
        // Refresh the page to reinitialize
        window.location.reload();
      } else {
        toast({
          title: "Network Switch Failed",
          description: "Please manually switch to Chiliz Spicy Testnet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to switch network:", error);
      toast({
        title: "Network Error",
        description: "Failed to switch network",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Execute transaction with loading state
  const executeTransaction = useCallback(async (
    transactionFn: () => Promise<any>,
    successMessage: string
  ) => {
    if (!state.signer || !state.address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!state.isCorrectNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Chiliz Spicy Testnet",
        variant: "destructive",
      });
      return;
    }

    // Check CHZ balance before transaction
    try {
      const balance = await state.provider?.getBalance(state.address);
      if (balance && balance.lt(ethers.utils.parseEther("0.01"))) {
        toast({
          title: "Insufficient Balance",
          description: "You need at least 0.01 CHZ for gas fees",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      console.warn("Could not check balance:", error);
    }

    setTransactionState({
      isPending: true,
      hash: null,
      error: null,
    });

    try {
      const result = await transactionFn();
      
      if (result.success) {
        setTransactionState({
          isPending: false,
          hash: result.hash,
          error: null,
        });
        
        toast({
          title: "Transaction Successful",
          description: successMessage,
        });
        
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Transaction error details:", error);
      
      // Check for specific error types
      let errorMessage = "Transaction failed";
      
      if (error.code === 4001) {
        errorMessage = "Transaction rejected by user";
      } else if (error.code === -32603) {
        errorMessage = "Insufficient funds or gas. Please check your CHZ balance.";
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient CHZ balance for this transaction";
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message?.includes("user rejected")) {
        errorMessage = "Transaction was cancelled";
      } else {
        errorMessage = parseContractError(error) || error.message || "Transaction failed";
      }
      
      setTransactionState({
        isPending: false,
        hash: null,
        error: errorMessage,
      });
      
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [state.signer, state.isCorrectNetwork, toast]);

  // Fan Club functions
  const getFanClub = useCallback(async (fanClubId: FanClubId): Promise<FanClub | null> => {
    try {
      return await getFanClubData(fanClubId, state.address || undefined);
    } catch (error) {
      console.error("Failed to get fan club:", error);
      toast({
        title: "Error",
        description: "Failed to load fan club data",
        variant: "destructive",
      });
      return null;
    }
  }, [state.address, toast]);

  const createNewFanClub = useCallback(async (fanClubId: FanClubId, price: string) => {
    return executeTransaction(
      () => createFanClub(fanClubId, price, state.signer!),
      `Fan club "${fanClubId}" created successfully!`
    );
  }, [executeTransaction, state.signer]);

  const joinExistingFanClub = useCallback(async (fanClubId: FanClubId, price: string) => {
    return executeTransaction(
      () => joinFanClub(fanClubId, price, state.signer!),
      `Successfully joined fan club "${fanClubId}"!`
    );
  }, [executeTransaction, state.signer]);

  const leaveExistingFanClub = useCallback(async (fanClubId: FanClubId) => {
    return executeTransaction(
      () => leaveFanClub(fanClubId, state.signer!),
      `Successfully left fan club "${fanClubId}"!`
    );
  }, [executeTransaction, state.signer]);

  const updateFanClubJoinPrice = useCallback(async (fanClubId: FanClubId, newPrice: string) => {
    return executeTransaction(
      () => updateFanClubPrice(fanClubId, newPrice, state.signer!),
      `Fan club "${fanClubId}" price updated successfully!`
    );
  }, [executeTransaction, state.signer]);

  const withdrawFanClubFunds = useCallback(async (fanClubId: FanClubId, amount: string) => {
    return executeTransaction(
      () => withdrawFromFanClub(fanClubId, amount, state.signer!),
      `Successfully withdrew ${amount} CHZ from fan club "${fanClubId}"!`
    );
  }, [executeTransaction, state.signer]);

  // Reputation functions
  const getReputation = useCallback(async (userAddress?: UserAddress): Promise<number> => {
    try {
      const targetAddress = userAddress || state.address;
      if (!targetAddress) return 0;
      
      return await getUserReputation(targetAddress);
    } catch (error) {
      console.error("Failed to get reputation:", error);
      toast({
        title: "Error",
        description: "Failed to load reputation data",
        variant: "destructive",
      });
      return 0;
    }
  }, [state.address, toast]);

  const updateReputation = useCallback(async (
    userAddress: UserAddress,
    reputationData: Omit<ReputationData, "user" | "score">
  ) => {
    return executeTransaction(
      () => calculateReputation(userAddress, reputationData, state.signer!),
      "Reputation updated successfully!"
    );
  }, [executeTransaction, state.signer]);

  // Utility functions
  const formatUserAddress = useCallback((address: string) => {
    return formatAddress(address);
  }, []);

  const formatTokenAmount = useCallback((amount: string | number) => {
    return formatEther(amount);
  }, []);

  // Connect wallet
  const connectWallet = useCallback(() => {
    if (!isConnected) {
      appKit.open();
    }
  }, [isConnected, appKit]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    // For now, just close the AppKit modal
    appKit.close();
  }, [appKit]);

  return {
    // State
    ...state,
    transactionState,
    
    // Network functions
    switchNetwork,
    
    // Fan Club functions
    getFanClub,
    createNewFanClub,
    joinExistingFanClub,
    leaveExistingFanClub,
    updateFanClubJoinPrice,
    withdrawFanClubFunds,
    
    // Reputation functions
    getReputation,
    updateReputation,
    
    // Utility functions
    formatUserAddress,
    formatTokenAmount,
    
    // Wallet functions
    connectWallet,
    disconnectWallet,
  };
} 