import { useState, useEffect } from 'react'
import apiClient from '@/lib/api'

interface FootballMatch {
  id: number
  utcDate: string
  status: string
  homeTeam: {
    id: number
    name: string
    shortName: string
    tla: string
    crest: string
  }
  awayTeam: {
    id: number
    name: string
    shortName: string
    tla: string
    crest: string
  }
  score: {
    fullTime: {
      home: number | null
      away: number | null
    }
    halfTime: {
      home: number | null
      away: number | null
    }
  }
  venue: string
  competition: {
    id: number
    name: string
    emblem: string
  }
}

interface FootballTeam {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
  founded: number
  venue: string
  website: string
  clubColors: string
  address: string
  phone: string
  email: string
}

interface FootballCompetition {
  id: number
  name: string
  emblem: string
  area: {
    name: string
    code: string
    flag: string
  }
  currentSeason: {
    id: number
    startDate: string
    endDate: string
    currentMatchday: number
    winner: any
  }
}

interface FootballStanding {
  position: number
  team: {
    id: number
    name: string
    shortName: string
    tla: string
    crest: string
  }
  playedGames: number
  form: string
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export function useFootballTeamUpcomingMatches(teamId: string, limit?: number) {
  const [data, setData] = useState<{ matches: FootballMatch[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getFootballTeamUpcomingMatches(teamId, limit)
        if (response.success) {
          setData(response.data)
        } else {
          setError(response.message || 'Failed to fetch upcoming matches')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch upcoming matches')
      } finally {
        setLoading(false)
      }
    }

    if (teamId) {
      fetchData()
    }
  }, [teamId, limit])

  return { data, loading, error }
}

export function useFootballTeamRecentMatches(teamId: string, limit?: number) {
  const [data, setData] = useState<{ matches: FootballMatch[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getFootballTeamRecentMatches(teamId, limit)
        if (response.success) {
          setData(response.data)
        } else {
          setError(response.message || 'Failed to fetch recent matches')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch recent matches')
      } finally {
        setLoading(false)
      }
    }

    if (teamId) {
      fetchData()
    }
  }, [teamId, limit])

  return { data, loading, error }
}

export function useFootballTeam(teamId: string) {
  const [data, setData] = useState<FootballTeam | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getFootballTeam(teamId)
        if (response.success) {
          setData(response.data)
        } else {
          setError(response.message || 'Failed to fetch team data')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch team data')
      } finally {
        setLoading(false)
      }
    }

    if (teamId) {
      fetchData()
    }
  }, [teamId])

  return { data, loading, error }
}

export function useFootballCompetitionStandings(competitionId: string) {
  const [data, setData] = useState<{ standings: FootballStanding[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getFootballCompetitionStandings(competitionId)
        if (response.success) {
          setData(response.data)
        } else {
          setError(response.message || 'Failed to fetch standings')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch standings')
      } finally {
        setLoading(false)
      }
    }

    if (competitionId) {
      fetchData()
    }
  }, [competitionId])

  return { data, loading, error }
}

export function useFootballCompetitions() {
  const [data, setData] = useState<{ competitions: FootballCompetition[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getFootballCompetitions()
        if (response.success) {
          setData(response.data)
        } else {
          setError(response.message || 'Failed to fetch competitions')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch competitions')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useFootballTeamsByCompetition(competitionId: string) {
  const [data, setData] = useState<{ teams: FootballTeam[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getFootballTeamsByCompetition(competitionId)
        if (response.success) {
          setData(response.data)
        } else {
          setError(response.message || 'Failed to fetch teams')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch teams')
      } finally {
        setLoading(false)
      }
    }

    if (competitionId) {
      fetchData()
    }
  }, [competitionId])

  return { data, loading, error }
}

export function useFootballTeamSearch(query: string) {
  const [data, setData] = useState<{ teams: FootballTeam[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!query || query.length < 2) {
        setData(null)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.searchFootballTeams(query)
        if (response.success) {
          setData(response.data)
        } else {
          setError(response.message || 'Failed to search teams')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to search teams')
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchData, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [query])

  return { data, loading, error }
}

export function useFootballAreas() {
  const [data, setData] = useState<{ areas: any[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getFootballAreas()
        if (response.success) {
          setData(response.data)
        } else {
          setError(response.message || 'Failed to fetch areas')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch areas')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useFootballTeamsByArea(areaId: string) {
  const [data, setData] = useState<{ teams: FootballTeam[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getFootballTeamsByArea(areaId)
        if (response.success) {
          setData(response.data)
        } else {
          setError(response.message || 'Failed to fetch teams by area')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch teams by area')
      } finally {
        setLoading(false)
      }
    }

    if (areaId) {
      fetchData()
    }
  }, [areaId])

  return { data, loading, error }
} 