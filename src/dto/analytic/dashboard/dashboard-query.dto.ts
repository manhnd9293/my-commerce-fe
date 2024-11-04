export enum DashboardPeriod {
  Day = "day",
  Month = "month",
  Year = "year",
  Week = "week",
}

export interface DashboardQueryDto {
  period: DashboardPeriod;
}
