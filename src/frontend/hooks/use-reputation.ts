"use client";

import { useState, useEffect, useCallback } from "react";
import { useBlockchain } from "./use-blockchain";
import { useToast } from "./use-toast";
import { type UserAddress, type ReputationData } from "@/lib/contracts";

interface ReputationState {
  reputation: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useReputation(userAddress?: UserAddress) {
  const blockchain = useBlockchain();
  const { toast } = useToast();
  
  const [state, setState] = useState<ReputationState>({
    reputation: 0,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  // Load reputation for the specified user or current user
  const loadReputation = useCallback(async (address?: UserAddress) => {
    const targetAddress = address || userAddress || blockchain.address;
    
    if (!targetAddress) {
      setState(prev => ({
        ...prev,
        error: "No address provided",
      }));
      return 0;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const reputation = await blockchain.getReputation(targetAddress);
      
      setState(prev => ({
        ...prev,
        reputation,
        isLoading: false,
        lastUpdated: new Date(),
      }));
      
      return reputation;
    } catch (error) {
      console.error("Failed to load reputation:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to load reputation data",
      }));
      return 0;
    }
  }, [blockchain, userAddress]);

  // Update reputation with new social media data
  const updateReputation = useCallback(async (
    reputationData: Omit<ReputationData, "user" | "score">,
    address?: UserAddress
  ) => {
    const targetAddress = address || userAddress || blockchain.address;
    
    if (!targetAddress) {
      toast({
        title: "No Address",
        description: "Please provide a valid address",
        variant: "destructive",
      });
      return false;
    }

    if (!blockchain.isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to update reputation",
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await blockchain.updateReputation(targetAddress, reputationData);
      
      if (result?.success) {
        // Reload reputation after update
        await loadReputation(targetAddress);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update reputation:", error);
      return false;
    }
  }, [blockchain, userAddress, loadReputation, toast]);

  // Update reputation based on social media activity
  const updateFromSocialActivity = useCallback(async (
    activity: {
      likes?: number;
      comments?: number;
      retweets?: number;
      hashtags?: number;
      checkEvents?: number;
      gamesId?: number;
      reports?: number;
    },
    address?: UserAddress
  ) => {
    const reputationData = {
      likes: activity.likes || 0,
      comments: activity.comments || 0,
      retweets: activity.retweets || 0,
      hashtags: activity.hashtags || 0,
      checkEvents: activity.checkEvents || 0,
      gamesId: activity.gamesId || 0,
      reports: activity.reports || 0,
    };

    return updateReputation(reputationData, address);
  }, [updateReputation]);

  // Add likes to reputation
  const addLikes = useCallback(async (count: number = 1, address?: UserAddress) => {
    return updateFromSocialActivity({ likes: count }, address);
  }, [updateFromSocialActivity]);

  // Add comments to reputation
  const addComments = useCallback(async (count: number = 1, address?: UserAddress) => {
    return updateFromSocialActivity({ comments: count }, address);
  }, [updateFromSocialActivity]);

  // Add retweets to reputation
  const addRetweets = useCallback(async (count: number = 1, address?: UserAddress) => {
    return updateFromSocialActivity({ retweets: count }, address);
  }, [updateFromSocialActivity]);

  // Add hashtags to reputation
  const addHashtags = useCallback(async (count: number = 1, address?: UserAddress) => {
    return updateFromSocialActivity({ hashtags: count }, address);
  }, [updateFromSocialActivity]);

  // Add check-ins to reputation
  const addCheckIns = useCallback(async (count: number = 1, address?: UserAddress) => {
    return updateFromSocialActivity({ checkEvents: count }, address);
  }, [updateFromSocialActivity]);

  // Add game participation to reputation
  const addGameParticipation = useCallback(async (count: number = 1, address?: UserAddress) => {
    return updateFromSocialActivity({ gamesId: count }, address);
  }, [updateFromSocialActivity]);

  // Add reports (negative impact)
  const addReports = useCallback(async (count: number = 1, address?: UserAddress) => {
    return updateFromSocialActivity({ reports: count }, address);
  }, [updateFromSocialActivity]);

  // Calculate reputation score locally (for preview)
  const calculateReputationScore = useCallback((
    data: Omit<ReputationData, "user" | "score">
  ): number => {
    return (
      data.likes +
      (data.comments * 2) +
      data.retweets +
      (data.hashtags * 3) +
      (data.checkEvents * 3) +
      (data.gamesId * 3) -
      (data.reports * 10)
    );
  }, []);

  // Get reputation level based on score
  const getReputationLevel = useCallback((score: number): string => {
    if (score >= 1000) return "Legendary";
    if (score >= 500) return "Elite";
    if (score >= 200) return "Veteran";
    if (score >= 100) return "Active";
    if (score >= 50) return "Regular";
    if (score >= 10) return "Newcomer";
    return "Rookie";
  }, []);

  // Get reputation badge color
  const getReputationBadgeColor = useCallback((score: number): string => {
    if (score >= 1000) return "bg-purple-500";
    if (score >= 500) return "bg-red-500";
    if (score >= 200) return "bg-orange-500";
    if (score >= 100) return "bg-blue-500";
    if (score >= 50) return "bg-green-500";
    if (score >= 10) return "bg-yellow-500";
    return "bg-gray-500";
  }, []);

  // Load reputation on mount or when address changes
  useEffect(() => {
    const targetAddress = userAddress || blockchain.address;
    if (targetAddress && blockchain.isConnected) {
      loadReputation(targetAddress);
    }
  }, [userAddress, blockchain.address, blockchain.isConnected]);

  return {
    // State
    reputation: state.reputation,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    
    // Actions
    loadReputation,
    updateReputation,
    updateFromSocialActivity,
    
    // Specific activity updates
    addLikes,
    addComments,
    addRetweets,
    addHashtags,
    addCheckIns,
    addGameParticipation,
    addReports,
    
    // Utilities
    calculateReputationScore,
    getReputationLevel,
    getReputationBadgeColor,
    
    // Blockchain state
    isConnected: blockchain.isConnected,
    isCorrectNetwork: blockchain.isCorrectNetwork,
    transactionState: blockchain.transactionState,
  };
} 