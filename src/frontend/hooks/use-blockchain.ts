"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useWeb3Operations } from "./use-web3-operations";
import {
  getFanClubsContract,
  getScoreUserContract,
  getFanClubData,
  getAllFanClubIds,
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
  createMarketplace,
  listMarketplaceItem,
  delistMarketplaceItem,
  buyMarketplaceItem,
  getMarketplaceItems,
  getFanTokenBalance,
  depositFanTokens,
  withdrawFanTokens,
  rewardFanTokens,
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
  const { address, isConnected, connectWallet, disconnectWallet, executeBlockchainOperation } = useWeb3Operations();
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
        // For now, we'll use a simplified approach since AppKit handles the connection
        // The signer and provider will be available through the blockchain library functions
        // We'll assume the network is correct for now and let the user switch if needed
        
        setState(prev => ({
          ...prev,
          isConnected: true,
          address,
          signer: null, // Will be provided by blockchain functions when needed
          provider: null, // Will be provided by blockchain functions when needed
          isCorrectNetwork: true, // Assume correct network for now
          isLoading: false,
        }));
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
  }, [isConnected, address]);

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
    if (!state.address) {
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

    // Get signer from AppKit when needed
    let signer: ethers.Signer;
    try {
      // Try to get signer from window.ethereum
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
      } else {
        throw new Error("No wallet provider available");
      }
    } catch (error) {
      toast({
        title: "Wallet Error",
        description: "Failed to get wallet signer",
        variant: "destructive",
      });
      return;
    }

    // Check CHZ balance before transaction
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(state.address);
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
      // Pass the signer to the transaction function
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
  const getAllFanClubIdsList = useCallback(async (): Promise<string[]> => {
    try {
      return await getAllFanClubIds();
    } catch (error) {
      console.error("Failed to get all fan club IDs:", error);
      toast({
        title: "Error",
        description: "Failed to load fan club IDs",
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

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
      async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        return await createFanClub(fanClubId, price, signer);
      },
      `Fan club "${fanClubId}" created successfully!`
    );
  }, [executeTransaction]);

  const joinExistingFanClub = useCallback(async (fanClubId: FanClubId, price: string) => {
    return executeTransaction(
      async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        return await joinFanClub(fanClubId, price, signer);
      },
      `Successfully joined fan club "${fanClubId}"!`
    );
  }, [executeTransaction]);

  const leaveExistingFanClub = useCallback(async (fanClubId: FanClubId) => {
    return executeTransaction(
      async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        return await leaveFanClub(fanClubId, signer);
      },
      `Successfully left fan club "${fanClubId}"!`
    );
  }, [executeTransaction]);

  const updateFanClubJoinPrice = useCallback(async (fanClubId: FanClubId, newPrice: string) => {
    return executeTransaction(
      async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        return await updateFanClubPrice(fanClubId, newPrice, signer);
      },
      `Fan club "${fanClubId}" price updated successfully!`
    );
  }, [executeTransaction]);

  const withdrawFanClubFunds = useCallback(async (fanClubId: FanClubId, amount: string) => {
    return executeTransaction(
      async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        return await withdrawFromFanClub(fanClubId, amount, signer);
      },
      `Successfully withdrew ${amount} CHZ from fan club "${fanClubId}"!`
    );
  }, [executeTransaction]);

  // Marketplace functions (for payment processing)
  const createFanClubMarketplace = useCallback(async (fanClubId: FanClubId, tokenAddress: string) => {
    return executeTransaction(
      async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        return await createMarketplace(fanClubId, tokenAddress, signer);
      },
      `Marketplace created for fan club "${fanClubId}"!`
    );
  }, [executeTransaction]);



  const getFanClubTokenBalance = useCallback(async (fanClubId: FanClubId, tokenAddress: string) => {
    try {
      if (!window.ethereum) return "0";
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      return await getFanTokenBalance(fanClubId, tokenAddress, signer);
    } catch (error) {
      console.error("Failed to get fan token balance:", error);
      return "0";
    }
  }, []);

  const depositTokensToFanClub = useCallback(async (fanClubId: FanClubId, tokenAddress: string, amount: string) => {
    return executeTransaction(
      async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        return await depositFanTokens(fanClubId, tokenAddress, amount, signer);
      },
      `Successfully deposited ${amount} tokens to fan club!`
    );
  }, [executeTransaction]);

  const withdrawTokensFromFanClub = useCallback(async (fanClubId: FanClubId, tokenAddress: string, amount: string) => {
    return executeTransaction(
      async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        return await withdrawFanTokens(fanClubId, tokenAddress, amount, signer);
      },
      `Successfully withdrew ${amount} tokens from fan club!`
    );
  }, [executeTransaction]);

  const rewardTokensToUser = useCallback(async (fanClubId: FanClubId, tokenAddress: string, recipient: string, amount: string) => {
    return executeTransaction(
      async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        return await rewardFanTokens(fanClubId, tokenAddress, recipient, amount, signer);
      },
      `Successfully rewarded ${amount} tokens to user!`
    );
  }, [executeTransaction]);

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
      async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        return await calculateReputation(userAddress, reputationData, signer);
      },
      "Reputation updated successfully!"
    );
  }, [executeTransaction]);

  // Utility functions
  const formatUserAddress = useCallback((address: string) => {
    return formatAddress(address);
  }, []);

  const formatTokenAmount = useCallback((amount: string | number) => {
    return formatEther(amount);
  }, []);

  // Wallet functions are provided by useWeb3Operations

  return {
    // State
    ...state,
    transactionState,
    
    // Network functions
    switchNetwork,
    
    // Fan Club functions
    getAllFanClubIds: getAllFanClubIdsList,
    getFanClub,
    createNewFanClub,
    joinExistingFanClub,
    leaveExistingFanClub,
    updateFanClubJoinPrice,
    withdrawFanClubFunds,
    
    // Marketplace functions
    createFanClubMarketplace,
    getFanClubTokenBalance,
    depositTokensToFanClub,
    withdrawTokensFromFanClub,
    rewardTokensToUser,
    
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