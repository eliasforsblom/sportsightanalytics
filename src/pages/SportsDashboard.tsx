import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const useTeamStats = () => {
  return useQuery({
    queryKey: ["teamStats"],
    queryFn: async () => {
      const { data: fixtures, error: fixturesError } = await supabase
        .from("Fixtures")
        .select('*')
        .order('Date', { ascending: true });

      if (fixturesError) throw fixturesError;

      // Process fixtures to calculate team statistics
      const teamStats = new Map();

      fixtures.forEach((fixture) => {
        // Only process Team1 statistics
        if (fixture.Team1) {
          if (!teamStats.has(fixture.Team1)) {
            teamStats.set(fixture.Team1, {
              points: 0,
              weightedPoints: 0,
              goalsFor: 0,
              goalsAgainst: 0,
              matches: 0
            });
          }

          const team1Stats = teamStats.get(fixture.Team1);
          
          // Only count matches where we have goals recorded
          if (fixture.Goal1 !== null && fixture.Goal2 !== null) {
            // Convert goals to numbers before adding
            team1Stats.goalsFor += Number(fixture.Goal1);
            team1Stats.goalsAgainst += Number(fixture.Goal2);
            team1Stats.matches += 1;
          }

          // Add points if available and valid
          if (fixture.Points && !isNaN(parseFloat(fixture.Points))) {
            team1Stats.points += parseFloat(fixture.Points);
          }

          // Add weighted points if available and valid
          if (fixture.Points_weight && !isNaN(parseFloat(fixture.Points_weight))) {
            team1Stats.weightedPoints += parseFloat(fixture.Points_weight);
          }
        }
      });

      return {
        teamStats: Array.from(teamStats.entries()).map(([name, stats]) => ({
          name,
          ...stats,
          goalDifference: stats.goalsFor - stats.goalsAgainst
        })),
        fixtures
      };
    }
  });
};

const SportsDashboard = () => {
  const { data, isLoading } = useTeamStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8">Loading...</h1>
        </div>
      </div>
    );
  }

  const { teamStats, fixtures } = data;

  // Sort teams by weighted points
  const standings = [...teamStats]
    .sort((a, b) => b.weightedPoints - a.weightedPoints);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">League Dashboard</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>League Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Position</th>
                    <th className="text-left py-2">Team</th>
                    <th className="text-center py-2">Played</th>
                    <th className="text-center py-2">GF</th>
                    <th className="text-center py-2">GA</th>
                    <th className="text-center py-2">GD</th>
                    <th className="text-center py-2">Points</th>
                    <th className="text-center py-2">Weighted Points</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, index) => (
                    <tr key={team.name} className="border-b">
                      <td className="py-2">{index + 1}</td>
                      <td className="py-2">{team.name}</td>
                      <td className="text-center py-2">{team.matches}</td>
                      <td className="text-center py-2">{team.goalsFor}</td>
                      <td className="text-center py-2">{team.goalsAgainst}</td>
                      <td className="text-center py-2">{team.goalDifference}</td>
                      <td className="text-center py-2">{Math.round(team.points)}</td>
                      <td className="text-center py-2 font-bold">{team.weightedPoints.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Match Results & Fixtures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fixtures.map((fixture, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <span className="font-semibold">{fixture.Team1}</span>
                    </div>
                    <div className="px-4 font-bold">
                      {fixture.Goal1 !== null && fixture.Goal2 !== null ? (
                        `${fixture.Goal1} - ${fixture.Goal2}`
                      ) : (
                        <span className="text-muted-foreground">Upcoming</span>
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <span className="font-semibold">{fixture.Team2}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground text-center mt-2">
                    {fixture.Date}
                    {fixture.Points && (
                      <span className="ml-2">
                        (Points: {fixture.Points}, Weighted: {fixture.Points_weight})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SportsDashboard;