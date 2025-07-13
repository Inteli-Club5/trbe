const express = require('express');
const router = express.Router();
const footballApiService = require('../services/footballApiService');

/**
 * @route GET /api/football/competitions
 * @desc Get all available competitions
 * @access Public
 */
router.get('/competitions', async (req, res) => {
  try {
    const competitions = await footballApiService.getCompetitions();
    res.json({
      success: true,
      data: competitions
    });
  } catch (error) {
    console.error('Error in /competitions route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/football/competitions/:id/teams
 * @desc Get teams for a specific competition
 * @access Public
 */
router.get('/competitions/:id/teams', async (req, res) => {
  try {
    const { id } = req.params;
    const teams = await footballApiService.getTeamsByCompetition(id);
    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    console.error(`Error in /competitions/${req.params.id}/teams route:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/football/competitions/:id/standings
 * @desc Get standings for a competition
 * @access Public
 */
router.get('/competitions/:id/standings', async (req, res) => {
  try {
    const { id } = req.params;
    const standings = await footballApiService.getCompetitionStandings(id);
    res.json({
      success: true,
      data: standings
    });
  } catch (error) {
    console.error(`Error in /competitions/${req.params.id}/standings route:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/football/competitions/:id/matches
 * @desc Get matches for a competition
 * @access Public
 */
router.get('/competitions/:id/matches', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit, dateFrom, dateTo, status, stage, season } = req.query;
    
    const options = {};
    if (limit) options.limit = limit;
    if (dateFrom) options.dateFrom = dateFrom;
    if (dateTo) options.dateTo = dateTo;
    if (status) options.status = status;
    if (stage) options.stage = stage;
    if (season) options.season = season;

    const matches = await footballApiService.getCompetitionMatches(id, options);
    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error(`Error in /competitions/${req.params.id}/matches route:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/football/teams/:id
 * @desc Get a specific team by ID
 * @access Public
 */
router.get('/teams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const team = await footballApiService.getTeam(id);
    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error(`Error in /teams/${req.params.id} route:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/football/teams/:id/matches
 * @desc Get matches for a specific team
 * @access Public
 */
router.get('/teams/:id/matches', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit, dateFrom, dateTo, status } = req.query;
    
    const options = {};
    if (limit) options.limit = limit;
    if (dateFrom) options.dateFrom = dateFrom;
    if (dateTo) options.dateTo = dateTo;
    if (status) options.status = status;

    const matches = await footballApiService.getTeamMatches(id, options);
    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error(`Error in /teams/${req.params.id}/matches route:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/football/teams/:id/upcoming-matches
 * @desc Get upcoming matches for a team
 * @access Public
 */
router.get('/teams/:id/upcoming-matches', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit } = req.query;
    const matches = await footballApiService.getUpcomingMatches(id, limit || 10);
    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error(`Error in /teams/${req.params.id}/upcoming-matches route:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/football/teams/:id/recent-matches
 * @desc Get recent matches for a team
 * @access Public
 */
router.get('/teams/:id/recent-matches', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit } = req.query;
    const matches = await footballApiService.getRecentMatches(id, limit || 10);
    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error(`Error in /teams/${req.params.id}/recent-matches route:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/football/teams/:id/stats/:competitionId
 * @desc Get team statistics for a competition
 * @access Public
 */
router.get('/teams/:id/stats/:competitionId', async (req, res) => {
  try {
    const { id, competitionId } = req.params;
    const stats = await footballApiService.getTeamStats(id, competitionId);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error(`Error in /teams/${req.params.id}/stats/${req.params.competitionId} route:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/football/matches/:id
 * @desc Get a specific match by ID
 * @access Public
 */
router.get('/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const match = await footballApiService.getMatch(id);
    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    console.error(`Error in /matches/${req.params.id} route:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/football/areas
 * @desc Get areas (countries/regions)
 * @access Public
 */
router.get('/areas', async (req, res) => {
  try {
    const areas = await footballApiService.getAreas();
    res.json({
      success: true,
      data: areas
    });
  } catch (error) {
    console.error('Error in /areas route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/football/areas/:id/teams
 * @desc Get teams by area
 * @access Public
 */
router.get('/areas/:id/teams', async (req, res) => {
  try {
    const { id } = req.params;
    const teams = await footballApiService.getTeamsByArea(id);
    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    console.error(`Error in /areas/${req.params.id}/teams route:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/football/teams/search
 * @desc Search for teams by name
 * @access Public
 */
router.get('/teams/search', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name parameter is required'
      });
    }
    
    try {
      const teams = await footballApiService.searchTeams(name);
      res.json({
        success: true,
        data: teams
      });
    } catch (error) {
      // Se o erro vier da API externa, repasse o status e mensagem
      if (error.response) {
        return res.status(error.response.status).json({
          success: false,
          error: error.response.data.message || error.message
        });
      }
      // Erro genérico
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  } catch (error) {
    console.error('Error in /teams/search route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/football/search/teams
 * @desc Search for teams by name (legacy endpoint)
 * @access Public
 */
router.get('/search/teams', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required'
      });
    }
    
    const teams = await footballApiService.searchTeams(query);
    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    console.error('Error in /search/teams route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/football/competitions/:id/current-season
 * @desc Get current season for a competition
 * @access Public
 */
router.get('/competitions/:id/current-season', async (req, res) => {
  try {
    const { id } = req.params;
    const season = await footballApiService.getCurrentSeason(id);
    res.json({
      success: true,
      data: season
    });
  } catch (error) {
    console.error(`Error in /competitions/${req.params.id}/current-season route:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 