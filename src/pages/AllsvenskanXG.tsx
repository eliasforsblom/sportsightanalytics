
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { XGPlot } from "@/components/allsvenskan/XGPlot";
import { FixtureSlider } from "@/components/allsvenskan/FixtureSlider";
import { fixtures, teams } from "@/data/allsvenskan-data";

export default function AllsvenskanXG() {
  const [currentFixture, setCurrentFixture] = useState(1);
  
  // Filter data for the selected fixture
  const fixtureData = fixtures
    .filter(fixture => fixture.fixtureNumber <= currentFixture)
    .map(fixture => ({
      team: teams.find(t => t.id === fixture.teamId)?.name || "Unknown",
      teamId: fixture.teamId,
      xG: fixture.xG,
      goalsScored: fixture.goalsScored,
    }));

  // Aggregate data by team (sum xG and goals)
  const aggregatedData = fixtureData.reduce((acc, curr) => {
    const existingTeam = acc.find(item => item.teamId === curr.teamId);
    if (existingTeam) {
      existingTeam.xG += curr.xG;
      existingTeam.goalsScored += curr.goalsScored;
    } else {
      acc.push({...curr});
    }
    return acc;
  }, [] as Array<{team: string, teamId: string, xG: number, goalsScored: number}>);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Allsvenskan xG Analysis</h1>
        
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>xG vs. Goals Scored</span>
              <span className="text-sm font-normal text-muted-foreground">
                Fixture: {currentFixture} of 30
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <FixtureSlider 
                value={currentFixture} 
                onChange={setCurrentFixture}
                max={30}
              />
            </div>
            
            <div className="h-[500px]">
              <XGPlot data={aggregatedData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
