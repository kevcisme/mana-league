import { Calendar, Trophy, Users, TrendingUp } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import logo from "@/assets/images/logo.png";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12 md:py-20">
        <div className="flex justify-center mb-8">
          <div className="relative h-48 w-48 md:h-64 md:w-64 animate-in fade-in zoom-in duration-500">
            <Image
              src={logo}
              alt="Mana League Logo"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-primary drop-shadow-lg">
          MANA LEAGUE
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
        <p className="text-xl md:text-2xl font-display font-medium text-secondary max-w-2xl mx-auto">
          ADULT BASKETBALL LEAGUE
        </p>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Fierce competition. Brotherhood. Excellence on the court.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button size="lg" className="font-display font-bold text-lg px-8 shadow-lg hover:shadow-xl" asChild>
            <Link href="/schedule">VIEW SCHEDULE</Link>
          </Button>
          <Button size="lg" variant="outline" className="font-display font-bold text-lg px-8 border-2 hover:bg-primary hover:text-primary-foreground" asChild>
            <Link href="/recaps">GAME RECAPS</Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-md hover:shadow-lg bg-card/80 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-display font-bold tracking-wide">ACTIVE TEAMS</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-primary">12</div>
            <p className="text-xs text-muted-foreground font-medium">
              +2 from last season
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-md hover:shadow-lg bg-card/80 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-display font-bold tracking-wide">GAMES PLAYED</CardTitle>
            <Trophy className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-primary">48</div>
            <p className="text-xs text-muted-foreground font-medium">
              This season
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-md hover:shadow-lg bg-card/80 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-display font-bold tracking-wide">UPCOMING</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-primary">8</div>
            <p className="text-xs text-muted-foreground font-medium">
              Next 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-md hover:shadow-lg bg-card/80 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-display font-bold tracking-wide">PARTICIPATION</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-primary">94%</div>
            <p className="text-xs text-muted-foreground font-medium">
              League activity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-primary/20 shadow-lg bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-2xl tracking-wide">RECENT RESULTS</CardTitle>
            <CardDescription className="font-medium">Latest completed games</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { team1: "Thunder Bolts", team2: "Lightning Strikes", score1: 3, score2: 2, date: "Dec 15" },
              { team1: "Fire Dragons", team2: "Ice Wolves", score1: 1, score2: 4, date: "Dec 14" },
              { team1: "Storm Eagles", team2: "Wind Runners", score1: 2, score2: 2, date: "Dec 13" },
            ].map((game, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border-2 border-primary/10 hover:border-primary/30 transition-colors bg-card/50">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-semibold">{game.team1}</span>
                    <span className="font-display font-bold text-2xl text-primary">{game.score1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold">{game.team2}</span>
                    <span className="font-display font-bold text-2xl text-primary">{game.score2}</span>
                  </div>
                </div>
                <div className="text-sm font-display font-medium text-muted-foreground ml-4">
                  {game.date}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full font-display font-bold border-2 hover:bg-primary hover:text-primary-foreground" asChild>
              <Link href="/recaps">VIEW ALL RECAPS</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 shadow-lg bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-2xl tracking-wide">UPCOMING GAMES</CardTitle>
            <CardDescription className="font-medium">Next scheduled matches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { team1: "Mana Warriors", team2: "Cosmic Crusaders", date: "Dec 18", time: "7:00 PM", location: "Field A" },
              { team1: "Solar Flares", team2: "Lunar Legends", date: "Dec 19", time: "6:30 PM", location: "Field B" },
              { team1: "Galaxy Guardians", team2: "Stellar Strikers", date: "Dec 20", time: "8:00 PM", location: "Field A" },
            ].map((game, index) => (
              <div key={index} className="p-4 rounded-lg border-2 border-primary/10 hover:border-primary/30 transition-colors space-y-2 bg-card/50">
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-sm">{game.team1}</span>
                  <span className="text-sm font-bold text-primary">VS</span>
                  <span className="font-display font-semibold text-sm">{game.team2}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                  <span>{game.date} • {game.time}</span>
                  <span className="font-display">{game.location}</span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full font-display font-bold border-2 hover:bg-primary hover:text-primary-foreground" asChild>
              <Link href="/schedule">VIEW FULL SCHEDULE</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}