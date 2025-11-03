"use client";

import { useState } from "react";
import { Calendar, MapPin, Clock, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Mock data for games
const mockGames = [
  {
    id: 1,
    date: "2024-12-18",
    time: "19:00",
    team1: "Mana Warriors",
    team2: "Cosmic Crusaders",
    location: "Field A",
    status: "scheduled"
  },
  {
    id: 2,
    date: "2024-12-19",
    time: "18:30",
    team1: "Solar Flares",
    team2: "Lunar Legends",
    location: "Field B",
    status: "scheduled"
  },
  {
    id: 3,
    date: "2024-12-20",
    time: "20:00",
    team1: "Galaxy Guardians",
    team2: "Stellar Strikers",
    location: "Field A",
    status: "scheduled"
  },
  {
    id: 4,
    date: "2024-12-21",
    time: "17:00",
    team1: "Thunder Bolts",
    team2: "Lightning Strikes",
    location: "Field C",
    status: "scheduled"
  },
  {
    id: 5,
    date: "2024-12-22",
    time: "19:30",
    team1: "Fire Dragons",
    team2: "Ice Wolves",
    location: "Field B",
    status: "scheduled"
  },
  {
    id: 6,
    date: "2024-12-23",
    time: "18:00",
    team1: "Storm Eagles",
    team2: "Wind Runners",
    location: "Field A",
    status: "scheduled"
  }
];

const teams = [
  "All Teams",
  "Mana Warriors",
  "Cosmic Crusaders",
  "Solar Flares",
  "Lunar Legends",
  "Galaxy Guardians",
  "Stellar Strikers",
  "Thunder Bolts",
  "Lightning Strikes",
  "Fire Dragons",
  "Ice Wolves",
  "Storm Eagles",
  "Wind Runners"
];

export default function SchedulePage() {
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGames = mockGames.filter(game => {
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
    const date = new Date(dateString);
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
                      <Badge className="text-xs font-display font-bold bg-primary text-primary-foreground">
                        {game.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-display font-medium text-muted-foreground">
                        GAME #{game.id}
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
                        <span className="font-display">{game.location}</span>
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
            Showing {filteredGames.length} of {mockGames.length} scheduled games
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