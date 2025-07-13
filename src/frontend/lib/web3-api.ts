import { ethers } from "ethers";

// Web3 API client for wallet-based authentication
export class Web3ApiClient {
  private baseUrl: string;
  private signer: ethers.Signer | null = null;
  private address: string | null = null;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") {
    this.baseUrl = baseUrl;
  }

  // Set the wallet signer and address
  setWallet(signer: ethers.Signer, address: string) {
    this.signer = signer;
    this.address = address;
  }

  // Generate a signature for authentication
  private async generateSignature(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error("Wallet not connected");
    }
    return await this.signer.signMessage(message);
  }

  // Create authenticated headers with wallet signature
  private async createAuthHeaders(): Promise<Record<string, string>> {
    if (!this.address) {
      throw new Error("Wallet address not available");
    }

    const timestamp = Date.now().toString();
    const message = `Web3 Auth: ${this.address} at ${timestamp}`;
    const signature = await this.generateSignature(message);

    return {
      "Content-Type": "application/json",
      "X-Web3-Address": this.address,
      "X-Web3-Signature": signature,
      "X-Web3-Timestamp": timestamp,
      "X-Web3-Message": message,
    };
  }

  // Generic request method with Web3 authentication
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.signer || !this.address) {
      throw new Error("Wallet not connected");
    }

    const authHeaders = await this.createAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request("/api/health");
  }

  // User routes
  async getUserProfile(): Promise<any> {
    return this.request("/api/user/profile");
  }

  async updateUserProfile(data: any): Promise<any> {
    return this.request("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getUserStats(): Promise<any> {
    return this.request("/api/user/stats");
  }

  // Club routes
  async getClubs(): Promise<any[]> {
    return this.request("/api/club");
  }

  async getClubById(id: string): Promise<any> {
    return this.request(`/api/club/${id}`);
  }

  async createClub(data: any): Promise<any> {
    return this.request("/api/club", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateClub(id: string, data: any): Promise<any> {
    return this.request(`/api/club/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteClub(id: string): Promise<any> {
    return this.request(`/api/club/${id}`, {
      method: "DELETE",
    });
  }

  // Fan Groups routes
  async getFanGroups(): Promise<any[]> {
    return this.request("/api/fan-groups");
  }

  async getFanGroupById(id: string): Promise<any> {
    return this.request(`/api/fan-groups/${id}`);
  }

  async createFanGroup(data: any): Promise<any> {
    return this.request("/api/fan-groups", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async joinFanGroup(id: string): Promise<any> {
    return this.request(`/api/fan-groups/${id}/join`, {
      method: "POST",
    });
  }

  async leaveFanGroup(id: string): Promise<any> {
    return this.request(`/api/fan-groups/${id}/leave`, {
      method: "POST",
    });
  }

  // Events routes
  async getEvents(): Promise<any[]> {
    return this.request("/api/event");
  }

  async getEventById(id: string): Promise<any> {
    return this.request(`/api/event/${id}`);
  }

  async createEvent(data: any): Promise<any> {
    return this.request("/api/event", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: string, data: any): Promise<any> {
    return this.request(`/api/event/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string): Promise<any> {
    return this.request(`/api/event/${id}`, {
      method: "DELETE",
    });
  }

  async joinEvent(id: string): Promise<any> {
    return this.request(`/api/event/${id}/join`, {
      method: "POST",
    });
  }

  async leaveEvent(id: string): Promise<any> {
    return this.request(`/api/event/${id}/leave`, {
      method: "POST",
    });
  }

  // Tasks routes
  async getTasks(): Promise<any[]> {
    return this.request("/api/tasks");
  }

  async getTaskById(id: string): Promise<any> {
    return this.request(`/api/tasks/${id}`);
  }

  async createTask(data: any): Promise<any> {
    return this.request("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: any): Promise<any> {
    return this.request(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string): Promise<any> {
    return this.request(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  }

  async completeTask(id: string): Promise<any> {
    return this.request(`/api/tasks/${id}/complete`, {
      method: "POST",
    });
  }

  // Badges routes
  async getBadges(): Promise<any[]> {
    return this.request("/api/badges");
  }

  async getBadgeById(id: string): Promise<any> {
    return this.request(`/api/badges/${id}`);
  }

  async createBadge(data: any): Promise<any> {
    return this.request("/api/badges", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async awardBadge(badgeId: string, userId: string): Promise<any> {
    return this.request(`/api/badges/${badgeId}/award`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  }

  // Check-ins routes
  async getCheckIns(): Promise<any[]> {
    return this.request("/api/checkin");
  }

  async createCheckIn(data: any): Promise<any> {
    return this.request("/api/checkin", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async verifyCheckIn(id: string): Promise<any> {
    return this.request(`/api/checkin/${id}/verify`, {
      method: "POST",
    });
  }

  // Games routes
  async getGames(): Promise<any[]> {
    return this.request("/api/games");
  }

  async getGameById(id: string): Promise<any> {
    return this.request(`/api/games/${id}`);
  }

  async createGame(data: any): Promise<any> {
    return this.request("/api/games", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateGameScore(id: string, data: any): Promise<any> {
    return this.request(`/api/games/${id}/score`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Notifications routes
  async getNotifications(): Promise<any[]> {
    return this.request("/api/notifications");
  }

  async markNotificationAsRead(id: string): Promise<any> {
    return this.request(`/api/notifications/${id}/read`, {
      method: "POST",
    });
  }

  async markAllNotificationsAsRead(): Promise<any> {
    return this.request("/api/notifications/read-all", {
      method: "POST",
    });
  }

  // Transactions routes
  async getTransactions(): Promise<any[]> {
    return this.request("/api/transactions");
  }

  async createTransaction(data: any): Promise<any> {
    return this.request("/api/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getTransactionById(id: string): Promise<any> {
    return this.request(`/api/transactions/${id}`);
  }

  // Football API routes
  async getFootballCompetitions(): Promise<any[]> {
    return this.request("/api/football/competitions");
  }

  async getFootballTeams(competitionId: string): Promise<any[]> {
    return this.request(`/api/football/competitions/${competitionId}/teams`);
  }

  async getFootballMatches(competitionId: string): Promise<any[]> {
    return this.request(`/api/football/competitions/${competitionId}/matches`);
  }

  // Web3 blockchain routes (these will use the existing blockchain functions)
  async getReputation(userAddress: string): Promise<any> {
    return this.request(`/api/web3/getReputation/${userAddress}`);
  }

  async calculateReputation(data: any): Promise<any> {
    return this.request("/api/web3/reputation", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getFanClubs(): Promise<any> {
    return this.request("/api/web3/fanclubs");
  }

  async createFanClub(fanClubId: string, price: string): Promise<any> {
    return this.request("/api/web3/fanclub/create", {
      method: "POST",
      body: JSON.stringify({ fanClubId, price }),
    });
  }

  async getFanClubPrice(fanClubId: string): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/price`);
  }

  async getFanClubBalance(fanClubId: string): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/balance`);
  }

  async getFanClubOwner(fanClubId: string): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/owner`);
  }

  async getFanClubMembers(fanClubId: string): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/members`);
  }

  async checkFanClubMember(fanClubId: string, user: string): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/checkMember/${user}`);
  }

  async joinFanClub(fanClubId: string): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/join`, {
      method: "POST",
    });
  }

  async leaveFanClub(fanClubId: string): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/leave`, {
      method: "POST",
    });
  }

  async updateFanClubPrice(fanClubId: string, newPrice: string): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/updatePrice`, {
      method: "POST",
      body: JSON.stringify({ newPrice }),
    });
  }

  async withdrawFromFanClub(fanClubId: string, amount: string): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/withdraw`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  }

  // Fan Tokens
  async depositFanTokens(fanClubId: string, tokenAddress: string, amount: string): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/depositFanTokens`, {
      method: "POST",
      body: JSON.stringify({ tokenAddress, amount }),
    });
  }

  async withdrawFanTokens(fanClubId: string, tokenAddress: string, amount: string): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/withdrawFanTokens`, {
      method: "POST",
      body: JSON.stringify({ tokenAddress, amount }),
    });
  }

  async rewardFanTokens(fanClubId: string, tokenAddress: string, recipient: string, amount: string): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/rewardFanToken`, {
      method: "POST",
      body: JSON.stringify({ tokenAddress, recipient, amount }),
    });
  }

  async getFanTokenBalance(fanClubId: string, tokenAddress: string): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/fanTokenBalance/${tokenAddress}`);
  }

  // Fan NFTs
  async depositFanNFT(fanClubId: string, nftAddress: string, tokenId: number): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/depositFanNFT`, {
      method: "POST",
      body: JSON.stringify({ nftAddress, tokenId }),
    });
  }

  async withdrawFanNFT(fanClubId: string, nftAddress: string, tokenId: number): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/withdrawFanNFT`, {
      method: "POST",
      body: JSON.stringify({ nftAddress, tokenId }),
    });
  }

  async rewardFanNFT(fanClubId: string, nftAddress: string, recipient: string, tokenId: number): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/rewardFanNFT`, {
      method: "POST",
      body: JSON.stringify({ nftAddress, recipient, tokenId }),
    });
  }

  async getFanNFT(fanClubId: string, nftAddress: string, tokenId: number): Promise<any> {
    return this.request(`/api/web3/fanclub/${fanClubId}/getFanNFT?nftAddress=${nftAddress}&tokenId=${tokenId}`);
  }

  // NFT Badges
  async deployNFTBadge(name: string, symbol: string, baseURI: string): Promise<any> {
    return this.request("/api/web3/deploy/nftBadge", {
      method: "POST",
      body: JSON.stringify({ name, symbol, baseURI }),
    });
  }

  async mintNFTBadge(contractAddress: string, to: string): Promise<any> {
    return this.request("/api/web3/mint/nftBadge", {
      method: "POST",
      body: JSON.stringify({ contractAddress, to }),
    });
  }

  async approveNFTBadge(contractAddress: string, approvedAddress: string, tokenId: number): Promise<any> {
    return this.request("/api/web3/approve/nftBadge", {
      method: "POST",
      body: JSON.stringify({ contractAddress, approvedAddress, tokenId }),
    });
  }

  // Marketplace
  async createMarketplace(fanClubId: string, tokenAddress: string): Promise<any> {
    return this.request("/api/web3/marketplace/create", {
      method: "POST",
      body: JSON.stringify({ fanClubId, tokenAddress }),
    });
  }

  async listMarketplaceItem(fanClubId: string, nftAddress: string, tokenId: number, price: string): Promise<any> {
    return this.request("/api/web3/marketplace/list", {
      method: "POST",
      body: JSON.stringify({ fanClubId, nftAddress, tokenId, price }),
    });
  }

  async delistMarketplaceItem(fanClubId: string, nftAddress: string, tokenId: number): Promise<any> {
    return this.request("/api/web3/marketplace/delist", {
      method: "POST",
      body: JSON.stringify({ fanClubId, nftAddress, tokenId }),
    });
  }

  async buyMarketplaceItem(fanClubId: string, tokenAddress: string, nftAddress: string, tokenId: number): Promise<any> {
    return this.request("/api/web3/marketplace/buy", {
      method: "POST",
      body: JSON.stringify({ fanClubId, tokenAddress, nftAddress, tokenId }),
    });
  }

  async getMarketplaceItems(fanClubId: string): Promise<any> {
    return this.request(`/api/web3/marketplace/items/${fanClubId}`);
  }
}

// Create a singleton instance
export const web3ApiClient = new Web3ApiClient(); 