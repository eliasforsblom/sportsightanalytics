import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ChartContainer } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, Tooltip, TooltipProps, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

interface AnalyticsData {
  visit_date: string
  total_visitors: number
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
          Total Visitors: {payload[0].value}
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
        .select("visit_date, visitor_count")
        .order("visit_date", { ascending: true })

      if (error) throw error

      // Aggregate visitors by date
      const aggregatedData = data.reduce((acc: { [key: string]: number }, curr) => {
        const date = curr.visit_date
        acc[date] = (acc[date] || 0) + (curr.visitor_count || 0)
        return acc
      }, {})

      // Convert to array format for the chart
      const chartData = Object.entries(aggregatedData).map(([date, total_visitors]) => ({
        visit_date: date,
        total_visitors
      }))

      return chartData as AnalyticsData[]
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
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Website Traffic</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={analytics} 
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <XAxis 
                dataKey="visit_date" 
                tickFormatter={(value) => format(new Date(value), 'MMM d')}
                stroke="#8E9196"
                fontSize={12}
              />
              <YAxis 
                stroke="#8E9196"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="total_visitors"
                name="Total Visitors"
                fill="var(--color-views)"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}