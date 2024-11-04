import { DashboardQueryDto } from "@/dto/analytic/dashboard/dashboard-query.dto.ts";
import httpClient from "@/http-client/http-client.ts";
import { DashboardDataDto } from "@/dto/analytic/dashboard/dashboard-data.dto.ts";

class AnalyticsService {
  getDashboardData(data: DashboardQueryDto): Promise<DashboardDataDto> {
    const { period } = data;
    return httpClient.get(`/analytics/dashboard?period=${period}`);
  }
}

export default new AnalyticsService();
