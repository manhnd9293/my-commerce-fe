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
    label: "Orders",
    color: "#6b0762",
  },
} satisfies ChartConfig;

function OrderChart({ data }: { data: DataPoint[] }) {
  return (
    <div>
      <div className={"font-medium"}>Number of orders</div>
      <ChartContainer className={"w-full mt-2"} config={chartConfig}>
        <LineChart data={data}>
          <Line dataKey="yValue" />
          <CartesianGrid vertical={false} />
          <XAxis tickLine={false} dataKey={"xValue"} />
          <YAxis
            allowDataOverflow={false}
            domain={[0, Math.max(...data.map((d) => d?.yValue))]}
            name={"No Orders"}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
export default OrderChart;
