"use client";

import { useState, useEffect, useCallback } from "react";
import { useBlockchain } from "./use-blockchain";
import { useToast } from "./use-toast";
import { type FanClub, type FanClubId } from "@/lib/contracts";

interface FanClubState {
  fanClubs: Map<FanClubId, FanClub>;
  isLoading: boolean;
  error: string | null;
}

export function useFanClubs() {
  const blockchain = useBlockchain();
  const { toast } = useToast();
  
  const [state, setState] = useState<FanClubState>({
    fanClubs: new Map(),
    isLoading: false,
    error: null,
  });

  // Load fan club data
  const loadFanClub = useCallback(async (fanClubId: FanClubId) => {
    if (!blockchain.isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to view fan clubs",
        variant: "destructive",
      });
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const fanClub = await blockchain.getFanClub(fanClubId);
      
      if (fanClub) {
        setState(prev => ({
          ...prev,
          fanClubs: new Map(prev.fanClubs).set(fanClubId, fanClub),
          isLoading: false,
        }));
        return fanClub;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Fan club not found",
        }));
        return null;
      }
    } catch (error) {
      console.error("Failed to load fan club:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to load fan club data",
      }));
      return null;
    }
  }, [blockchain, toast]);

  // Create a new fan club
  const createFanClub = useCallback(async (fanClubId: FanClubId, price: string) => {
    if (!blockchain.isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a fan club",
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await blockchain.createNewFanClub(fanClubId, price);
      
      if (result?.success) {
        // Reload the fan club data after creation
        await loadFanClub(fanClubId);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to create fan club:", error);
      return false;
    }
  }, [blockchain, loadFanClub, toast]);

  // Join a fan club
  const joinFanClub = useCallback(async (fanClubId: FanClubId, price: string) => {
    if (!blockchain.isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to join a fan club",
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await blockchain.joinExistingFanClub(fanClubId, price);
      
      if (result?.success) {
        // Reload the fan club data after joining
        await loadFanClub(fanClubId);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to join fan club:", error);
      return false;
    }
  }, [blockchain, loadFanClub, toast]);

  // Leave a fan club
  const leaveFanClub = useCallback(async (fanClubId: FanClubId) => {
    if (!blockchain.isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to leave a fan club",
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await blockchain.leaveExistingFanClub(fanClubId);
      
      if (result?.success) {
        // Reload the fan club data after leaving
        await loadFanClub(fanClubId);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to leave fan club:", error);
      return false;
    }
  }, [blockchain, loadFanClub, toast]);

  // Update fan club price (owner only)
  const updatePrice = useCallback(async (fanClubId: FanClubId, newPrice: string) => {
    if (!blockchain.isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to update fan club price",
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await blockchain.updateFanClubJoinPrice(fanClubId, newPrice);
      
      if (result?.success) {
        // Reload the fan club data after price update
        await loadFanClub(fanClubId);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update fan club price:", error);
      return false;
    }
  }, [blockchain, loadFanClub, toast]);

  // Withdraw funds from fan club (owner only)
  const withdrawFunds = useCallback(async (fanClubId: FanClubId, amount: string) => {
    if (!blockchain.isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to withdraw funds",
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await blockchain.withdrawFanClubFunds(fanClubId, amount);
      
      if (result?.success) {
        // Reload the fan club data after withdrawal
        await loadFanClub(fanClubId);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to withdraw funds:", error);
      return false;
    }
  }, [blockchain, loadFanClub, toast]);

  // Get fan club from cache
  const getFanClub = useCallback((fanClubId: FanClubId): FanClub | null => {
    return state.fanClubs.get(fanClubId) || null;
  }, [state.fanClubs]);

  // Get all cached fan clubs
  const getAllFanClubs = useCallback((): FanClub[] => {
    return Array.from(state.fanClubs.values());
  }, [state.fanClubs]);

  // Check if user is member of a fan club
  const isMember = useCallback((fanClubId: FanClubId): boolean => {
    const fanClub = state.fanClubs.get(fanClubId);
    return fanClub?.isMember || false;
  }, [state.fanClubs]);

  // Check if user is owner of a fan club
  const isOwner = useCallback((fanClubId: FanClubId): boolean => {
    const fanClub = state.fanClubs.get(fanClubId);
    return fanClub?.owner === blockchain.address;
  }, [state.fanClubs, blockchain.address]);

  // Clear cache
  const clearCache = useCallback(() => {
    setState(prev => ({
      ...prev,
      fanClubs: new Map(),
    }));
  }, []);

  // Refresh all cached fan clubs
  const refreshAll = useCallback(async () => {
    const fanClubIds = Array.from(state.fanClubs.keys());
    await Promise.all(fanClubIds.map(id => loadFanClub(id)));
  }, [state.fanClubs, loadFanClub]);

  return {
    // State
    fanClubs: state.fanClubs,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    loadFanClub,
    createFanClub,
    joinFanClub,
    leaveFanClub,
    updatePrice,
    withdrawFunds,
    
    // Getters
    getFanClub,
    getAllFanClubs,
    isMember,
    isOwner,
    
    // Cache management
    clearCache,
    refreshAll,
    
    // Blockchain state
    isConnected: blockchain.isConnected,
    isCorrectNetwork: blockchain.isCorrectNetwork,
    transactionState: blockchain.transactionState,
  };
} 