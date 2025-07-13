import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';

interface FootballData<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseFootballApiReturn<T> extends FootballData<T> {
  refetch: () => Promise<void>;
}

// Hook for fetching competitions
export const useFootballCompetitions = (): UseFootballApiReturn<any> => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getFootballCompetitions();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch competitions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for fetching teams by competition
export const useFootballTeamsByCompetition = (competitionId: string): UseFootballApiReturn<any> => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!competitionId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getFootballTeamsByCompetition(competitionId);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  }, [competitionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for fetching competition standings
export const useFootballCompetitionStandings = (competitionId: string): UseFootballApiReturn<any> => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!competitionId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getFootballCompetitionStandings(competitionId);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch standings');
    } finally {
      setLoading(false);
    }
  }, [competitionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for fetching team details
export const useFootballTeam = (teamId: string): UseFootballApiReturn<any> => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getFootballTeam(teamId);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for fetching team matches
export const useFootballTeamMatches = (teamId: string, options?: any): UseFootballApiReturn<any> => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getFootballTeamMatches(teamId, options);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team matches');
    } finally {
      setLoading(false);
    }
  }, [teamId, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for fetching upcoming matches
export const useFootballTeamUpcomingMatches = (teamId: string, limit?: number): UseFootballApiReturn<any> => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getFootballTeamUpcomingMatches(teamId, limit);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch upcoming matches');
    } finally {
      setLoading(false);
    }
  }, [teamId, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for fetching recent matches
export const useFootballTeamRecentMatches = (teamId: string, limit?: number): UseFootballApiReturn<any> => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getFootballTeamRecentMatches(teamId, limit);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent matches');
    } finally {
      setLoading(false);
    }
  }, [teamId, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for fetching team statistics
export const useFootballTeamStats = (teamId: string, competitionId: string): UseFootballApiReturn<any> => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!teamId || !competitionId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getFootballTeamStats(teamId, competitionId);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team statistics');
    } finally {
      setLoading(false);
    }
  }, [teamId, competitionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for searching teams
export const useFootballTeamSearch = (query: string): UseFootballApiReturn<any> => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!query || query.length < 2) {
      setData(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.searchFootballTeams(query);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search teams');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for fetching areas
export const useFootballAreas = (): UseFootballApiReturn<any> => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getFootballAreas();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch areas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for fetching teams by area
export const useFootballTeamsByArea = (areaId: string): UseFootballApiReturn<any> => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!areaId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getFootballTeamsByArea(areaId);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teams by area');
    } finally {
      setLoading(false);
    }
  }, [areaId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}; 