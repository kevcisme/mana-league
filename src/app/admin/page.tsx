"use client";

import { useState, useEffect } from "react";
import { Upload, FileText, Users, Calendar, Trophy, Download, Plus, Edit, CheckCircle, XCircle, Sparkles } from "lucide-react";
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
import { getGamesWithScores, generateBasicRecap, saveRecapToStorage, getRecapsFromStorage, getAllRecaps } from "@/lib/recaps-data";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [scheduleStats, setScheduleStats] = useState<{ games: number; updated: string | null }>({
    games: 0,
    updated: null
  });
  const [scoresStats, setScoresStats] = useState<{ scores: number; updated: string | null }>({
    scores: 0,
    updated: null
  });
  const [gamesWithScores, setGamesWithScores] = useState<any[]>([]);
  const [existingRecaps, setExistingRecaps] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [recapFormData, setRecapFormData] = useState({
    highlights: '',
    playerOfTheMatch: '',
    attendance: 45,
    weather: 'Clear, 72°F',
    recap: '',
  });
  const [isRecapDialogOpen, setIsRecapDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      // Load schedule stats
      const games = await getScheduleGames();
      setScheduleStats({
        games: games.length,
        updated: new Date().toISOString()
      });

      // Load scores stats
      const scores = await getAllScores();
      setScoresStats({
        scores: scores.length,
        updated: new Date().toISOString()
      });

      // Load games with scores
      const gamesWithScoresData = await getGamesWithScores();
      setGamesWithScores(gamesWithScoresData);
      
      // Load existing recaps
      const recaps = await getRecapsFromStorage();
      setExistingRecaps(recaps);
    }
    
    loadData();
  }, []);

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
      const result = await saveScheduleToStorage(text);

      if (result.success) {
        setUploadStatus(`Successfully uploaded ${result.count} games!`);
        toast({
          title: "Schedule Updated",
          description: `${result.count} games have been added to the schedule.`,
        });
        
        // Refresh the page to show new data
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
      const result = await saveScoresToStorage(text);

      if (result.success) {
        setUploadStatus(`Successfully uploaded ${result.count} game scores!`);
        toast({
          title: "Scores Updated",
          description: `${result.count} game scores have been added.`,
        });
        
        // Refresh the page to show new data
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

  const handleGenerateRecap = async (game: any) => {
    setSelectedGame(game);
    // Pre-fill with auto-generated data
    const autoRecap = await generateBasicRecap(game.id);
    if (autoRecap) {
      setRecapFormData({
        highlights: autoRecap.highlights.join('\n'),
        playerOfTheMatch: autoRecap.playerOfTheMatch,
        attendance: autoRecap.attendance,
        weather: autoRecap.weather,
        recap: autoRecap.recap || '',
      });
    }
    setIsRecapDialogOpen(true);
  };

  const handleEditRecap = (recap: any) => {
    setSelectedGame(recap);
    setRecapFormData({
      highlights: recap.highlights.join('\n'),
      playerOfTheMatch: recap.playerOfTheMatch,
      attendance: recap.attendance,
      weather: recap.weather,
      recap: recap.recap || '',
    });
    setIsRecapDialogOpen(true);
  };

  const handleSaveRecap = async () => {
    if (!selectedGame) return;

    const recap = await generateBasicRecap(selectedGame.id || selectedGame.gameId, {
      highlights: recapFormData.highlights.split('\n').filter(h => h.trim()),
      playerOfTheMatch: recapFormData.playerOfTheMatch,
      attendance: recapFormData.attendance,
      weather: recapFormData.weather,
      recap: recapFormData.recap,
    });

    if (!recap) {
      toast({
        title: "Error",
        description: "Failed to generate recap",
        variant: "destructive",
      });
      return;
    }

    const result = await saveRecapToStorage(recap);
    
    if (result.success) {
      toast({
        title: "Recap Saved",
        description: "Game recap has been saved successfully!",
      });
      
      // Refresh the recaps list
      const recaps = await getRecapsFromStorage();
      setExistingRecaps(recaps);
      
      setIsRecapDialogOpen(false);
      setSelectedGame(null);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to save recap",
        variant: "destructive",
      });
    }
  };

  const handleAutoGenerateAllRecaps = async () => {
    let count = 0;
    const games = await getGamesWithScores();
    const existingRecapGameIds = new Set(existingRecaps.map(r => r.gameId));
    
    for (const game of games) {
      if (!existingRecapGameIds.has(game.id)) {
        const recap = await generateBasicRecap(game.id);
        if (recap) {
          await saveRecapToStorage(recap);
          count++;
        }
      }
    }
    
    if (count > 0) {
      toast({
        title: "Recaps Generated",
        description: `${count} game recap(s) have been auto-generated!`,
      });
      
      // Refresh the recaps list
      const recaps = await getRecapsFromStorage();
      setExistingRecaps(recaps);
    } else {
      toast({
        title: "No New Recaps",
        description: "All games with scores already have recaps.",
      });
    }
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
          <Card className="border-2 border-primary/20 shadow-lg bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-xl tracking-wide">
                <FileText className="h-5 w-5 text-primary" />
                GENERATE GAME RECAPS
              </CardTitle>
              <CardDescription>
                Create and publish game recaps with highlights and statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  className="flex-1 h-16 flex items-center justify-center gap-2"
                  onClick={handleAutoGenerateAllRecaps}
                >
                  <Sparkles className="h-5 w-5" />
                  Auto-Generate All Recaps
                </Button>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {existingRecaps.length} custom recap(s) saved • {gamesWithScores.length} game(s) with scores available
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <h4 className="font-semibold font-display text-lg">Games with Scores</h4>
                {gamesWithScores.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No games with scores yet. Upload scores in the Data Upload tab to generate recaps.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3">
                    {gamesWithScores.map((game) => {
                      const hasCustomRecap = existingRecaps.some(r => r.gameId === game.id);
                      return (
                        <div key={game.id} className="flex items-center justify-between p-4 border-2 rounded-lg hover:border-primary/40 transition-colors">
                          <div>
                            <div className="font-medium font-display">
                              {game.team1} vs {game.team2}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(game.date).toLocaleDateString()} • Score: {game.score1} - {game.score2}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasCustomRecap ? (
                              <Badge className="bg-green-500">Custom Recap</Badge>
                            ) : (
                              <Badge variant="outline">Auto-Generated</Badge>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleGenerateRecap(game)}
                            >
                              {hasCustomRecap ? "Edit" : "Create"} Recap
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {existingRecaps.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold font-display text-lg">Custom Recaps</h4>
                  <div className="space-y-3">
                    {existingRecaps.map((recap) => (
                      <div key={recap.id} className="flex items-center justify-between p-4 border-2 border-primary/20 rounded-lg">
                        <div>
                          <div className="font-medium font-display">
                            {recap.team1} vs {recap.team2}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(recap.date).toLocaleDateString()} • {recap.highlights.length} highlights
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500">Published</Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditRecap(recap)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

      {/* Recap Edit/Create Dialog */}
      <Dialog open={isRecapDialogOpen} onOpenChange={setIsRecapDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {selectedGame ? `${selectedGame.team1} vs ${selectedGame.team2}` : 'Create Recap'}
            </DialogTitle>
            <DialogDescription>
              {selectedGame && `${new Date(selectedGame.date).toLocaleDateString()} • Score: ${selectedGame.score1 || 0} - ${selectedGame.score2 || 0}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="highlights">Highlights (one per line)</Label>
              <Textarea
                id="highlights"
                placeholder="Enter game highlights, one per line..."
                value={recapFormData.highlights}
                onChange={(e) => setRecapFormData({ ...recapFormData, highlights: e.target.value })}
                rows={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="playerOfTheMatch">Player of the Match</Label>
              <Input
                id="playerOfTheMatch"
                placeholder="e.g., John Doe (Team Name)"
                value={recapFormData.playerOfTheMatch}
                onChange={(e) => setRecapFormData({ ...recapFormData, playerOfTheMatch: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="attendance">Attendance</Label>
                <Input
                  id="attendance"
                  type="number"
                  placeholder="45"
                  value={recapFormData.attendance}
                  onChange={(e) => setRecapFormData({ ...recapFormData, attendance: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weather">Weather</Label>
                <Input
                  id="weather"
                  placeholder="Clear, 72°F"
                  value={recapFormData.weather}
                  onChange={(e) => setRecapFormData({ ...recapFormData, weather: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recap">Full Recap (optional)</Label>
              <Textarea
                id="recap"
                placeholder="Write a detailed recap of the game..."
                value={recapFormData.recap}
                onChange={(e) => setRecapFormData({ ...recapFormData, recap: e.target.value })}
                rows={6}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecapDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRecap}>
              Save Recap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}