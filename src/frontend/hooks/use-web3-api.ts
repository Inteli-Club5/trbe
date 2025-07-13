"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { web3ApiClient } from "@/lib/web3-api";
import { useToast } from "./use-toast";

interface Web3ApiState {
  isConnected: boolean;
  address: string | null;
  isLoading: boolean;
  error: string | null;
}

interface ApiResponse<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useWeb3Api() {
  const { address, isConnected } = useAppKitAccount();
  const appKit = useAppKit();
  const { toast } = useToast();

  const [state, setState] = useState<Web3ApiState>({
    isConnected: false,
    address: null,
    isLoading: false,
    error: null,
  });

  // Initialize Web3 API client when wallet connects
  useEffect(() => {
    const initializeWeb3Api = async () => {
      if (!isConnected || !address) {
        setState(prev => ({
          ...prev,
          isConnected: false,
          address: null,
        }));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Get signer from wallet
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          
          // Set wallet in API client
          web3ApiClient.setWallet(signer, address);
          
          setState(prev => ({
            ...prev,
            isConnected: true,
            address,
            isLoading: false,
          }));
        } else {
          throw new Error("No wallet provider available");
        }
      } catch (error) {
        console.error("Failed to initialize Web3 API:", error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Failed to connect to wallet",
        }));
      }
    };

    initializeWeb3Api();
  }, [isConnected, address]);

  // Generic API call wrapper with error handling
  const apiCall = useCallback(async <T>(
    apiFunction: () => Promise<T>,
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
      const result = await apiFunction();
      
      if (successMessage) {
        toast({
          title: "Success",
          description: successMessage,
        });
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      return result;
    } catch (error: any) {
      console.error("API call error:", error);
      
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

  // Health check
  const healthCheck = useCallback(() => {
    return apiCall(() => web3ApiClient.healthCheck());
  }, [apiCall]);

  // User operations
  const getUserProfile = useCallback(() => {
    return apiCall(() => web3ApiClient.getUserProfile());
  }, [apiCall]);

  const updateUserProfile = useCallback((data: any) => {
    return apiCall(
      () => web3ApiClient.updateUserProfile(data),
      "Profile updated successfully"
    );
  }, [apiCall]);

  const getUserStats = useCallback(() => {
    return apiCall(() => web3ApiClient.getUserStats());
  }, [apiCall]);

  // Club operations
  const getClubs = useCallback(() => {
    return apiCall(() => web3ApiClient.getClubs());
  }, [apiCall]);

  const getClubById = useCallback((id: string) => {
    return apiCall(() => web3ApiClient.getClubById(id));
  }, [apiCall]);

  const createClub = useCallback((data: any) => {
    return apiCall(
      () => web3ApiClient.createClub(data),
      "Club created successfully"
    );
  }, [apiCall]);

  const updateClub = useCallback((id: string, data: any) => {
    return apiCall(
      () => web3ApiClient.updateClub(id, data),
      "Club updated successfully"
    );
  }, [apiCall]);

  const deleteClub = useCallback((id: string) => {
    return apiCall(
      () => web3ApiClient.deleteClub(id),
      "Club deleted successfully"
    );
  }, [apiCall]);

  // Fan Groups operations
  const getFanGroups = useCallback(() => {
    return apiCall(() => web3ApiClient.getFanGroups());
  }, [apiCall]);

  const getFanGroupById = useCallback((id: string) => {
    return apiCall(() => web3ApiClient.getFanGroupById(id));
  }, [apiCall]);

  const createFanGroup = useCallback((data: any) => {
    return apiCall(
      () => web3ApiClient.createFanGroup(data),
      "Fan group created successfully"
    );
  }, [apiCall]);

  const joinFanGroup = useCallback((id: string) => {
    return apiCall(
      () => web3ApiClient.joinFanGroup(id),
      "Joined fan group successfully"
    );
  }, [apiCall]);

  const leaveFanGroup = useCallback((id: string) => {
    return apiCall(
      () => web3ApiClient.leaveFanGroup(id),
      "Left fan group successfully"
    );
  }, [apiCall]);

  // Events operations
  const getEvents = useCallback(() => {
    return apiCall(() => web3ApiClient.getEvents());
  }, [apiCall]);

  const getEventById = useCallback((id: string) => {
    return apiCall(() => web3ApiClient.getEventById(id));
  }, [apiCall]);

  const createEvent = useCallback((data: any) => {
    return apiCall(
      () => web3ApiClient.createEvent(data),
      "Event created successfully"
    );
  }, [apiCall]);

  const updateEvent = useCallback((id: string, data: any) => {
    return apiCall(
      () => web3ApiClient.updateEvent(id, data),
      "Event updated successfully"
    );
  }, [apiCall]);

  const deleteEvent = useCallback((id: string) => {
    return apiCall(
      () => web3ApiClient.deleteEvent(id),
      "Event deleted successfully"
    );
  }, [apiCall]);

  const joinEvent = useCallback((id: string) => {
    return apiCall(
      () => web3ApiClient.joinEvent(id),
      "Joined event successfully"
    );
  }, [apiCall]);

  const leaveEvent = useCallback((id: string) => {
    return apiCall(
      () => web3ApiClient.leaveEvent(id),
      "Left event successfully"
    );
  }, [apiCall]);

  // Tasks operations
  const getTasks = useCallback(() => {
    return apiCall(() => web3ApiClient.getTasks());
  }, [apiCall]);

  const getTaskById = useCallback((id: string) => {
    return apiCall(() => web3ApiClient.getTaskById(id));
  }, [apiCall]);

  const createTask = useCallback((data: any) => {
    return apiCall(
      () => web3ApiClient.createTask(data),
      "Task created successfully"
    );
  }, [apiCall]);

  const updateTask = useCallback((id: string, data: any) => {
    return apiCall(
      () => web3ApiClient.updateTask(id, data),
      "Task updated successfully"
    );
  }, [apiCall]);

  const deleteTask = useCallback((id: string) => {
    return apiCall(
      () => web3ApiClient.deleteTask(id),
      "Task deleted successfully"
    );
  }, [apiCall]);

  const completeTask = useCallback((id: string) => {
    return apiCall(
      () => web3ApiClient.completeTask(id),
      "Task completed successfully"
    );
  }, [apiCall]);

  // Badges operations
  const getBadges = useCallback(() => {
    return apiCall(() => web3ApiClient.getBadges());
  }, [apiCall]);

  const getBadgeById = useCallback((id: string) => {
    return apiCall(() => web3ApiClient.getBadgeById(id));
  }, [apiCall]);

  const createBadge = useCallback((data: any) => {
    return apiCall(
      () => web3ApiClient.createBadge(data),
      "Badge created successfully"
    );
  }, [apiCall]);

  const awardBadge = useCallback((badgeId: string, userId: string) => {
    return apiCall(
      () => web3ApiClient.awardBadge(badgeId, userId),
      "Badge awarded successfully"
    );
  }, [apiCall]);

  // Check-ins operations
  const getCheckIns = useCallback(() => {
    return apiCall(() => web3ApiClient.getCheckIns());
  }, [apiCall]);

  const createCheckIn = useCallback((data: any) => {
    return apiCall(
      () => web3ApiClient.createCheckIn(data),
      "Check-in created successfully"
    );
  }, [apiCall]);

  const verifyCheckIn = useCallback((id: string) => {
    return apiCall(
      () => web3ApiClient.verifyCheckIn(id),
      "Check-in verified successfully"
    );
  }, [apiCall]);

  // Games operations
  const getGames = useCallback(() => {
    return apiCall(() => web3ApiClient.getGames());
  }, [apiCall]);

  const getGameById = useCallback((id: string) => {
    return apiCall(() => web3ApiClient.getGameById(id));
  }, [apiCall]);

  const createGame = useCallback((data: any) => {
    return apiCall(
      () => web3ApiClient.createGame(data),
      "Game created successfully"
    );
  }, [apiCall]);

  const updateGameScore = useCallback((id: string, data: any) => {
    return apiCall(
      () => web3ApiClient.updateGameScore(id, data),
      "Game score updated successfully"
    );
  }, [apiCall]);

  // Notifications operations
  const getNotifications = useCallback(() => {
    return apiCall(() => web3ApiClient.getNotifications());
  }, [apiCall]);

  const markNotificationAsRead = useCallback((id: string) => {
    return apiCall(
      () => web3ApiClient.markNotificationAsRead(id),
      "Notification marked as read"
    );
  }, [apiCall]);

  const markAllNotificationsAsRead = useCallback(() => {
    return apiCall(
      () => web3ApiClient.markAllNotificationsAsRead(),
      "All notifications marked as read"
    );
  }, [apiCall]);

  // Transactions operations
  const getTransactions = useCallback(() => {
    return apiCall(() => web3ApiClient.getTransactions());
  }, [apiCall]);

  const createTransaction = useCallback((data: any) => {
    return apiCall(
      () => web3ApiClient.createTransaction(data),
      "Transaction created successfully"
    );
  }, [apiCall]);

  const getTransactionById = useCallback((id: string) => {
    return apiCall(() => web3ApiClient.getTransactionById(id));
  }, [apiCall]);

  // Football API operations
  const getFootballCompetitions = useCallback(() => {
    return apiCall(() => web3ApiClient.getFootballCompetitions());
  }, [apiCall]);

  const getFootballTeams = useCallback((competitionId: string) => {
    return apiCall(() => web3ApiClient.getFootballTeams(competitionId));
  }, [apiCall]);

  const getFootballMatches = useCallback((competitionId: string) => {
    return apiCall(() => web3ApiClient.getFootballMatches(competitionId));
  }, [apiCall]);

  // Web3 Blockchain operations
  const getReputation = useCallback((userAddress: string) => {
    return apiCall(() => web3ApiClient.getReputation(userAddress));
  }, [apiCall]);

  const calculateReputation = useCallback((data: any) => {
    return apiCall(
      () => web3ApiClient.calculateReputation(data),
      "Reputation calculated successfully"
    );
  }, [apiCall]);

  const getFanClubs = useCallback(() => {
    return apiCall(() => web3ApiClient.getFanClubs());
  }, [apiCall]);

  const createFanClub = useCallback((fanClubId: string, price: string) => {
    return apiCall(
      () => web3ApiClient.createFanClub(fanClubId, price),
      "Fan club created successfully"
    );
  }, [apiCall]);

  const getFanClubPrice = useCallback((fanClubId: string) => {
    return apiCall(() => web3ApiClient.getFanClubPrice(fanClubId));
  }, [apiCall]);

  const getFanClubBalance = useCallback((fanClubId: string) => {
    return apiCall(() => web3ApiClient.getFanClubBalance(fanClubId));
  }, [apiCall]);

  const getFanClubOwner = useCallback((fanClubId: string) => {
    return apiCall(() => web3ApiClient.getFanClubOwner(fanClubId));
  }, [apiCall]);

  const getFanClubMembers = useCallback((fanClubId: string) => {
    return apiCall(() => web3ApiClient.getFanClubMembers(fanClubId));
  }, [apiCall]);

  const checkFanClubMember = useCallback((fanClubId: string, user: string) => {
    return apiCall(() => web3ApiClient.checkFanClubMember(fanClubId, user));
  }, [apiCall]);

  const joinFanClub = useCallback((fanClubId: string) => {
    return apiCall(
      () => web3ApiClient.joinFanClub(fanClubId),
      "Joined fan club successfully"
    );
  }, [apiCall]);

  const leaveFanClub = useCallback((fanClubId: string) => {
    return apiCall(
      () => web3ApiClient.leaveFanClub(fanClubId),
      "Left fan club successfully"
    );
  }, [apiCall]);

  const updateFanClubPrice = useCallback((fanClubId: string, newPrice: string) => {
    return apiCall(
      () => web3ApiClient.updateFanClubPrice(fanClubId, newPrice),
      "Fan club price updated successfully"
    );
  }, [apiCall]);

  const withdrawFromFanClub = useCallback((fanClubId: string, amount: string) => {
    return apiCall(
      () => web3ApiClient.withdrawFromFanClub(fanClubId, amount),
      "Withdrawal successful"
    );
  }, [apiCall]);

  // Fan Tokens operations
  const depositFanTokens = useCallback((fanClubId: string, tokenAddress: string, amount: string) => {
    return apiCall(
      () => web3ApiClient.depositFanTokens(fanClubId, tokenAddress, amount),
      "Tokens deposited successfully"
    );
  }, [apiCall]);

  const withdrawFanTokens = useCallback((fanClubId: string, tokenAddress: string, amount: string) => {
    return apiCall(
      () => web3ApiClient.withdrawFanTokens(fanClubId, tokenAddress, amount),
      "Tokens withdrawn successfully"
    );
  }, [apiCall]);

  const rewardFanTokens = useCallback((fanClubId: string, tokenAddress: string, recipient: string, amount: string) => {
    return apiCall(
      () => web3ApiClient.rewardFanTokens(fanClubId, tokenAddress, recipient, amount),
      "Tokens rewarded successfully"
    );
  }, [apiCall]);

  const getFanTokenBalance = useCallback((fanClubId: string, tokenAddress: string) => {
    return apiCall(() => web3ApiClient.getFanTokenBalance(fanClubId, tokenAddress));
  }, [apiCall]);

  // Fan NFTs operations
  const depositFanNFT = useCallback((fanClubId: string, nftAddress: string, tokenId: number) => {
    return apiCall(
      () => web3ApiClient.depositFanNFT(fanClubId, nftAddress, tokenId),
      "NFT deposited successfully"
    );
  }, [apiCall]);

  const withdrawFanNFT = useCallback((fanClubId: string, nftAddress: string, tokenId: number) => {
    return apiCall(
      () => web3ApiClient.withdrawFanNFT(fanClubId, nftAddress, tokenId),
      "NFT withdrawn successfully"
    );
  }, [apiCall]);

  const rewardFanNFT = useCallback((fanClubId: string, nftAddress: string, recipient: string, tokenId: number) => {
    return apiCall(
      () => web3ApiClient.rewardFanNFT(fanClubId, nftAddress, recipient, tokenId),
      "NFT rewarded successfully"
    );
  }, [apiCall]);

  const getFanNFT = useCallback((fanClubId: string, nftAddress: string, tokenId: number) => {
    return apiCall(() => web3ApiClient.getFanNFT(fanClubId, nftAddress, tokenId));
  }, [apiCall]);

  // NFT Badges operations
  const deployNFTBadge = useCallback((name: string, symbol: string, baseURI: string) => {
    return apiCall(
      () => web3ApiClient.deployNFTBadge(name, symbol, baseURI),
      "NFT Badge deployed successfully"
    );
  }, [apiCall]);

  const mintNFTBadge = useCallback((contractAddress: string, to: string) => {
    return apiCall(
      () => web3ApiClient.mintNFTBadge(contractAddress, to),
      "NFT Badge minted successfully"
    );
  }, [apiCall]);

  const approveNFTBadge = useCallback((contractAddress: string, approvedAddress: string, tokenId: number) => {
    return apiCall(
      () => web3ApiClient.approveNFTBadge(contractAddress, approvedAddress, tokenId),
      "NFT Badge approved successfully"
    );
  }, [apiCall]);

  // Marketplace operations
  const createMarketplace = useCallback((fanClubId: string, tokenAddress: string) => {
    return apiCall(
      () => web3ApiClient.createMarketplace(fanClubId, tokenAddress),
      "Marketplace created successfully"
    );
  }, [apiCall]);

  const listMarketplaceItem = useCallback((fanClubId: string, nftAddress: string, tokenId: number, price: string) => {
    return apiCall(
      () => web3ApiClient.listMarketplaceItem(fanClubId, nftAddress, tokenId, price),
      "NFT listed successfully"
    );
  }, [apiCall]);

  const delistMarketplaceItem = useCallback((fanClubId: string, nftAddress: string, tokenId: number) => {
    return apiCall(
      () => web3ApiClient.delistMarketplaceItem(fanClubId, nftAddress, tokenId),
      "NFT delisted successfully"
    );
  }, [apiCall]);

  const buyMarketplaceItem = useCallback((fanClubId: string, tokenAddress: string, nftAddress: string, tokenId: number) => {
    return apiCall(
      () => web3ApiClient.buyMarketplaceItem(fanClubId, tokenAddress, nftAddress, tokenId),
      "NFT purchased successfully"
    );
  }, [apiCall]);

  const getMarketplaceItems = useCallback((fanClubId: string) => {
    return apiCall(() => web3ApiClient.getMarketplaceItems(fanClubId));
  }, [apiCall]);

  // Wallet operations
  const connectWallet = useCallback(() => {
    if (!isConnected) {
      appKit.open();
    }
  }, [isConnected, appKit]);

  const disconnectWallet = useCallback(() => {
    appKit.close();
  }, [appKit]);

  return {
    // State
    ...state,
    
    // Health check
    healthCheck,
    
    // User operations
    getUserProfile,
    updateUserProfile,
    getUserStats,
    
    // Club operations
    getClubs,
    getClubById,
    createClub,
    updateClub,
    deleteClub,
    
    // Fan Groups operations
    getFanGroups,
    getFanGroupById,
    createFanGroup,
    joinFanGroup,
    leaveFanGroup,
    
    // Events operations
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
    
    // Tasks operations
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    
    // Badges operations
    getBadges,
    getBadgeById,
    createBadge,
    awardBadge,
    
    // Check-ins operations
    getCheckIns,
    createCheckIn,
    verifyCheckIn,
    
    // Games operations
    getGames,
    getGameById,
    createGame,
    updateGameScore,
    
    // Notifications operations
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    
    // Transactions operations
    getTransactions,
    createTransaction,
    getTransactionById,
    
    // Football API operations
    getFootballCompetitions,
    getFootballTeams,
    getFootballMatches,
    
    // Web3 Blockchain operations
    getReputation,
    calculateReputation,
    getFanClubs,
    createFanClub,
    getFanClubPrice,
    getFanClubBalance,
    getFanClubOwner,
    getFanClubMembers,
    checkFanClubMember,
    joinFanClub,
    leaveFanClub,
    updateFanClubPrice,
    withdrawFromFanClub,
    
    // Fan Tokens operations
    depositFanTokens,
    withdrawFanTokens,
    rewardFanTokens,
    getFanTokenBalance,
    
    // Fan NFTs operations
    depositFanNFT,
    withdrawFanNFT,
    rewardFanNFT,
    getFanNFT,
    
    // NFT Badges operations
    deployNFTBadge,
    mintNFTBadge,
    approveNFTBadge,
    
    // Marketplace operations
    createMarketplace,
    listMarketplaceItem,
    delistMarketplaceItem,
    buyMarketplaceItem,
    getMarketplaceItems,
    
    // Wallet operations
    connectWallet,
    disconnectWallet,
  };
} 