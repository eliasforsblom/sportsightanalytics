import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ChartContainer } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, Tooltip, TooltipProps } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

interface AnalyticsData {
  page_path: string
  visitor_count: number
  visit_date: string
  last_visit: string
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="text-sm font-medium">{format(new Date(label), 'MMM d, yyyy')}</p>
        <p className="text-sm text-muted-foreground">
          Views: {payload[0].value}
        </p>
        <p className="text-xs text-muted-foreground">
          Page: {payload[0].payload.page_path}
        </p>
      </div>
    )
  }
  return null
}

export function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics")
        .select("*")
        .order("visit_date", { ascending: true })

      if (error) throw error
      return data as AnalyticsData[]
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Page Views</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              views: {
                theme: {
                  light: "#0ea5e9",
                  dark: "#0ea5e9",
                },
              },
            }}
          >
            <BarChart data={analytics}>
              <XAxis 
                dataKey="visit_date" 
                tickFormatter={(value) => format(new Date(value), 'MMM d')}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="visitor_count"
                name="views"
                fill="var(--color-views)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}