'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { 
  useFootballCompetitions, 
  useFootballTeamsByCompetition,
  useFootballCompetitionStandings,
  useFootballTeam,
  useFootballTeamUpcomingMatches,
  useFootballTeamRecentMatches,
  useFootballAreas,
  useFootballTeamsByArea
} from '@/hooks/use-football-api';
import { safeSlice } from '@/lib/utils';

export default function FootballDemoPage() {
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  // Removido: const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch data using hooks
  const { data: competitions, loading: competitionsLoading, error: competitionsError } = useFootballCompetitions();
  const { data: teams, loading: teamsLoading, error: teamsError } = useFootballTeamsByCompetition(selectedCompetition);
  const { data: standings, loading: standingsLoading, error: standingsError } = useFootballCompetitionStandings(selectedCompetition);
  const { data: team, loading: teamLoading, error: teamError } = useFootballTeam(selectedTeam);
  const { data: upcomingMatches, loading: upcomingLoading, error: upcomingError } = useFootballTeamUpcomingMatches(selectedTeam, 5);
  const { data: recentMatches, loading: recentLoading, error: recentError } = useFootballTeamRecentMatches(selectedTeam, 5);
  // Removido: const { data: searchResults, loading: searchLoading, error: searchError } = useFootballTeamSearch(searchQuery);
  const { data: areas, loading: areasLoading, error: areasError } = useFootballAreas();
  const { data: areaTeams, loading: areaTeamsLoading, error: areaTeamsError } = useFootballTeamsByArea(selectedArea);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMatchStatus = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return <Badge variant="secondary">Scheduled</Badge>;
      case 'LIVE': return <Badge variant="destructive">Live</Badge>;
      case 'FINISHED': return <Badge variant="default">Finished</Badge>;
      case 'POSTPONED': return <Badge variant="outline">Postponed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/homepage">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Football API Demo</h1>
            <p className="text-muted-foreground">
              Explore real football data from the football-data.org API integration
            </p>
          </div>
        </div>
      </header>

      <Tabs defaultValue="competitions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3"> {/* Alterado de 4 para 3 */}
          <TabsTrigger value="competitions">Competitions</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          {/* Removido: <TabsTrigger value="search">Search</TabsTrigger> */}
          <TabsTrigger value="areas">Areas</TabsTrigger>
        </TabsList>

        <TabsContent value="competitions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitions</CardTitle>
              <CardDescription>Select a competition to view teams and standings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={setSelectedCompetition} value={selectedCompetition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a competition" />
                </SelectTrigger>
                <SelectContent>
                  {competitionsLoading ? (
                    <div className="px-3 py-2 text-muted-foreground">Loading competitions...</div>
                  ) : competitionsError ? (
                    <div className="px-3 py-2 text-destructive">Error loading competitions</div>
                  ) : (
                    competitions?.competitions?.map((comp: any) => (
                      <SelectItem key={comp.id} value={comp.id.toString()}>
                        {comp.name} ({comp.area?.name})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {selectedCompetition && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Teams</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {teamsLoading ? (
                        <div className="space-y-2">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                          ))}
                        </div>
                      ) : teamsError ? (
                        <Alert>
                          <AlertDescription>{teamsError}</AlertDescription>
                        </Alert>
                      ) : (
                        <div className="space-y-2">
                          {teams?.teams?.map((team: any) => (
                            <div key={team.id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center space-x-2">
                                {team.crest && (
                                  <img src={team.crest} alt={team.name} className="w-6 h-6" />
                                )}
                                <span className="font-medium">{team.name}</span>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedTeam(team.id.toString())}
                              >
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Standings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {standingsLoading ? (
                        <div className="space-y-2">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                          ))}
                        </div>
                      ) : standingsError ? (
                        <Alert>
                          <AlertDescription>{standingsError}</AlertDescription>
                        </Alert>
                      ) : (
                        <div className="space-y-2">
                          {safeSlice(standings?.standings?.[0]?.table, 0, 10).map((team: any, index: number) => (
                            <div key={team.team.id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold w-6">{index + 1}</span>
                                <span className="font-medium">{team.team.name}</span>
                              </div>
                              <div className="flex space-x-2 text-sm">
                                <span>P: {team.playedGames}</span>
                                <span>Pts: {team.points}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          {selectedTeam ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {teamLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : teamError ? (
                    <Alert>
                      <AlertDescription>{teamError}</AlertDescription>
                    </Alert>
                  ) : team && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        {team.crest && (
                          <img src={team.crest} alt={team.name} className="w-16 h-16" />
                        )}
                        <div>
                          <h3 className="text-xl font-bold">{team.name}</h3>
                          <p className="text-muted-foreground">{team.area?.name}</p>
                          <p className="text-sm">{team.venue}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{team.founded}</div>
                          <div className="text-sm text-muted-foreground">Founded</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{team.colors}</div>
                          <div className="text-sm text-muted-foreground">Colors</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{team.website}</div>
                          <div className="text-sm text-muted-foreground">Website</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{team.phone}</div>
                          <div className="text-sm text-muted-foreground">Phone</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Matches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingLoading ? (
                      <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : upcomingError ? (
                      <Alert>
                        <AlertDescription>{upcomingError}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-2">
                        {upcomingMatches?.matches?.map((match: any) => (
                          <div key={match.id} className="p-3 border rounded">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">
                                {formatDate(match.utcDate)}
                              </span>
                              {getMatchStatus(match.status)}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{match.homeTeam.name}</span>
                              <span className="text-sm">vs</span>
                              <span className="font-medium">{match.awayTeam.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Matches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentLoading ? (
                      <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : recentError ? (
                      <Alert>
                        <AlertDescription>{recentError}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-2">
                        {recentMatches?.matches?.map((match: any) => (
                          <div key={match.id} className="p-3 border rounded">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">
                                {formatDate(match.utcDate)}
                              </span>
                              {getMatchStatus(match.status)}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{match.homeTeam.name}</span>
                              <span className="font-bold">
                                {match.score?.fullTime?.home || 0} - {match.score?.fullTime?.away || 0}
                              </span>
                              <span className="font-medium">{match.awayTeam.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Select a team from the competitions tab to view details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Remover TabsContent de busca por nome */}
        {/* <TabsContent value="search" className="space-y-4"> ... </TabsContent> */}

        <TabsContent value="areas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Areas & Teams</CardTitle>
              <CardDescription>Browse teams by country/region</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={setSelectedArea} value={selectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an area" />
                </SelectTrigger>
                <SelectContent>
                  {areasLoading ? (
                    <div className="px-3 py-2 text-muted-foreground">Loading areas...</div>
                  ) : areasError ? (
                    <div className="px-3 py-2 text-destructive">Error loading areas</div>
                  ) : (
                    areas?.areas?.map((area: any) => (
                      <SelectItem key={area.id} value={area.id.toString()}>
                        {area.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {selectedArea && (
                <Card>
                  <CardHeader>
                    <CardTitle>Teams in Selected Area</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {areaTeamsLoading ? (
                      <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    ) : areaTeamsError ? (
                      <Alert>
                        <AlertDescription>{areaTeamsError}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-2">
                        {areaTeams?.teams?.map((team: any) => (
                          <div key={team.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-2">
                              {team.crest && (
                                <img src={team.crest} alt={team.name} className="w-6 h-6" />
                              )}
                              <span className="font-medium">{team.name}</span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedTeam(team.id.toString())}
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 