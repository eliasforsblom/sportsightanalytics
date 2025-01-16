import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { BarChart, Bar, XAxis, YAxis, Tooltip, TooltipProps, ResponsiveContainer, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { useQueryClient } from "@tanstack/react-query"

interface AnalyticsData {
  visit_date: string
  visitor_count: number
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
          Visitors: {payload[0].value}
        </p>
      </div>
    )
  }
  return null
}

export function AnalyticsDashboard() {
  const queryClient = useQueryClient()

  // Set up real-time listener for analytics table
  useEffect(() => {
    const analyticsChannel = supabase
      .channel('analytics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analytics'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["analytics"] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(analyticsChannel)
    }
  }, [queryClient])

  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics")
        .select("visit_date, visitor_count")
        .order("visit_date", { ascending: true })

      if (error) throw error
      return data
    },
  })

  if (isLoadingAnalytics) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
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
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#E5E7EB" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="visit_date" 
                  tickFormatter={(value) => format(new Date(value), 'MMM d')}
                  stroke="#8E9196"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#8E9196"
                  fontSize={12}
                  label={{ value: 'Visitors', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="visitor_count"
                  name="Visitors"
                  fill="var(--color-views)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}