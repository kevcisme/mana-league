import { TrendingUp, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateStandings } from "@/lib/standings-data-supabase";
import { Badge } from "@/components/ui/badge";

export default async function StandingsPage() {
  const standings = await calculateStandings();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-3">
          <Trophy className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-primary">
            STANDINGS
          </h1>
        </div>
        <p className="text-lg text-muted-foreground font-medium">
          Current team rankings for the 2025 season
        </p>
      </div>

      {/* Standings Table */}
      <Card className="border-2 border-primary/20 shadow-lg bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-2xl tracking-wide flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            TEAM RANKINGS
          </CardTitle>
          <CardDescription className="font-medium">
            Ranked by win count and average point differential
          </CardDescription>
        </CardHeader>
        <CardContent>
          {standings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-display">No standings data available yet.</p>
              <p className="text-sm">Standings will appear once games are completed.</p>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-primary/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary hover:bg-secondary">
                    <TableHead className="font-display font-bold text-primary-foreground w-16 text-center">
                      RANK
                    </TableHead>
                    <TableHead className="font-display font-bold text-primary-foreground">
                      TEAM
                    </TableHead>
                    <TableHead className="font-display font-bold text-primary-foreground text-center">
                      W
                    </TableHead>
                    <TableHead className="font-display font-bold text-primary-foreground text-center">
                      L
                    </TableHead>
                    <TableHead className="font-display font-bold text-primary-foreground text-center hidden sm:table-cell">
                      GP
                    </TableHead>
                    <TableHead className="font-display font-bold text-primary-foreground text-center hidden md:table-cell">
                      PF
                    </TableHead>
                    <TableHead className="font-display font-bold text-primary-foreground text-center hidden md:table-cell">
                      PA
                    </TableHead>
                    <TableHead className="font-display font-bold text-primary-foreground text-center">
                      +/-
                    </TableHead>
                    <TableHead className="font-display font-bold text-primary-foreground text-center">
                      AVG +/-
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standings.map((team, index) => {
                    const isTopThree = index < 3;
                    const avgPlusMinus = team.avgPointDifferential.toFixed(1);
                    const avgColor = team.avgPointDifferential > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : team.avgPointDifferential < 0 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-muted-foreground';
                    
                    return (
                      <TableRow 
                        key={team.team}
                        className={isTopThree ? 'bg-primary/5 hover:bg-primary/10' : ''}
                      >
                        <TableCell className="text-center font-display font-bold text-lg">
                          {index === 0 && <Badge className="px-2 py-1">🥇</Badge>}
                          {index === 1 && <Badge variant="secondary" className="px-2 py-1">🥈</Badge>}
                          {index === 2 && <Badge variant="outline" className="px-2 py-1">🥉</Badge>}
                          {index > 2 && <span className="text-muted-foreground">{index + 1}</span>}
                        </TableCell>
                        <TableCell className="font-display font-semibold text-base">
                          {team.team}
                        </TableCell>
                        <TableCell className="text-center font-display font-bold text-lg text-green-600 dark:text-green-400">
                          {team.wins}
                        </TableCell>
                        <TableCell className="text-center font-display font-bold text-lg text-red-600 dark:text-red-400">
                          {team.losses}
                        </TableCell>
                        <TableCell className="text-center font-display hidden sm:table-cell">
                          {team.gamesPlayed}
                        </TableCell>
                        <TableCell className="text-center font-display hidden md:table-cell">
                          {team.pointsFor}
                        </TableCell>
                        <TableCell className="text-center font-display hidden md:table-cell">
                          {team.pointsAgainst}
                        </TableCell>
                        <TableCell className={`text-center font-display font-semibold ${avgColor}`}>
                          {team.pointDifferential > 0 ? '+' : ''}{team.pointDifferential}
                        </TableCell>
                        <TableCell className={`text-center font-display font-bold text-lg ${avgColor}`}>
                          {team.avgPointDifferential > 0 ? '+' : ''}{avgPlusMinus}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      {standings.length > 0 && (
        <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-lg tracking-wide">LEGEND</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-display font-bold">W:</span> Wins
              </div>
              <div>
                <span className="font-display font-bold">L:</span> Losses
              </div>
              <div>
                <span className="font-display font-bold">GP:</span> Games Played
              </div>
              <div>
                <span className="font-display font-bold">PF:</span> Points For
              </div>
              <div>
                <span className="font-display font-bold">PA:</span> Points Against
              </div>
              <div>
                <span className="font-display font-bold">+/-:</span> Point Differential
              </div>
              <div className="col-span-2 md:col-span-3">
                <span className="font-display font-bold">AVG +/-:</span> Average Point Differential per Game
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

