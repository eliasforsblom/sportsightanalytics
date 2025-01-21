import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

// Fetch team statistics
const useTeamStats = () => {
  return useQuery({
    queryKey: ["teamStats"],
    queryFn: async () => {
      const { data: matches, error } = await supabase
        .from("matches")
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(name),
          away_team:teams!matches_away_team_id_fkey(name)
        `)
        .order('match_date', { ascending: true });

      if (error) throw error;

      // Process matches to calculate team statistics
      const teamStats = new Map();

      matches.forEach((match) => {
        // Process home team
        const homeTeam = match.home_team.name;
        if (!teamStats.has(homeTeam)) {
          teamStats.set(homeTeam, { wins: 0, losses: 0, draws: 0, goalsFor: 0, goalsAgainst: 0 });
        }
        
        // Process away team
        const awayTeam = match.away_team.name;
        if (!teamStats.has(awayTeam)) {
          teamStats.set(awayTeam, { wins: 0, losses: 0, draws: 0, goalsFor: 0, goalsAgainst: 0 });
        }

        // Update statistics
        const homeStats = teamStats.get(homeTeam);
        const awayStats = teamStats.get(awayTeam);

        if (match.home_goals > match.away_goals) {
          homeStats.wins++;
          awayStats.losses++;
        } else if (match.home_goals < match.away_goals) {
          homeStats.losses++;
          awayStats.wins++;
        } else {
          homeStats.draws++;
          awayStats.draws++;
        }

        homeStats.goalsFor += match.home_goals;
        homeStats.goalsAgainst += match.away_goals;
        awayStats.goalsFor += match.away_goals;
        awayStats.goalsAgainst += match.home_goals;
      });

      return {
        teamStats: Array.from(teamStats.entries()).map(([name, stats]) => ({
          name,
          ...stats,
          goalDifference: stats.goalsFor - stats.goalsAgainst
        })),
        matches
      };
    }
  });
};

const COLORS = ["#4CAF50", "#f44336", "#FF9800", "#2196F3", "#9C27B0", "#607D8B"];

const config = {
  primary: {
    color: "#403E43",
  },
  secondary: {
    color: "#555555",
  },
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

  const { teamStats, matches } = data;

  // Calculate total goals per match day
  const goalsByMatchDay = matches.map(match => ({
    date: format(new Date(match.match_date), 'MMM dd'),
    goals: match.home_goals + match.away_goals,
    match: `${match.home_team.name} ${match.home_goals} - ${match.away_goals} ${match.away_team.name}`
  }));

  // Calculate league standings
  const standings = [...teamStats]
    .sort((a, b) => (b.wins * 3 + b.draws) - (a.wins * 3 + a.draws));

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
              <div className="text-3xl font-bold">{matches.length}</div>
              <p className="text-sm text-gray-500">Played this season</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Average Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(matches.reduce((acc, match) => acc + match.home_goals + match.away_goals, 0) / matches.length).toFixed(1)}
              </div>
              <p className="text-sm text-gray-500">Per match</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>League Leader</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{standings[0].name}</div>
              <p className="text-sm text-gray-500">
                {standings[0].wins * 3 + standings[0].draws} points
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Goals Per Match Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={config}>
                  <LineChart data={goalsByMatchDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow">
                            <p className="text-sm font-medium">{payload[0].payload.match}</p>
                            <p className="text-sm">Total Goals: {payload[0].value}</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Line
                      type="monotone"
                      dataKey="goals"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-primary)" }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={config}>
                  <BarChart 
                    data={teamStats}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="wins" fill="#4CAF50" name="Wins" />
                    <Bar dataKey="draws" fill="#FF9800" name="Draws" />
                    <Bar dataKey="losses" fill="#f44336" name="Losses" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
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
                      <th className="text-center py-2">Won</th>
                      <th className="text-center py-2">Drawn</th>
                      <th className="text-center py-2">Lost</th>
                      <th className="text-center py-2">GF</th>
                      <th className="text-center py-2">GA</th>
                      <th className="text-center py-2">GD</th>
                      <th className="text-center py-2">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team, index) => (
                      <tr key={team.name} className="border-b">
                        <td className="py-2">{index + 1}</td>
                        <td className="py-2">{team.name}</td>
                        <td className="text-center py-2">{team.wins + team.draws + team.losses}</td>
                        <td className="text-center py-2">{team.wins}</td>
                        <td className="text-center py-2">{team.draws}</td>
                        <td className="text-center py-2">{team.losses}</td>
                        <td className="text-center py-2">{team.goalsFor}</td>
                        <td className="text-center py-2">{team.goalsAgainst}</td>
                        <td className="text-center py-2">{team.goalDifference}</td>
                        <td className="text-center py-2 font-bold">{team.wins * 3 + team.draws}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SportsDashboard;