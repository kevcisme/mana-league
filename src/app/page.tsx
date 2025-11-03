import { Calendar, Trophy, Users, TrendingUp } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import { getScheduleGames } from "@/lib/schedule-data";
import { getAllScores } from "@/lib/scores-data";

export default async function HomePage() {
  // Get schedule games (will use server-side CSV if available)
  const scheduleGames = await getScheduleGames();
  const realScores = await getAllScores();
  
  // Get upcoming games (not completed)
  const upcomingGames = scheduleGames
    .filter(game => game.status !== "completed")
    .slice(0, 3);

  // Get recent game results (use real scores if available)
  const recentGames = realScores.length > 0 
    ? realScores.slice(-3).reverse().map((score, index) => ({
        team1: score.team1,
        team2: score.team2,
        score1: score.score1,
        score2: score.score2,
        date: new Date(score.date.split('/').reverse().join('-')).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }))
    : [
        { team1: "Thunder Bolts", team2: "Lightning Strikes", score1: 3, score2: 2, date: "Dec 15" },
        { team1: "Fire Dragons", team2: "Ice Wolves", score1: 1, score2: 4, date: "Dec 14" },
        { team1: "Storm Eagles", team2: "Wind Runners", score1: 2, score2: 2, date: "Dec 13" },
      ];

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
          Mana on the court.
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
            <div className="text-3xl font-display font-bold text-primary">7</div>
            <p className="text-xs text-muted-foreground font-medium">
              2025 season
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-md hover:shadow-lg bg-card/80 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-display font-bold tracking-wide">TOTAL GAMES</CardTitle>
            <Trophy className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-primary">{scheduleGames.length}</div>
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
            <div className="text-3xl font-display font-bold text-primary">
              {scheduleGames.filter(g => g.status !== "completed").length}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Games remaining
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-md hover:shadow-lg bg-card/80 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-display font-bold tracking-wide">COMPLETED</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-primary">
              {scheduleGames.filter(g => g.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Games played
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
            {recentGames.map((game, index) => (
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
            {upcomingGames.map((game) => {
              // Parse YYYY-MM-DD and create date in local timezone
              const [year, month, day] = game.date.split('-').map(Number);
              const gameDate = new Date(year, month - 1, day);
              const dateStr = gameDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const [hours, minutes] = game.time.split(':');
              const hour12 = parseInt(hours) > 12 ? parseInt(hours) - 12 : parseInt(hours);
              const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
              const timeStr = `${hour12}:${minutes} ${ampm}`;
              
              return (
                <div key={game.id} className="p-4 rounded-lg border-2 border-primary/10 hover:border-primary/30 transition-colors space-y-2 bg-card/50">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-sm">{game.team1}</span>
                    <span className="text-sm font-bold text-primary">VS</span>
                    <span className="font-display font-semibold text-sm">{game.team2}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                    <span>{dateStr} • {timeStr}</span>
                    <span className="font-display">{game.location}</span>
                  </div>
                </div>
              );
            })}
            <Button variant="outline" className="w-full font-display font-bold border-2 hover:bg-primary hover:text-primary-foreground" asChild>
              <Link href="/schedule">VIEW FULL SCHEDULE</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}