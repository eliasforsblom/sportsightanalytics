
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { XGPlot } from "@/components/allsvenskan/XGPlot";
import { XGAPlot } from "@/components/allsvenskan/XGAPlot";
import { FixtureSlider } from "@/components/allsvenskan/FixtureSlider";
import { fixtures, teams, Team } from "@/data/allsvenskan-data";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Construction } from "lucide-react";

// Define the extended Team type that includes Supabase fields
interface TeamWithSupabase extends Team {
  created_at?: string;
  logo_url?: string;
}

export default function AllsvenskanXG() {
  const [xgFixture, setXgFixture] = useState(1);
  const [xgaFixture, setXgaFixture] = useState(1);
  const [teamsData, setTeamsData] = useState<TeamWithSupabase[]>(teams as TeamWithSupabase[]);
  const [showConstruction, setShowConstruction] = useState(true);
  
  // Fetch teams data from Supabase on component mount
  useEffect(() => {
    const fetchTeamsData = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*');
        
        if (error) {
          console.error('Error fetching teams:', error);
          return;
        }
        
        if (data) {
          // Merge Supabase data with local team data to ensure all required fields are present
          const mergedData = teams.map(team => {
            const supabaseTeam = data.find(t => t.id === team.id);
            return { 
              ...team, 
              ...supabaseTeam,
              // Ensure the required fields are preserved
              name: supabaseTeam?.name || team.name,
              shortName: team.shortName,
              color: team.color
            };
          });
          
          setTeamsData(mergedData);
        }
      } catch (error) {
        console.error('Error fetching teams data:', error);
      }
    };
    
    fetchTeamsData();
  }, []);
  
  // Filter data for the xG plot
  const xgFixtureData = fixtures
    .filter(fixture => fixture.fixtureNumber <= xgFixture)
    .map(fixture => ({
      team: teamsData.find(t => t.id === fixture.teamId)?.name || "Unknown",
      teamId: fixture.teamId,
      xG: fixture.xG,
      goalsScored: fixture.goalsScored,
      xGA: fixture.xGA,
      goalsConceded: fixture.goalsConceded,
    }));

  // Filter data for the xGA plot
  const xgaFixtureData = fixtures
    .filter(fixture => fixture.fixtureNumber <= xgaFixture)
    .map(fixture => ({
      team: teamsData.find(t => t.id === fixture.teamId)?.name || "Unknown",
      teamId: fixture.teamId,
      xG: fixture.xG,
      goalsScored: fixture.goalsScored,
      xGA: fixture.xGA,
      goalsConceded: fixture.goalsConceded,
    }));

  // Aggregate data for xG plot
  const aggregatedXgData = teamsData.map(team => {
    const teamFixtures = xgFixtureData.filter(fixture => fixture.teamId === team.id);
    
    if (teamFixtures.length === 0) {
      // If no fixtures for this team, return default values
      return {
        team: team.name,
        teamId: team.id,
        xG: 0,
        goalsScored: 0,
        imageUrl: team.logo_url // Use the logo_url from Supabase if available
      };
    }
    
    // Sum up xG and goalsScored for this team
    return {
      team: team.name,
      teamId: team.id,
      xG: teamFixtures.reduce((sum, fixture) => sum + fixture.xG, 0),
      goalsScored: teamFixtures.reduce((sum, fixture) => sum + fixture.goalsScored, 0),
      imageUrl: team.logo_url // Use the logo_url from Supabase if available
    };
  });
  
  // Aggregate data for xGA plot
  const aggregatedXgaData = teamsData.map(team => {
    const teamFixtures = xgaFixtureData.filter(fixture => fixture.teamId === team.id);
    
    if (teamFixtures.length === 0) {
      // If no fixtures for this team, return default values
      return {
        team: team.name,
        teamId: team.id,
        xGA: 0,
        goalsConceded: 0,
        imageUrl: team.logo_url // Use the logo_url from Supabase if available
      };
    }
    
    // Sum up xGA and goalsConceded for this team
    return {
      team: team.name,
      teamId: team.id,
      xGA: teamFixtures.reduce((sum, fixture) => sum + fixture.xGA, 0),
      goalsConceded: teamFixtures.reduce((sum, fixture) => sum + fixture.goalsConceded, 0),
      imageUrl: team.logo_url // Use the logo_url from Supabase if available
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Allsvenskan xG Analysis</h1>
        
        {showConstruction && (
          <Alert className="mb-6 border-yellow-500 bg-yellow-50">
            <Construction className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="text-yellow-700">Under Construction</AlertTitle>
            <AlertDescription className="text-yellow-600">
              This page is currently under development. Some features may not work as expected.
            </AlertDescription>
            <button 
              onClick={() => setShowConstruction(false)}
              className="absolute top-4 right-4 text-yellow-700 hover:text-yellow-900"
            >
              ×
            </button>
          </Alert>
        )}
        
        <div className="space-y-8">
          {/* First widget - xG vs Goals Scored with its own slider */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>xG vs. Goals Scored</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Fixture: {xgFixture} of 30
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] mb-8">
                <XGPlot data={aggregatedXgData} />
              </div>
              
              <div className="mt-6">
                <FixtureSlider 
                  value={xgFixture} 
                  onChange={setXgFixture}
                  max={30}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Second widget - xGA vs Goals Conceded with its own slider */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>xGA vs. Goals Conceded</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Fixture: {xgaFixture} of 30
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] mb-8">
                <XGAPlot data={aggregatedXgaData} />
              </div>
              
              <div className="mt-6">
                <FixtureSlider 
                  value={xgaFixture} 
                  onChange={setXgaFixture}
                  max={30}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
