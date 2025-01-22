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
        const team = fixture.Team1;
        if (!team) return;

        if (!teamStats.has(team)) {
          teamStats.set(team, {
            points: 0,
            weightedPoints: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            matches: 0
          });
        }

        const stats = teamStats.get(team);
        
        // Only count matches where we have goals recorded
        if (fixture.Goal1 !== null && fixture.Goal2 !== null) {
          stats.goalsFor += parseInt(fixture.Goal1);
          stats.goalsAgainst += fixture.Goal2;
          stats.matches += 1;
        }

        // Add points if available
        if (fixture.Points) {
          stats.points += parseFloat(fixture.Points);
        }

        // Add weighted points if available
        if (fixture.Points_weight) {
          stats.weightedPoints += parseFloat(fixture.Points_weight);
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {fixtures.filter(f => f.Goal1 !== null && f.Goal2 !== null).length}
              </div>
              <p className="text-sm text-gray-500">Played this season</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>League Leader</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{standings[0]?.name || "N/A"}</div>
              <p className="text-sm text-gray-500">
                {standings[0]?.weightedPoints.toFixed(2) || 0} weighted points
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {standings[0]?.goalsFor || "0"}
              </div>
              <p className="text-sm text-gray-500">Leader's total goals</p>
            </CardContent>
          </Card>
        </div>

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