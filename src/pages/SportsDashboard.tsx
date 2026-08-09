import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Seo } from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface TeamStat {
  name: string;
  points: number;
  weightedPoints: number;
  goalsFor: number;
  goalsAgainst: number;
  matches: number;
  goalDifference: number;
}

const useTeamStats = () =>
  useQuery({
    queryKey: ["teamStats"],
    queryFn: async () => {
      const { data: fixtures, error } = await supabase
        .from("Fixtures")
        .select("*")
        .order("Date", { ascending: true });

      if (error) throw error;

      const teamStats = new Map<string, Omit<TeamStat, "name" | "goalDifference">>();

      (fixtures ?? []).forEach((fixture) => {
        if (!fixture.Team1) return;

        if (!teamStats.has(fixture.Team1)) {
          teamStats.set(fixture.Team1, {
            points: 0,
            weightedPoints: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            matches: 0,
          });
        }

        const stats = teamStats.get(fixture.Team1)!;

        if (fixture.Goal1 !== null && fixture.Goal2 !== null) {
          stats.goalsFor += Number(fixture.Goal1);
          stats.goalsAgainst += Number(fixture.Goal2);
          stats.matches += 1;
        }

        if (fixture.Points && !isNaN(parseFloat(fixture.Points))) {
          stats.points += parseFloat(fixture.Points);
        }

        if (fixture.Points_weight && !isNaN(parseFloat(fixture.Points_weight))) {
          stats.weightedPoints += parseFloat(fixture.Points_weight);
        }
      });

      return {
        teamStats: Array.from(teamStats.entries()).map(([name, stats]) => ({
          name,
          ...stats,
          goalDifference: stats.goalsFor - stats.goalsAgainst,
        })) as TeamStat[],
        fixtures: fixtures ?? [],
      };
    },
  });

const SportsDashboard = () => {
  const { data, isLoading } = useTeamStats();

  const standings = [...(data?.teamStats ?? [])].sort(
    (a, b) => b.weightedPoints - a.weightedPoints
  );

  return (
    <>
      <Seo
        title="League Dashboard — SportSight Analytics"
        description="Weighted points standings and full fixture results from our league performance model."
        canonicalPath="/sports-dashboard"
      />

      <div className="container py-14 md:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-4">Live model</p>
          <h1 className="text-4xl md:text-5xl">League Dashboard</h1>
          <p className="mt-4 text-muted-foreground">
            Standings ranked by weighted points — a performance-adjusted view of the table
            alongside raw goals and results.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl">Standings &amp; results</h2>

            <Card className="surface-card border-0">
              <CardHeader>
                <CardTitle>League table</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead className="text-center">P</TableHead>
                        <TableHead className="text-center">GF</TableHead>
                        <TableHead className="text-center">GA</TableHead>
                        <TableHead className="text-center">GD</TableHead>
                        <TableHead className="text-center">Pts</TableHead>
                        <TableHead className="text-right">Weighted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {standings.map((team, index) => (
                        <TableRow key={team.name}>
                          <TableCell className="font-display text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium">{team.name}</TableCell>
                          <TableCell className="text-center">{team.matches}</TableCell>
                          <TableCell className="text-center">{team.goalsFor}</TableCell>
                          <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                          <TableCell
                            className={cn(
                              "text-center",
                              team.goalDifference > 0 && "text-primary",
                              team.goalDifference < 0 && "text-destructive"
                            )}
                          >
                            {team.goalDifference > 0 ? "+" : ""}
                            {team.goalDifference}
                          </TableCell>
                          <TableCell className="text-center">{Math.round(team.points)}</TableCell>
                          <TableCell className="text-right font-display font-bold text-primary">
                            {team.weightedPoints.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className="surface-card border-0">
              <CardHeader>
                <CardTitle>Match results &amp; fixtures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {(data?.fixtures ?? []).map((fixture, index) => {
                    const played = fixture.Goal1 !== null && fixture.Goal2 !== null;
                    return (
                      <div
                        key={index}
                        className="rounded-xl border border-border/70 bg-background/40 p-4 transition-colors hover:border-primary/40"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex-1 text-sm font-medium">{fixture.Team1}</span>
                          <span
                            className={cn(
                              "rounded-md px-3 py-1 font-display text-sm font-bold",
                              played
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {played ? `${fixture.Goal1} – ${fixture.Goal2}` : "Upcoming"}
                          </span>
                          <span className="flex-1 text-right text-sm font-medium">
                            {fixture.Team2}
                          </span>
                        </div>
                        <div className="mt-2 text-center text-xs text-muted-foreground">
                          {fixture.Date}
                          {fixture.Points && (
                            <span className="ml-2">
                              (Points: {fixture.Points}, Weighted: {fixture.Points_weight})
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default SportsDashboard;
