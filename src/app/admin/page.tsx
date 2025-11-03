"use client";

import { useState } from "react";
import { Upload, FileText, Users, Calendar, Trophy, Download, Plus, Edit, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AdminLogin } from "@/components/admin-login";
import { saveScheduleToStorage, saveScoresToStorage } from "@/lib/csv-parser";
import { getScheduleGames } from "@/lib/schedule-data";
import { getAllScores } from "@/lib/scores-data";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [scheduleStats, setScheduleStats] = useState<{ games: number; updated: string | null }>(() => {
    if (typeof window !== 'undefined') {
      const games = getScheduleGames();
      const updated = localStorage.getItem('mana-league-schedule-updated');
      return { games: games.length, updated };
    }
    return { games: 0, updated: null };
  });
  const [scoresStats, setScoresStats] = useState<{ scores: number; updated: string | null }>(() => {
    if (typeof window !== 'undefined') {
      const scores = getAllScores();
      const updated = localStorage.getItem('mana-league-scores-updated');
      return { scores: scores.length, updated };
    }
    return { scores: 0, updated: null };
  });
  const { toast } = useToast();

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleScheduleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("Processing schedule...");

    try {
      const text = await file.text();
      const result = saveScheduleToStorage(text);

      if (result.success) {
        setUploadStatus(`Successfully uploaded ${result.count} games!`);
        toast({
          title: "Schedule Updated",
          description: `${result.count} games have been added to the schedule.`,
        });
        
        // Update stats
        setScheduleStats({
          games: result.count,
          updated: new Date().toISOString()
        });
        
        // Refresh the page after a short delay to show the new data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setUploadStatus(`Error: ${result.error || 'Failed to process CSV'}`);
        toast({
          title: "Upload Failed",
          description: result.error || 'Failed to process CSV file',
          variant: "destructive",
        });
      }
    } catch (error) {
      setUploadStatus('Error reading file');
      toast({
        title: "Upload Failed",
        description: "Could not read the CSV file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Clear the file input
      event.target.value = '';
    }
  };

  const handleScoresUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("Processing scores...");

    try {
      const text = await file.text();
      const result = saveScoresToStorage(text);

      if (result.success) {
        setUploadStatus(`Successfully uploaded ${result.count} game scores!`);
        toast({
          title: "Scores Updated",
          description: `${result.count} game scores have been added.`,
        });
        
        // Update stats
        setScoresStats({
          scores: getAllScores().length,
          updated: new Date().toISOString()
        });
        
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setUploadStatus(`Error: ${result.error || 'Failed to process CSV'}`);
        toast({
          title: "Upload Failed",
          description: result.error || 'Failed to process CSV file',
          variant: "destructive",
        });
      }
    } catch (error) {
      setUploadStatus('Error reading file');
      toast({
        title: "Upload Failed",
        description: "Could not read the CSV file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Clear the file input
      event.target.value = '';
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(`Uploading ${type} data...`);

    // Simulate file upload for other types
    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus(`${type} data uploaded successfully!`);
      toast({
        title: "Upload Successful",
        description: `${type} data has been processed and updated.`,
      });
    }, 2000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const downloadScheduleTemplate = () => {
    const template = `gameID,Date,Team 1,Team 2,Time
1,10/11/25,TEAM A,TEAM B,5:30
2,10/11/25,TEAM C,TEAM D,6:10
3,10/18/25,TEAM A,TEAM C,5:30
4,10/18/25,TEAM B,TEAM D,6:10`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedule-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadScoresTemplate = () => {
    const template = `gameID,Date,Team 1,Team 2,Score 1,Score 2
4,10/11/25,BIG TIME,MANA HAWAII,85,72
5,10/11/25,MANAFEST,LOCKDOWN,91,88
8,10/18/25,LOCKDOWN,BIG TIME,78,95`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scores-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const mockStats = {
    totalGames: 48,
    totalTeams: 12,
    totalPlayers: 144,
    pendingRecaps: 3,
    upcomingGames: 8,
    activeSeasons: 1
  };

  const recentUploads = [
    { id: 1, type: "Game Scores", date: "2024-12-15", status: "Success", records: 5 },
    { id: 2, type: "Schedule", date: "2024-12-14", status: "Success", records: 12 },
    { id: 3, type: "Team Roster", date: "2024-12-13", status: "Success", records: 24 },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Logout */}
      <div className="flex justify-between items-start">
        <div className="text-center space-y-4 flex-1">
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-primary">ADMIN DASHBOARD</h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Manage league data, upload game results, and generate recaps
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="font-display font-bold border-2">
          LOGOUT
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalGames}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalTeams}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalPlayers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Recaps</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingRecaps}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Games</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.upcomingGames}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Seasons</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeSeasons}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Admin Tabs */}
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Data Upload</TabsTrigger>
          <TabsTrigger value="recaps">Generate Recaps</TabsTrigger>
          <TabsTrigger value="schedule">Manage Schedule</TabsTrigger>
          <TabsTrigger value="teams">Manage Teams</TabsTrigger>
        </TabsList>

        {/* Data Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 border-primary/20 shadow-lg bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-xl tracking-wide">
                  <Upload className="h-5 w-5 text-primary" />
                  UPLOAD GAME SCORES
                </CardTitle>
                <CardDescription>
                  Upload CSV file with game results and scores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {scoresStats.updated && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Current scores: {scoresStats.scores} games recorded
                      <br />
                      <span className="text-xs text-muted-foreground">
                        Last updated: {new Date(scoresStats.updated).toLocaleString()}
                      </span>
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="scores-upload">CSV File</Label>
                  <Input
                    id="scores-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleScoresUpload}
                    disabled={isUploading}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Expected format: gameID, Date, Team 1, Team 2, Score 1, Score 2
                  <br />
                  Example: 4, 10/11/25, BIG TIME, MANA HAWAII, 85, 72
                  <br />
                  <span className="text-primary font-semibold">Note: gameID must match the schedule gameID</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={downloadScoresTemplate}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 shadow-lg bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-xl tracking-wide">
                  <Calendar className="h-5 w-5 text-primary" />
                  UPLOAD SCHEDULE
                </CardTitle>
                <CardDescription>
                  Upload CSV file with game schedule data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {scheduleStats.updated && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Current schedule: {scheduleStats.games} games
                      <br />
                      <span className="text-xs text-muted-foreground">
                        Last updated: {new Date(scheduleStats.updated).toLocaleString()}
                      </span>
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="schedule-upload">CSV File</Label>
                  <Input
                    id="schedule-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleScheduleUpload}
                    disabled={isUploading}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Expected format: gameID, Date, Team 1, Team 2, Time
                  <br />
                  Example: 4, 10/11/25, BIG TIME, MANA HAWAII, 5:30
                </div>
                {uploadStatus && (
                  <Alert>
                    <AlertDescription>{uploadStatus}</AlertDescription>
                  </Alert>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={downloadScheduleTemplate}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 shadow-lg bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-xl tracking-wide">
                  <Users className="h-5 w-5 text-primary" />
                  UPLOAD TEAM ROSTERS
                </CardTitle>
                <CardDescription>
                  Upload CSV file with team and player information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roster-upload">CSV File</Label>
                  <Input
                    id="roster-upload"
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileUpload(e, "Team Roster")}
                    disabled={isUploading}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Expected format: team_name, player_name, position, jersey_number
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Status</CardTitle>
                <CardDescription>Recent upload activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {uploadStatus && (
                  <Alert>
                    <AlertDescription>{uploadStatus}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-3">
                  {recentUploads.map((upload) => (
                    <div key={upload.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{upload.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {upload.date} • {upload.records} records
                        </div>
                      </div>
                      <Badge variant="secondary">{upload.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Generate Recaps Tab */}
        <TabsContent value="recaps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generate Game Recaps
              </CardTitle>
              <CardDescription>
                Create and publish game recaps with highlights and statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Plus className="h-6 w-6" />
                  <span>Create New Recap</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Edit className="h-6 w-6" />
                  <span>Edit Existing Recap</span>
                </Button>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Pending Recaps</h4>
                {[
                  { game: "Thunder Bolts vs Lightning Strikes", date: "Dec 15", status: "Draft" },
                  { game: "Fire Dragons vs Ice Wolves", date: "Dec 14", status: "Review" },
                  { game: "Storm Eagles vs Wind Runners", date: "Dec 13", status: "Published" },
                ].map((recap, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{recap.game}</div>
                      <div className="text-sm text-muted-foreground">{recap.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={recap.status === "Published" ? "default" : "secondary"}>
                        {recap.status}
                      </Badge>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule Management
              </CardTitle>
              <CardDescription>
                Add, edit, or remove games from the schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Button className="h-16 flex flex-col items-center justify-center space-y-2">
                  <Plus className="h-5 w-5" />
                  <span>Add Game</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                  <Edit className="h-5 w-5" />
                  <span>Edit Schedule</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                  <Download className="h-5 w-5" />
                  <span>Export Schedule</span>
                </Button>
              </div>
              
              <Alert>
                <AlertDescription>
                  Schedule management features allow you to modify game dates, times, and locations. 
                  Changes will be reflected immediately on the public schedule page.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Teams Tab */}
        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Management
              </CardTitle>
              <CardDescription>
                Manage teams, players, and roster information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Button className="h-16 flex flex-col items-center justify-center space-y-2">
                  <Plus className="h-5 w-5" />
                  <span>Add Team</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                  <Edit className="h-5 w-5" />
                  <span>Edit Teams</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                  <Users className="h-5 w-5" />
                  <span>Manage Players</span>
                </Button>
              </div>
              
              <Alert>
                <AlertDescription>
                  Team management includes adding new teams, updating rosters, and managing player information. 
                  All changes will be reflected across schedules and game recaps.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}