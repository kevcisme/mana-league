"use client";

import { useState, useEffect } from "react";
import { Trophy, Calendar, MapPin, Star, Filter, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getAllScores } from "@/lib/scores-data";

// Mock data for game recaps
const mockRecaps = [
  {
    id: 1,
    date: "2024-12-15",
    time: "19:00",
    team1: "Thunder Bolts",
    team2: "Lightning Strikes",
    score1: 3,
    score2: 2,
    location: "Field A",
    highlights: [
      "Amazing comeback in the final quarter",
      "John Smith scored the winning goal",
      "Outstanding defensive play by both teams"
    ],
    playerOfTheMatch: "John Smith (Thunder Bolts)",
    attendance: 45,
    weather: "Clear, 72°F"
  },
  {
    id: 2,
    date: "2024-12-14",
    time: "18:30",
    team1: "Fire Dragons",
    team2: "Ice Wolves",
    score1: 1,
    score2: 4,
    location: "Field B",
    highlights: [
      "Ice Wolves dominated from the start",
      "Hat trick by Sarah Johnson",
      "Excellent teamwork and passing"
    ],
    playerOfTheMatch: "Sarah Johnson (Ice Wolves)",
    attendance: 52,
    weather: "Partly cloudy, 68°F"
  },
  {
    id: 3,
    date: "2024-12-13",
    time: "20:00",
    team1: "Storm Eagles",
    team2: "Wind Runners",
    score1: 2,
    score2: 2,
    location: "Field A",
    highlights: [
      "Thrilling draw with late equalizer",
      "Both goalkeepers made crucial saves",
      "End-to-end action throughout"
    ],
    playerOfTheMatch: "Mike Davis (Storm Eagles)",
    attendance: 38,
    weather: "Light rain, 65°F"
  },
  {
    id: 4,
    date: "2024-12-12",
    time: "19:30",
    team1: "Mana Warriors",
    team2: "Cosmic Crusaders",
    score1: 5,
    score2: 1,
    location: "Field C",
    highlights: [
      "Dominant performance by Mana Warriors",
      "Perfect hat trick by Alex Chen",
      "Solid defensive display"
    ],
    playerOfTheMatch: "Alex Chen (Mana Warriors)",
    attendance: 61,
    weather: "Sunny, 75°F"
  },
  {
    id: 5,
    date: "2024-12-11",
    time: "18:00",
    team1: "Solar Flares",
    team2: "Lunar Legends",
    score1: 0,
    score2: 3,
    location: "Field B",
    highlights: [
      "Clean sheet for Lunar Legends",
      "Clinical finishing on the counter",
      "Goalkeeper Emma Wilson with 8 saves"
    ],
    playerOfTheMatch: "Emma Wilson (Lunar Legends)",
    attendance: 43,
    weather: "Overcast, 70°F"
  }
];

const teams = [
  "All Teams",
  "Thunder Bolts",
  "Lightning Strikes",
  "Fire Dragons",
  "Ice Wolves",
  "Storm Eagles",
  "Wind Runners",
  "Mana Warriors",
  "Cosmic Crusaders",
  "Solar Flares",
  "Lunar Legends"
];

