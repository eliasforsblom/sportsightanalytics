
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { XGPlot } from "@/components/allsvenskan/XGPlot";
import { XGAPlot } from "@/components/allsvenskan/XGAPlot";
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
      xGA: fixture.xGA,
      goalsConceded: fixture.goalsConceded,
    }));

  // Aggregate data by team (sum xG and goals)
  const aggregatedData = fixtureData.reduce((acc, curr) => {
    const existingTeam = acc.find(item => item.teamId === curr.teamId);
    if (existingTeam) {
      existingTeam.xG += curr.xG;
      existingTeam.goalsScored += curr.goalsScored;
      existingTeam.xGA += curr.xGA;
      existingTeam.goalsConceded += curr.goalsConceded;
    } else {
      acc.push({...curr});
    }
    return acc;
  }, [] as Array<{team: string, teamId: string, xG: number, goalsScored: number, xGA: number, goalsConceded: number}>);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Allsvenskan xG Analysis</h1>
        
        <div className="space-y-8">
          {/* First widget - xG vs Goals Scored */}
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
              <div className="h-[500px] mb-8">
                <XGPlot data={aggregatedData} />
              </div>
            </CardContent>
          </Card>
          
          {/* Second widget - xGA vs Goals Conceded */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>xGA vs. Goals Conceded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] mb-8">
                <XGAPlot data={aggregatedData} />
              </div>
            </CardContent>
          </Card>
          
          {/* Single slider that controls both charts */}
          <Card className="bg-white shadow-sm">
            <CardContent className="py-6">
              <FixtureSlider 
                value={currentFixture} 
                onChange={setCurrentFixture}
                max={30}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
