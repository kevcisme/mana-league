import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface GameCardProps {
  game: {
    id: number;
    date: string;
    time: string;
    team1: string;
    team2: string;
    location: string;
    status?: string;
    score1?: number;
    score2?: number;
  };
  showScore?: boolean;
  className?: string;
}

export function GameCard({ game, showScore = false, className = "" }: GameCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
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
    <Card className={`league-card-hover ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {game.status?.toUpperCase() || "SCHEDULED"}
          </Badge>
          {showScore && game.score1 !== undefined && game.score2 !== undefined && (
            <div className="text-lg font-bold">
              {game.score1} - {game.score2}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span className="truncate">{game.team1}</span>
            <span className="text-muted-foreground text-sm px-2">vs</span>
            <span className="truncate">{game.team2}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(game.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatTime(game.time)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{game.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}