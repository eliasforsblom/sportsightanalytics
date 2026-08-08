import { useState, useEffect } from "react";
import { Construction } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Seo } from "@/components/Seo";
import { XGPlot } from "@/components/allsvenskan/XGPlot";
import { XGAPlot } from "@/components/allsvenskan/XGAPlot";
import { FixtureSlider } from "@/components/allsvenskan/FixtureSlider";
import { fixtures, teams, Team } from "@/data/allsvenskan-data";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface TeamWithSupabase extends Team {
  created_at?: string;
  logo_url?: string;
}

const MAX_FIXTURE = 30;

const useTeams = () =>
  useQuery({
    queryKey: ["allsvenskan-teams"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teams").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });

export default function AllsvenskanXG() {
  const [xgFixture, setXgFixture] = useState(1);
  const [xgaFixture, setXgaFixture] = useState(1);
  const [showConstruction, setShowConstruction] = useState(true);
  const [teamsData, setTeamsData] = useState<TeamWithSupabase[]>(teams as TeamWithSupabase[]);

  const { data: remoteTeams } = useTeams();

  useEffect(() => {
    if (!remoteTeams) return;
    setTeamsData(
      teams.map((team) => {
        const supabaseTeam = remoteTeams.find((t) => t.id === team.id);
        return {
          ...team,
          ...supabaseTeam,
          name: supabaseTeam?.name || team.name,
          shortName: team.shortName,
          color: team.color,
        };
      })
    );
  }, [remoteTeams]);

  const aggregate = (upTo: number) =>
    teamsData.map((team) => {
      const teamFixtures = fixtures.filter(
        (fixture) => fixture.fixtureNumber <= upTo && fixture.teamId === team.id
      );

      return {
        team: team.name,
        teamId: team.id,
        xG: teamFixtures.reduce((sum, f) => sum + f.xG, 0),
        goalsScored: teamFixtures.reduce((sum, f) => sum + f.goalsScored, 0),
        xGA: teamFixtures.reduce((sum, f) => sum + f.xGA, 0),
        goalsConceded: teamFixtures.reduce((sum, f) => sum + f.goalsConceded, 0),
        imageUrl: team.logo_url,
      };
    });

  const aggregatedXgData = aggregate(xgFixture);
  const aggregatedXgaData = aggregate(xgaFixture);

  return (
    <>
      <Seo
        title="Allsvenskan xG Analysis — SportSight Analytics"
        description="Expected goals versus actual output across the Allsvenskan season, matchweek by matchweek."
        canonicalPath="/allsvenskan-xg"
      />

      <div className="container py-14 md:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-4">Allsvenskan</p>
          <h1 className="text-4xl font-bold md:text-5xl">xG Analysis</h1>
          <p className="mt-4 text-muted-foreground">
            Compare expected goals with what actually hit the net — and expected goals against with
            what teams actually conceded. Drag the matchweek slider to move through the season.
          </p>
        </div>

        {showConstruction && (
          <Alert className="relative mb-8 border-primary/40 bg-primary/10">
            <Construction className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary">Under construction</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              This page is still in development — some features may not work as expected.
            </AlertDescription>
            <button
              onClick={() => setShowConstruction(false)}
              aria-label="Dismiss notice"
              className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
            >
              ×
            </button>
          </Alert>
        )}

        <h2 className="mb-6 text-2xl font-bold md:text-3xl">Expected goals charts</h2>

        <div className="space-y-8">
          <Card className="surface-card border-0">
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                <span>xG vs. goals scored</span>
                <span className="font-display text-xs uppercase tracking-[0.18em] text-primary">
                  Matchweek {xgFixture} / {MAX_FIXTURE}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[480px]">
                <XGPlot data={aggregatedXgData} />
              </div>
              <div className="mt-8">
                <FixtureSlider value={xgFixture} onChange={setXgFixture} max={MAX_FIXTURE} />
              </div>
            </CardContent>
          </Card>

          <Card className="surface-card border-0">
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                <span>xGA vs. goals conceded</span>
                <span className="font-display text-xs uppercase tracking-[0.18em] text-primary">
                  Matchweek {xgaFixture} / {MAX_FIXTURE}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[480px]">
                <XGAPlot data={aggregatedXgaData} />
              </div>
              <div className="mt-8">
                <FixtureSlider value={xgaFixture} onChange={setXgaFixture} max={MAX_FIXTURE} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
