import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import { DataPoint } from "@/dto/analytic/dashboard/dashboard-data.dto.ts";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { DashboardPeriod } from "@/dto/analytic/dashboard/dashboard-query.dto.ts";
import utils from "@/utils/utils.ts";

const chartConfig = {
  yValue: {
    label: "Revenue",
    color: "#2563eb",
  },
  xValue: {
    label: "Day",
    color: "#2563eb",
  },
} satisfies ChartConfig;

function RevenueChart({
  data,
  period,
}: {
  data: DataPoint[];
  period: DashboardPeriod;
}) {
  return (
    <div>
      <div
        className={"font-medium"}
      >{`Revenue by ${utils.getDetailPeriod(period).toLowerCase()}`}</div>
      <ChartContainer className={"w-full h-full mt-2"} config={chartConfig}>
        <LineChart data={data}>
          <Line type={"monotone"} stroke="#8884d8" dataKey="yValue" />
          <CartesianGrid vertical={false} />
          <XAxis dataKey={"xValue"} tickLine={false} name={"month"} />
          <YAxis
            allowDataOverflow={false}
            domain={[0, Math.max(...data.map((d) => d?.yValue))]}
          ></YAxis>
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
export default RevenueChart;
