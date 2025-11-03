import { Calendar, Trophy, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Welcome to Mana League
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your premier adult recreational sports league management system. 
          Stay updated with schedules, game results, and league standings.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button size="lg" asChild>
            <Link href="/schedule">View Schedule</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/recaps">Game Recaps</Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last season
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Games Played</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              This season
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Games</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">League Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              Participation rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Game Results</CardTitle>
            <CardDescription>Latest completed games</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { team1: "Thunder Bolts", team2: "Lightning Strikes", score1: 3, score2: 2, date: "Dec 15" },
              { team1: "Fire Dragons", team2: "Ice Wolves", score1: 1, score2: 4, date: "Dec 14" },
              { team1: "Storm Eagles", team2: "Wind Runners", score1: 2, score2: 2, date: "Dec 13" },
            ].map((game, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{game.team1}</span>
                    <span className="font-bold text-lg">{game.score1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{game.team2}</span>
                    <span className="font-bold text-lg">{game.score2}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground ml-4">
                  {game.date}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/recaps">View All Recaps</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Games</CardTitle>
            <CardDescription>Next scheduled matches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { team1: "Mana Warriors", team2: "Cosmic Crusaders", date: "Dec 18", time: "7:00 PM", location: "Field A" },
              { team1: "Solar Flares", team2: "Lunar Legends", date: "Dec 19", time: "6:30 PM", location: "Field B" },
              { team1: "Galaxy Guardians", team2: "Stellar Strikers", date: "Dec 20", time: "8:00 PM", location: "Field A" },
            ].map((game, index) => (
              <div key={index} className="p-3 rounded-lg border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{game.team1}</span>
                  <span className="text-sm text-muted-foreground">vs</span>
                  <span className="font-medium">{game.team2}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{game.date} • {game.time}</span>
                  <span>{game.location}</span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/schedule">View Full Schedule</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}