export default function RecapsPage() {
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [searchTerm, setSearchTerm] = useState("");
  const [realScores, setRealScores] = useState<any[]>([]);

  // Load real scores on mount
  useEffect(() => {
    const scores = getAllScores();
    setRealScores(scores);
  }, []);

  // Combine mock recaps with real scores
  const combinedRecaps = realScores.length > 0 ? realScores.map((score, index) => ({
    id: index + 1,
    date: score.date,
    time: "19:00", // Default time
    team1: score.team1,
    team2: score.team2,
    score1: score.score1,
    score2: score.score2,
    location: "Mana League Court",
    highlights: [
      `Final score: ${score.team1} ${score.score1} - ${score.score2} ${score.team2}`,
      score.score1 > score.score2 ? `${score.team1} takes the victory!` : `${score.team2} dominates the game!`,
      "Great game by both teams"
    ],
    playerOfTheMatch: score.score1 > score.score2 ? `MVP from ${score.team1}` : `MVP from ${score.team2}`,
    attendance: 45,
    weather: "Clear, 72°F"
  })) : mockRecaps;

  const filteredRecaps = combinedRecaps.filter(recap => {
    const matchesTeam = selectedTeam === "All Teams" || 
      recap.team1.includes(selectedTeam) || 
      recap.team2.includes(selectedTeam);
    
    const matchesSearch = searchTerm === "" ||
      recap.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recap.team2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recap.playerOfTheMatch.toLowerCase().includes(searchTerm.toLowerCase());
    
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
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-primary">GAME RECAPS</h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Relive the excitement with detailed game recaps, highlights, and player performances
        </p>
      </div>

      {/* Filters */}
      <Card className="border-2 border-primary/20 shadow-lg bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-xl tracking-wide">
            <Filter className="h-5 w-5 text-primary" />
            FILTER RECAPS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search teams or players..."
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

      {/* Recaps Feed */}
      <div className="space-y-6">
        {filteredRecaps.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No recaps found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more game recaps.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRecaps.map((recap) => (
            <Card key={recap.id} className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-md hover:shadow-lg bg-card/80 backdrop-blur">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="font-display font-bold bg-primary text-primary-foreground">
                        FINAL
                      </Badge>
                      <span className="text-sm font-display font-medium text-muted-foreground">
                        GAME #{recap.id}
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-display font-bold">
                      {recap.team1} <span className="text-primary">VS</span> {recap.team2}
                    </CardTitle>
                  </div>
                  
                  <div className="text-center lg:text-right">
                    <div className="text-4xl font-display font-bold text-primary mb-1">
                      {recap.score1} - {recap.score2}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {formatDate(recap.date)} • {formatTime(recap.time)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Game Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-display">{recap.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span>{recap.attendance} attendees</span>
                  </div>
                  <div>
                    <span>{recap.weather}</span>
                  </div>
                </div>

                <Separator />

                {/* Player of the Match */}
                <div className="flex items-center gap-3 p-4 bg-primary/10 border-2 border-primary/20 rounded-lg">
                  <Star className="h-6 w-6 text-primary fill-primary" />
                  <div>
                    <div className="font-display font-bold text-sm tracking-wide">PLAYER OF THE MATCH</div>
                    <div className="text-sm font-semibold text-foreground">
                      {recap.playerOfTheMatch}
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-3">
                  <h4 className="font-display font-bold tracking-wide flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    GAME HIGHLIGHTS
                  </h4>
                  <ul className="space-y-2">
                    {recap.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span className="font-medium">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="font-display font-bold border-2 hover:bg-primary hover:text-primary-foreground">
                    VIEW FULL RECAP
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <Card className="border-2 border-primary/20 shadow-lg bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-2xl tracking-wide">RECAP SUMMARY</CardTitle>
          <CardDescription className="font-medium">
            Showing {filteredRecaps.length} of {combinedRecaps.length} game recaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-display font-bold text-primary">{filteredRecaps.length}</div>
              <div className="text-sm font-display font-medium text-muted-foreground">GAMES SHOWN</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-primary">
                {filteredRecaps.reduce((sum, recap) => sum + recap.score1 + recap.score2, 0)}
              </div>
              <div className="text-sm font-display font-medium text-muted-foreground">TOTAL GOALS</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-primary">
                {Math.round(filteredRecaps.reduce((sum, recap) => sum + recap.attendance, 0) / filteredRecaps.length) || 0}
              </div>
              <div className="text-sm font-display font-medium text-muted-foreground">AVG ATTENDANCE</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-primary">
                {new Set(filteredRecaps.flatMap(r => [r.team1, r.team2])).size}
              </div>
              <div className="text-sm font-display font-medium text-muted-foreground">TEAMS FEATURED</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}