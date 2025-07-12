const axios = require('axios');

class FootballApiService {
  constructor() {
    this.baseURL = 'http://api.football-data.org/v4';
    this.apiKey = 'f9ffa436d0b0438eac77541723b2345f';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'X-Auth-Token': this.apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get all available competitions
   */
  async getCompetitions() {
    try {
      const response = await this.client.get('/competitions');
      return response.data;
    } catch (error) {
      console.error('Error fetching competitions:', error.message);
      throw new Error(`Failed to fetch competitions: ${error.message}`);
    }
  }

  /**
   * Get teams for a specific competition
   */
  async getTeamsByCompetition(competitionId) {
    try {
      const response = await this.client.get(`/competitions/${competitionId}/teams`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching teams for competition ${competitionId}:`, error.message);
      throw new Error(`Failed to fetch teams for competition ${competitionId}: ${error.message}`);
    }
  }

  /**
   * Get a specific team by ID
   */
  async getTeam(teamId) {
    try {
      const response = await this.client.get(`/teams/${teamId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching team ${teamId}:`, error.message);
      throw new Error(`Failed to fetch team ${teamId}: ${error.message}`);
    }
  }

  /**
   * Get matches for a specific team
   */
  async getTeamMatches(teamId, options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit);
      if (options.dateFrom) params.append('dateFrom', options.dateFrom);
      if (options.dateTo) params.append('dateTo', options.dateTo);
      if (options.status) params.append('status', options.status);

      const response = await this.client.get(`/teams/${teamId}/matches?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching matches for team ${teamId}:`, error.message);
      throw new Error(`Failed to fetch matches for team ${teamId}: ${error.message}`);
    }
  }

  /**
   * Get standings for a competition
   */
  async getCompetitionStandings(competitionId) {
    try {
      const response = await this.client.get(`/competitions/${competitionId}/standings`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching standings for competition ${competitionId}:`, error.message);
      throw new Error(`Failed to fetch standings for competition ${competitionId}: ${error.message}`);
    }
  }

  /**
   * Get matches for a competition
   */
  async getCompetitionMatches(competitionId, options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit);
      if (options.dateFrom) params.append('dateFrom', options.dateFrom);
      if (options.dateTo) params.append('dateTo', options.dateTo);
      if (options.status) params.append('status', options.status);
      if (options.stage) params.append('stage', options.stage);
      if (options.season) params.append('season', options.season);

      const response = await this.client.get(`/competitions/${competitionId}/matches?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching matches for competition ${competitionId}:`, error.message);
      throw new Error(`Failed to fetch matches for competition ${competitionId}: ${error.message}`);
    }
  }

  /**
   * Get a specific match by ID
   */
  async getMatch(matchId) {
    try {
      const response = await this.client.get(`/matches/${matchId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching match ${matchId}:`, error.message);
      throw new Error(`Failed to fetch match ${matchId}: ${error.message}`);
    }
  }

  /**
   * Get areas (countries/regions)
   */
  async getAreas() {
    try {
      const response = await this.client.get('/areas');
      return response.data;
    } catch (error) {
      console.error('Error fetching areas:', error.message);
      throw new Error(`Failed to fetch areas: ${error.message}`);
    }
  }

  /**
   * Get teams by area
   */
  async getTeamsByArea(areaId) {
    try {
      const response = await this.client.get(`/areas/${areaId}/teams`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching teams for area ${areaId}:`, error.message);
      throw new Error(`Failed to fetch teams for area ${areaId}: ${error.message}`);
    }
  }

  /**
   * Search for teams by name
   */
  async searchTeams(query) {
    try {
      const response = await this.client.get(`/teams?name=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching teams with query "${query}":`, error.message);
      throw new Error(`Failed to search teams: ${error.message}`);
    }
  }

  /**
   * Get current season for a competition
   */
  async getCurrentSeason(competitionId) {
    try {
      const response = await this.client.get(`/competitions/${competitionId}`);
      return response.data.currentSeason;
    } catch (error) {
      console.error(`Error fetching current season for competition ${competitionId}:`, error.message);
      throw new Error(`Failed to fetch current season: ${error.message}`);
    }
  }

  /**
   * Get upcoming matches for a team
   */
  async getUpcomingMatches(teamId, limit = 10) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await this.client.get(`/teams/${teamId}/matches?dateFrom=${today}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching upcoming matches for team ${teamId}:`, error.message);
      throw new Error(`Failed to fetch upcoming matches: ${error.message}`);
    }
  }

  /**
   * Get recent matches for a team
   */
  async getRecentMatches(teamId, limit = 10) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await this.client.get(`/teams/${teamId}/matches?dateTo=${today}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recent matches for team ${teamId}:`, error.message);
      throw new Error(`Failed to fetch recent matches: ${error.message}`);
    }
  }

  /**
   * Get team statistics for a competition
   */
  async getTeamStats(teamId, competitionId) {
    try {
      const response = await this.client.get(`/teams/${teamId}/matches?competitions=${competitionId}&limit=100`);
      const matches = response.data.matches;
      
      // Calculate basic statistics
      const stats = {
        totalMatches: matches.length,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      };

      matches.forEach(match => {
        const isHome = match.homeTeam.id === parseInt(teamId);
        const homeGoals = match.score.fullTime.home || 0;
        const awayGoals = match.score.fullTime.away || 0;
        
        if (isHome) {
          stats.goalsFor += homeGoals;
          stats.goalsAgainst += awayGoals;
          
          if (homeGoals > awayGoals) {
            stats.wins++;
            stats.points += 3;
          } else if (homeGoals === awayGoals) {
            stats.draws++;
            stats.points += 1;
          } else {
            stats.losses++;
          }
        } else {
          stats.goalsFor += awayGoals;
          stats.goalsAgainst += homeGoals;
          
          if (awayGoals > homeGoals) {
            stats.wins++;
            stats.points += 3;
          } else if (awayGoals === homeGoals) {
            stats.draws++;
            stats.points += 1;
          } else {
            stats.losses++;
          }
        }
      });

      return stats;
    } catch (error) {
      console.error(`Error fetching team stats for team ${teamId} in competition ${competitionId}:`, error.message);
      throw new Error(`Failed to fetch team stats: ${error.message}`);
    }
  }
}

module.exports = new FootballApiService(); 