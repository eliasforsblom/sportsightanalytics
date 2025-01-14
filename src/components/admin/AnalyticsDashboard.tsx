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
  total_visitors: number
}

interface PostViewsData {
  title: string
  views: number
}

interface LocationData {
  country: string
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

const PostViewsTooltip = ({
  active,
  payload,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="text-sm font-medium">{payload[0].payload.title}</p>
        <p className="text-sm text-muted-foreground">
          Views: {payload[0].value}
        </p>
      </div>
    )
  }
  return null
}

const LocationTooltip = ({
  active,
  payload,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="text-sm font-medium">{payload[0].payload.country}</p>
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

  // Set up real-time listeners for tables
  useEffect(() => {
    const postsChannel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["post-views"] })
        }
      )
      .subscribe()

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

    const locationsChannel = supabase
      .channel('locations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'viewer_locations'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["locations"] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(postsChannel)
      supabase.removeChannel(analyticsChannel)
      supabase.removeChannel(locationsChannel)
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

  const { data: postViews, isLoading: isLoadingPostViews } = useQuery({
    queryKey: ["post-views"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("title, views")
        .order("views", { ascending: false })
        .limit(10)

      if (error) throw error
      return data as PostViewsData[]
    },
  })

  const { data: locations, isLoading: isLoadingLocations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("viewer_locations")
        .select("country, visitor_count")

      if (error) throw error

      // Aggregate visitors by country
      const aggregatedData = data.reduce((acc: { [key: string]: number }, curr) => {
        const country = curr.country
        acc[country] = (acc[country] || 0) + (curr.visitor_count || 0)
        return acc
      }, {})

      // Convert to array format for the chart and sort by total visitors
      const chartData = Object.entries(aggregatedData)
        .map(([country, total_visitors]) => ({
          country,
          total_visitors
        }))
        .sort((a, b) => b.total_visitors - a.total_visitors)
        .slice(0, 10) // Only show top 10 countries

      return chartData as LocationData[]
    },
  })

  if (isLoadingAnalytics || isLoadingPostViews || isLoadingLocations) {
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

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Post Views</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={postViews} 
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#E5E7EB" 
                  horizontal={false}
                />
                <XAxis 
                  type="number"
                  stroke="#8E9196"
                  fontSize={12}
                />
                <YAxis 
                  type="category"
                  dataKey="title"
                  width={150}
                  stroke="#8E9196"
                  fontSize={12}
                  tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
                />
                <Tooltip content={<PostViewsTooltip />} />
                <Bar
                  dataKey="views"
                  name="Views"
                  fill="var(--color-views)"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Top Visitor Locations</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={locations} 
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#E5E7EB" 
                  horizontal={false}
                />
                <XAxis 
                  type="number"
                  stroke="#8E9196"
                  fontSize={12}
                />
                <YAxis 
                  type="category"
                  dataKey="country"
                  width={100}
                  stroke="#8E9196"
                  fontSize={12}
                />
                <Tooltip content={<LocationTooltip />} />
                <Bar
                  dataKey="total_visitors"
                  name="Visitors"
                  fill="var(--color-views)"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}