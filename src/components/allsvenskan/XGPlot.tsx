
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Label,
  ReferenceLine,
  ZAxis
} from 'recharts';

interface TeamData {
  team: string;
  teamId: string;
  xG: number;
  goalsScored: number;
  imageUrl?: string;
}

interface XGPlotProps {
  data: TeamData[];
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="font-bold">{payload[0].payload.team}</p>
        <p className="text-sm">xG: {payload[0].payload.xG.toFixed(2)}</p>
        <p className="text-sm">Goals: {payload[0].payload.goalsScored}</p>
        <p className="text-sm text-muted-foreground">
          {payload[0].payload.goalsScored > payload[0].payload.xG 
            ? "Overperforming xG" 
            : "Underperforming xG"}
        </p>
      </div>
    );
  }
  return null;
};

// Custom render for dots using team logos
const renderDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  // If we have an imageUrl, render an image
  if (payload.imageUrl) {
    return (
      <image 
        x={cx - 15} 
        y={cy - 15} 
        width={30} 
        height={30} 
        xlinkHref={payload.imageUrl} 
        style={{ clipPath: 'circle(15px at center)' }}
      />
    );
  }
  
  // Fallback to a circle if no image is available
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={10} 
      fill="#777777" 
      stroke="none" 
    />
  );
};

export function XGPlot({ data }: XGPlotProps) {
  // Calculate domain bounds with some padding
  const xMax = Math.max(...data.map(d => d.xG)) * 1.1;
  const yMax = Math.ceil(Math.max(...data.map(d => d.goalsScored)) * 1.1);
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{ top: 20, right: 30, bottom: 50, left: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          type="number" 
          dataKey="xG"
          domain={[0, xMax]} 
          name="Expected Goals (xG)"
          tickFormatter={(value) => value.toFixed(1)}
        >
          <Label value="Expected Goals (xG)" position="bottom" dy={15} />
        </XAxis>
        <YAxis 
          type="number" 
          dataKey="goalsScored" 
          name="Goals Scored"
          domain={[0, yMax]}
          allowDecimals={false}
          tickCount={yMax > 10 ? 11 : yMax + 1}
        >
          <Label value="Goals Scored" position="left" angle={-90} dx={-15} />
        </YAxis>
        <ZAxis range={[60, 60]} />
        <Tooltip content={<CustomTooltip />} />
        
        {/* Reference line for xG = Goals (perfect prediction) */}
        <ReferenceLine 
          stroke="#777" 
          strokeDasharray="3 3" 
          segment={[{ x: 0, y: 0 }, { x: xMax, y: xMax }]} 
        />
        
        <Scatter 
          data={data}
          shape={renderDot}
          fill="#777777"
          dataKey="teamId"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
