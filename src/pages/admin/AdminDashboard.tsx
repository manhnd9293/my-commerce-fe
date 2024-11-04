import PageTitle from "@/pages/common/PageTitle.tsx";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DashboardPeriod } from "@/dto/analytic/dashboard/dashboard-query.dto.ts";
import AnalyticsService from "@/services/analytics.service.ts";
import Utils from "@/utils/utils.ts";
import { ArrowDown, ArrowUp } from "lucide-react";
import RevenueChart from "@/pages/admin/dashboard/RevenueChart.tsx";
import OrderChart from "@/pages/admin/dashboard/OrderChart.tsx";

function AdminDashboard() {
  const [period, setPeriod] = useState<DashboardPeriod>(DashboardPeriod.Day);

  const { data: dashBoardData, isLoading } = useQuery({
    queryKey: ["Dashboard"],
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
          <div
            className={
              "grid grid-cols-4 w-full gap-4 items-center justify-center"
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
              <div className={"mt-8"}>
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
              <div className={"mt-8"}>{dashBoardData.totalOrder}</div>
              <div>
                <span>Change: </span>
                {dashBoardData.orderChange}
              </div>
            </div>

            <div className={"shadow-md p-4 rounded-xl bg-card"}>
              <div className={"font-semibold"}>New Customers</div>
              <div className={"mt-8"}>{dashBoardData.newCustomer}</div>
              <div>
                <span>Change: </span>
                {dashBoardData.customerChange}
              </div>
            </div>

            <div className={"shadow-md p-4 rounded-xl bg-card card"}>
              <div className={"font-semibold"}>Product Sold</div>
              <div className={"mt-8"}>{dashBoardData.productSold}</div>
              <div>
                <span>Change: </span>
                {dashBoardData.productSoldChange}
              </div>
            </div>
          </div>

          <div className={"mt-4 grid grid-cols-3 gap-2 items-start"}>
            <div className={"bg-card p-4 rounded-xl shadow-md"}>
              <RevenueChart key={"xValue"} data={dashBoardData.revenueChart} />
            </div>

            <div className={"bg-card p-4 rounded-xl shadow-md"}>
              <OrderChart data={dashBoardData.orderChart} />
            </div>

            <div
              className={
                "bg-card p-4 rounded-xl shadow-md flex flex-col gap-2 truncate"
              }
            >
              <div className={"font-medium"}>Top selling products</div>
              {dashBoardData.topSellProduct.map((p) => {
                return (
                  <div key={p.productVariant.id} className={"flex gap-2"}>
                    <img
                      className={
                        "size-10 object-cover object-center rounded shadow-md"
                      }
                      src={p.productVariant.product?.thumbnailUrl}
                      alt={`product-${p.productVariant.product?.name}`}
                    />
                    <div>
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
