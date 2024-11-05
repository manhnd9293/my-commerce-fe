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

const chartConfig = {
  yValue: {
    label: "Revenue",
    color: "#2563eb",
  },
} satisfies ChartConfig;

function RevenueChart({ data }: { data: DataPoint[] }) {
  return (
    <div>
      <div className={"font-medium"}>Revenue</div>
      <ChartContainer className={"w-full mt-2"} config={chartConfig}>
        <LineChart data={data}>
          <Line dataKey="yValue" />
          <CartesianGrid vertical={false} />
          <XAxis tickLine={false} />
          <YAxis></YAxis>
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
export default RevenueChart;
