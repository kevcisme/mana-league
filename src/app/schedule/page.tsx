"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getScheduleGames, getTeams } from "@/lib/schedule-data";

export default function SchedulePage() {
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [searchTerm, setSearchTerm] = useState("");
  const [scheduleGames, setScheduleGames] = useState(() => getScheduleGames());
  const [teams, setTeams] = useState(() => getTeams());

  // Refresh schedule data on mount (in case it was updated)
  useEffect(() => {
    setScheduleGames(getScheduleGames());
    setTeams(getTeams());
  }, []);

  const filteredGames = scheduleGames.filter(game => {
    const matchesTeam = selectedTeam === "All Teams" || 
      game.team1.includes(selectedTeam) || 
      game.team2.includes(selectedTeam);
    
    const matchesSearch = searchTerm === "" ||
      game.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.team2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTeam && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    // Parse YYYY-MM-DD and create date in local timezone
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-primary">GAME SCHEDULE</h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Stay up to date with all upcoming games, times, and locations
        </p>
      </div>

      {/* Filters */}
      <Card className="border-2 border-primary/20 shadow-lg bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-xl tracking-wide">
            <Filter className="h-5 w-5 text-primary" />
            FILTER GAMES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search teams or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Games List */}
      <div className="space-y-6">
        {filteredGames.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No games found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more games.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredGames.map((game) => (
            <Card key={game.id} className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-md hover:shadow-lg bg-card/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs font-display font-bold ${
                        game.status === 'playoff' ? 'bg-amber-500 text-white' :
                        game.status === 'completed' ? 'bg-muted text-muted-foreground' :
                        game.status === 'today' ? 'bg-green-500 text-white' :
                        'bg-primary text-primary-foreground'
                      }`}>
                        {game.status === 'playoff' ? 'PLAYOFFS' : game.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-display font-medium text-muted-foreground">
                        {game.gameID ? `GAME #${game.gameID}` : `GAME #${game.id}`}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-lg font-display font-bold">
                        <span>{game.team1}</span>
                        <span className="text-primary text-sm">VS</span>
                        <span>{game.team2}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                    <div className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{formatDate(game.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{formatTime(game.time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <a 
                          href="https://maps.app.goo.gl/j8ZGK5UcNqaDvSQ76"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-display hover:text-primary hover:underline transition-colors"
                        >
                          {game.location}
                        </a>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="font-display font-bold border-2 hover:bg-primary hover:text-primary-foreground">
                      VIEW DETAILS
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      <Card className="border-2 border-primary/20 shadow-lg bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-2xl tracking-wide">SCHEDULE SUMMARY</CardTitle>
          <CardDescription className="font-medium">
            Showing {filteredGames.length} of {scheduleGames.length} scheduled games
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-display font-bold text-primary">{filteredGames.length}</div>
              <div className="text-sm font-display font-medium text-muted-foreground">GAMES SHOWN</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-primary">
                {new Set(filteredGames.flatMap(g => [g.team1, g.team2])).size}
              </div>
              <div className="text-sm font-display font-medium text-muted-foreground">TEAMS INVOLVED</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-primary">
                {new Set(filteredGames.map(g => g.location)).size}
              </div>
              <div className="text-sm font-display font-medium text-muted-foreground">VENUES</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}