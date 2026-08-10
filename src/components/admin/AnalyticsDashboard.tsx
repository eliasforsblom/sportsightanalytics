import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format, parseISO, subDays } from "date-fns";
import { Eye, Users, BarChart3, Repeat } from "lucide-react";

type Range = 7 | 30 | 90;

interface PageViewRow {
  session_id: string;
  path: string;
  referrer: string | null;
  visit_date: string;
  created_at: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background p-3 shadow-sm">
      <p className="text-sm font-medium">{format(parseISO(String(label)), "MMM d, yyyy")}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm text-muted-foreground">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  hint: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

export function AnalyticsDashboard() {
  const queryClient = useQueryClient();
  const [range, setRange] = useState<Range>(30);

  useEffect(() => {
    const channel = supabase
      .channel("page-views-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "page_views" }, () => {
        queryClient.invalidateQueries({ queryKey: ["page-views"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const since = useMemo(() => format(subDays(new Date(), range - 1), "yyyy-MM-dd"), [range]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["page-views", since],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_views")
        .select("session_id, path, referrer, visit_date, created_at")
        .eq("is_admin", false)
        .gte("visit_date", since)
        .order("created_at", { ascending: true })
        .limit(50000);

      if (error) throw error;
      return (data ?? []) as PageViewRow[];
    },
  });

  const stats = useMemo(() => {
    const rows = data ?? [];

    const byDate = new Map<string, { views: number; sessions: Set<string> }>();
    for (let i = range - 1; i >= 0; i--) {
      byDate.set(format(subDays(new Date(), i), "yyyy-MM-dd"), { views: 0, sessions: new Set() });
    }

    const pathCounts = new Map<string, number>();
    const referrerCounts = new Map<string, number>();
    const allSessions = new Set<string>();

    for (const row of rows) {
      const bucket = byDate.get(row.visit_date);
      if (bucket) {
        bucket.views += 1;
        bucket.sessions.add(row.session_id);
      }
      allSessions.add(row.session_id);
      pathCounts.set(row.path, (pathCounts.get(row.path) ?? 0) + 1);

      let refLabel = "Direct";
      if (row.referrer) {
        try {
          const host = new URL(row.referrer).hostname.replace(/^www\./, "");
          if (host && !host.includes("sportsightanalytics") && !host.includes("localhost")) {
            refLabel = host;
          }
        } catch {
          refLabel = "Direct";
        }
      }
      referrerCounts.set(refLabel, (referrerCounts.get(refLabel) ?? 0) + 1);
    }

    const chart = Array.from(byDate.entries()).map(([date, v]) => ({
      date,
      views: v.views,
      visitors: v.sessions.size,
    }));

    const totalViews = rows.length;
    const totalVisitors = allSessions.size;

    const topPages = Array.from(pathCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    const topReferrers = Array.from(referrerCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return {
      chart,
      totalViews,
      totalVisitors,
      avgDaily: Math.round(totalViews / range),
      viewsPerVisitor: totalVisitors ? (totalViews / totalVisitors).toFixed(1) : "0",
      topPages,
      topReferrers,
    };
  }, [data, range]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[220px]" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-[320px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Could not load analytics: {(error as Error).message}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Public page views (admin pages excluded), last {range} days
        </p>
        <div className="flex gap-2">
          {([7, 30, 90] as Range[]).map((r) => (
            <Button
              key={r}
              size="sm"
              variant={range === r ? "default" : "outline"}
              onClick={() => setRange(r)}
            >
              {r}d
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Page views" value={stats.totalViews} hint={`Last ${range} days`} icon={Eye} />
        <StatCard
          title="Unique visitors"
          value={stats.totalVisitors}
          hint="Distinct browser sessions"
          icon={Users}
        />
        <StatCard title="Avg. views / day" value={stats.avgDaily} hint={`Over ${range} days`} icon={BarChart3} />
        <StatCard
          title="Views / visitor"
          value={stats.viewsPerVisitor}
          hint="Pages per session"
          icon={Repeat}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Traffic over time</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chart} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(parseISO(value), "MMM d")}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  minTickGap={24}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Page views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#viewsFill)"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Visitors"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={1.5}
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.topPages.length === 0 && (
              <p className="text-sm text-muted-foreground">No views recorded yet.</p>
            )}
            {stats.topPages.map(([path, count]) => (
              <div key={path} className="flex items-center justify-between gap-4 text-sm">
                <span className="truncate text-muted-foreground">{path}</span>
                <span className="tabular-nums">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.topReferrers.length === 0 && (
              <p className="text-sm text-muted-foreground">No sources recorded yet.</p>
            )}
            {stats.topReferrers.map(([source, count]) => (
              <div key={source} className="flex items-center justify-between gap-4 text-sm">
                <span className="truncate text-muted-foreground">{source}</span>
                <span className="tabular-nums">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
