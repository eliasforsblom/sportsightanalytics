
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { XGPlot } from "@/components/allsvenskan/XGPlot";
import { XGAPlot } from "@/components/allsvenskan/XGAPlot";
import { FixtureSlider } from "@/components/allsvenskan/FixtureSlider";
import { fixtures, teams } from "@/data/allsvenskan-data";
import { supabase } from "@/integrations/supabase/client";

export default function AllsvenskanXG() {
  const [xgFixture, setXgFixture] = useState(1);
  const [xgaFixture, setXgaFixture] = useState(1);
  const [teamsData, setTeamsData] = useState(teams);
  
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
          // If we have data from Supabase, use it instead of the local data
          // This assumes the Supabase table structure matches our local data
          setTeamsData(data);
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
    
    // Find the team data in Supabase data if available
    const teamData = teamsData.find(t => t.id === team.id);
    
    if (teamFixtures.length === 0) {
      // If no fixtures for this team, return default values
      return {
        team: team.name,
        teamId: team.id,
        xG: 0,
        goalsScored: 0,
        imageUrl: teamData?.logo_url // Add the logo URL if available
      };
    }
    
    // Sum up xG and goalsScored for this team
    return {
      team: team.name,
      teamId: team.id,
      xG: teamFixtures.reduce((sum, fixture) => sum + fixture.xG, 0),
      goalsScored: teamFixtures.reduce((sum, fixture) => sum + fixture.goalsScored, 0),
      imageUrl: teamData?.logo_url // Add the logo URL if available
    };
  });
  
  // Aggregate data for xGA plot
  const aggregatedXgaData = teamsData.map(team => {
    const teamFixtures = xgaFixtureData.filter(fixture => fixture.teamId === team.id);
    
    // Find the team data in Supabase data if available
    const teamData = teamsData.find(t => t.id === team.id);
    
    if (teamFixtures.length === 0) {
      // If no fixtures for this team, return default values
      return {
        team: team.name,
        teamId: team.id,
        xGA: 0,
        goalsConceded: 0,
        imageUrl: teamData?.logo_url // Add the logo URL if available
      };
    }
    
    // Sum up xGA and goalsConceded for this team
    return {
      team: team.name,
      teamId: team.id,
      xGA: teamFixtures.reduce((sum, fixture) => sum + fixture.xGA, 0),
      goalsConceded: teamFixtures.reduce((sum, fixture) => sum + fixture.goalsConceded, 0),
      imageUrl: teamData?.logo_url // Add the logo URL if available
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Allsvenskan xG Analysis</h1>
        
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
