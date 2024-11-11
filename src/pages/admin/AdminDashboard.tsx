import PageTitle from "@/pages/common/PageTitle.tsx";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DashboardPeriod } from "@/dto/analytic/dashboard/dashboard-query.dto.ts";
import AnalyticsService from "@/services/analytics.service.ts";
import Utils from "@/utils/utils.ts";
import { ArrowDown, ArrowUp } from "lucide-react";
import RevenueChart from "@/pages/admin/dashboard/RevenueChart.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import OrderChart from "@/pages/admin/dashboard/OrderChart.tsx";

function AdminDashboard() {
  const [period, setPeriod] = useState<DashboardPeriod>(DashboardPeriod.Day);

  const { data: dashBoardData, isLoading } = useQuery({
    queryKey: ["Dashboard", { period }],
    queryFn: () => AnalyticsService.getDashboardData({ period }),
  });

  if (isLoading) {
    return `Loading dashboard data ...`;
  }
  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      {dashBoardData && (
        <div className={"mt-4"}>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="period">Period</Label>
            <Select
              value={period}
              onValueChange={(v) => setPeriod(v)}
              defaultValue={"day"}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="month">Current Month</SelectItem>
                <SelectItem value="year">Current Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div
            className={
              "mt-4 grid grid-cols-4 w-full gap-4 items-center justify-center"
            }
          >
            <div className={"shadow-md p-4 rounded-xl bg-card"}>
              <div className={"flex justify-between"}>
                <div className={"font-semibold"}>Total Revenue</div>
                <div>
                  {dashBoardData.revenueChange > 0 && (
                    <ArrowUp className={"text-green-500"} />
                  )}
                  {dashBoardData.revenueChange < 0 && (
                    <ArrowDown className={"text-red-500"} />
                  )}
                </div>
              </div>
              <div className={"mt-8 font-bold text-lg"}>
                {Utils.getMoneyNumber(dashBoardData.totalRevenue)}
              </div>
              <div>
                <span>Change: </span>
                {dashBoardData.revenueChange}
              </div>
            </div>

            <div className={"shadow-md p-4 rounded-xl bg-card"}>
              <div className={"flex justify-between"}>
                <div className={"font-semibold"}>Total Orders</div>
                <div>
                  {dashBoardData.orderChange > 0 && (
                    <ArrowUp className={"text-green-500"} />
                  )}
                  {dashBoardData.orderChange < 0 && (
                    <ArrowDown className={"text-red-500"} />
                  )}
                </div>
              </div>
              <div className={"mt-8 font-bold text-lg"}>
                {dashBoardData.totalOrder}
              </div>
              <div>
                <span>Change: </span>
                {dashBoardData.orderChange}
              </div>
            </div>

            <div className={"shadow-md p-4 rounded-xl bg-card"}>
              <div className={"flex justify-between"}>
                <div className={"font-semibold"}>New Customers</div>
                <div>
                  {dashBoardData.customerChange > 0 && (
                    <ArrowUp className={"text-green-500"} />
                  )}
                  {dashBoardData.customerChange < 0 && (
                    <ArrowDown className={"text-red-500"} />
                  )}
                </div>
              </div>
              <div className={"mt-8 font-bold text-lg"}>
                {dashBoardData.newCustomer}
              </div>
              <div>
                <span>Change: </span>
                {dashBoardData.customerChange}
              </div>
            </div>

            <div className={"shadow-md p-4 rounded-xl bg-card card"}>
              <div className={"flex justify-between"}>
                <div className={"font-semibold"}>Product Sold</div>
                <div>
                  {dashBoardData.productSoldChange > 0 && (
                    <ArrowUp className={"text-green-500"} />
                  )}
                  {dashBoardData.productSoldChange < 0 && (
                    <ArrowDown className={"text-red-500"} />
                  )}
                </div>
              </div>
              <div className={"mt-8 font-bold text-lg"}>
                {dashBoardData.productSold}
              </div>
              <div>
                <span>Change: </span>
                {dashBoardData.productSoldChange}
              </div>
            </div>
          </div>

          <div className={"mt-4 grid grid-cols-3 gap-2 items-start"}>
            <div className={"bg-card col-span-2 p-4 rounded-xl shadow-md "}>
              <Tabs defaultValue="revenue">
                <TabsList>
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="order">Order</TabsTrigger>
                </TabsList>
                <TabsContent value="revenue">
                  <RevenueChart
                    period={period}
                    data={dashBoardData.revenueChart}
                  />
                </TabsContent>
                <TabsContent value="order">
                  <OrderChart data={dashBoardData.orderChart} />
                </TabsContent>
              </Tabs>
            </div>

            <div
              className={"bg-card p-4 rounded-xl shadow-md flex flex-col gap-2"}
            >
              <div className={"font-medium mb-2"}>Top selling products</div>
              {dashBoardData.topSellProduct.map((p) => {
                return (
                  <div key={p.productVariant.id} className={"flex gap-2"}>
                    <img
                      className={
                        "size-12 object-cover object-center rounded shadow-md"
                      }
                      src={p.productVariant.product?.thumbnailUrl}
                      alt={`product-${p.productVariant.product?.name}`}
                    />
                    <div className={"flex-1 truncate"}>
                      <div>{p.saleQuantity}</div>
                      <div className={"text-sm mt-1"}>
                        {p.productVariant.product?.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
