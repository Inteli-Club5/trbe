const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '/api' 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'); 

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Don't load token during SSR
    if (typeof window !== 'undefined') {
      this.loadToken();
    }
  }

  private loadToken() {
    try {
      if (typeof window !== 'undefined') {
        this.token = localStorage.getItem('auth_token');
      }
    } catch (error) {
      // Ignore localStorage errors during SSR
      this.token = null;
    }
  }

  private setToken(token: string) {
    this.token = token;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }
    } catch (error) {
      // Ignore localStorage errors during SSR
    }
  }

  private clearToken() {
    this.token = null;
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      // Ignore localStorage errors during SSR
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        throw new Error('Authentication required');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request<{ success: boolean; data: { user: any; token: string } }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setToken(response.data.token);
    return {
      user: response.data.user,
      token: response.data.token
    };
  }

  async signup(userData: any) {
    const response = await this.request<{ success: boolean; data: { user: any; token: string } }>('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    this.setToken(response.data.token);
    return {
      user: response.data.user,
      token: response.data.token
    };
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser() {
    const response = await this.request<{ success: boolean; data: any }>('/auth/me');
    return response;
  }

  async loginWithTwitter(twitterUserId: string) {
    const response = await this.request<{ success: boolean; data: { user: any; token: string } }>('/login/twitter', {
      method: 'POST',
      body: JSON.stringify({ twitterUserId }),
    });
    this.setToken(response.data.token);
    return {
      user: response.data.user,
      token: response.data.token
    };
  }

  // Users
  async getUserProfile(userId?: string) {
    const endpoint = userId ? `/users/${userId}` : '/users/profile';
    return this.request<any>(endpoint);
  }

  async updateUserProfile(data: any) {
    return this.request<any>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserStats(userId?: string) {
    const endpoint = userId ? `/users/${userId}/stats` : '/users/stats';
    return this.request<any>(endpoint);
  }

  // Tasks
  async getTasks(page = 1, limit = 20, filters?: any) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return this.request<any>(`/tasks?${params}`);
  }

  async getUserTasks(page = 1, limit = 20, filters?: any) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return this.request<any>(`/tasks/user/tasks?${params}`);
  }

  async assignTaskToUser(taskId: string) {
    return this.request<any>(`/tasks/${taskId}/start`, {
      method: 'POST',
    });
  }

  async updateTaskProgress(taskId: string, progress: number) {
    return this.request<any>(`/tasks/${taskId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress }),
    });
  }

  async completeTask(taskId: string, data?: any) {
    return this.request<any>(`/tasks/${taskId}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Check-ins
  async createCheckIn(data: any) {
    return this.request<any>('/check-ins', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserCheckIns(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request<any>(`/check-ins/user?${params}`);
  }

  // Badges
  async getBadges(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request<any>(`/badges?${params}`);
  }

  async getUserBadges(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request<any>(`/badges/user?${params}`);
  }

  // Clubs
  async getClubs(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request<any>(`/clubs?${params}`);
  }

  async getClub(clubId: string) {
    return this.request<any>(`/clubs/${clubId}`);
  }

  async followClub(clubId: string) {
    return this.request<any>(`/clubs/${clubId}/follow`, {
      method: 'POST',
    });
  }

  async unfollowClub() {
    return this.request<any>('/clubs/unfollow', {
      method: 'DELETE',
    });
  }

  // Fan Groups
  async getFanGroups(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request<any>(`/fan-groups?${params}`);
  }

  async getFanGroup(fanGroupId: string) {
    return this.request<any>(`/fan-groups/${fanGroupId}`);
  }

  async joinFanGroup(fanGroupId: string) {
    return this.request<any>(`/fan-groups/${fanGroupId}/join`, {
      method: 'POST',
    });
  }

  async leaveFanGroup() {
    return this.request<any>('/fan-groups/leave', {
      method: 'DELETE',
    });
  }

  // Events
  async getEvents(page = 1, limit = 20, filters?: any) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return this.request<any>(`/events?${params}`);
  }

  async getEvent(eventId: string) {
    return this.request<any>(`/events/${eventId}`);
  }

  async getUserEvents(page = 1, limit = 20, filters?: any) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return this.request<any>(`/events/user?${params}`);
  }

  async registerForEvent(eventId: string) {
    return this.request<any>(`/events/${eventId}/register`, {
      method: 'POST',
    });
  }

  async unregisterFromEvent(eventId: string) {
    return this.request<any>(`/events/${eventId}/unregister`, {
      method: 'DELETE',
    });
  }

  // Notifications
  async getNotifications(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request<any>(`/notifications?${params}`);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request<any>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request<any>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async getUnreadCount() {
    return this.request<any>('/notifications/unread/count');
  }

  // Transactions
  async getTransactions(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request<any>(`/transactions?${params}`);
  }

  // Rankings
  async getRankings(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request<any>(`/users/rankings?${params}`);
  }

  // Games
  async getGames(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request<any>(`/games?${params}`);
  }

  async getGame(gameId: string) {
    return this.request<any>(`/games/${gameId}`);
  }

  // Health check
  async healthCheck() {
    return this.request<any>('/health');
  }

  // Football API - Updated to use backend proxy
  async getFootballCompetitions() {
    const response = await this.request<any>('/football/competitions');
    return response.data;
  }

  async getFootballTeamsByCompetition(competitionId: string) {
    const response = await this.request<any>(`/football/competitions/${competitionId}/teams`);
    return response.data;
  }

  async getFootballCompetitionStandings(competitionId: string) {
    const response = await this.request<any>(`/football/competitions/${competitionId}/standings`);
    return response.data;
  }

  async getFootballCompetitionMatches(competitionId: string, options?: { dateFrom?: string; dateTo?: string; status?: string }) {
    const params = new URLSearchParams();
    if (options?.dateFrom) params.append('dateFrom', options.dateFrom);
    if (options?.dateTo) params.append('dateTo', options.dateTo);
    if (options?.status) params.append('status', options.status);
    const response = await this.request<any>(`/football/competitions/${competitionId}/matches?${params.toString()}`);
    return response.data;
  }

  async getFootballTeam(teamId: string) {
    const response = await this.request<any>(`/football/teams/${teamId}`);
    return response.data;
  }

  async getFootballTeamMatches(teamId: string, options?: { dateFrom?: string; dateTo?: string; status?: string }) {
    const params = new URLSearchParams();
    if (options?.dateFrom) params.append('dateFrom', options.dateFrom);
    if (options?.dateTo) params.append('dateTo', options.dateTo);
    if (options?.status) params.append('status', options.status);
    const response = await this.request<any>(`/football/teams/${teamId}/matches?${params.toString()}`);
    return response.data;
  }

  async getFootballTeamUpcomingMatches(teamId: string, limit: number = 5) {
    const response = await this.request<any>(`/football/teams/${teamId}/upcoming-matches?limit=${limit}`);
    return response.data;
  }

  async getFootballTeamRecentMatches(teamId: string, limit: number = 5) {
    const response = await this.request<any>(`/football/teams/${teamId}/recent-matches?limit=${limit}`);
    return response.data;
  }

  async getFootballTeamSearch(query: string) {
    const response = await this.request<any>(`/football/teams/search?name=${encodeURIComponent(query)}`);
    return response.data;
  }

  async getFootballMatch(matchId: string) {
    const response = await this.request<any>(`/football/matches/${matchId}`);
    return response.data;
  }

  async getFootballAreas() {
    const response = await this.request<any>('/football/areas');
    return response.data;
  }

  async getFootballTeamsByArea(areaId: string) {
    const response = await this.request<any>(`/football/areas/${areaId}/teams`);
    return response.data;
  }
}

// Export the class for potential reuse
export { ApiClient };

// Create instances safely for SSR
let apiClientInstance: ApiClient | null = null;
let apiFootballClientInstance: ApiClient | null = null;

function getApiClient(): ApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new ApiClient(API_BASE_URL);
  }
  return apiClientInstance;
}

function getApiFootballClient(): ApiClient {
  if (!apiFootballClientInstance) {
    apiFootballClientInstance = new ApiClient(API_BASE_URL);
  }
  return apiFootballClientInstance;
}

export const apiClient = getApiClient();
export const apiFootballClient = getApiFootballClient();
export default { apiClient, apiFootballClient }; 