export enum DashboardPeriod {
  Day = "day",
  Month = "month",
  Year = "year",
  Week = "week",
}

export type DetailPeriod = "MONTH" | "DAY" | "DAY OF WEEK" | "HOUR";

export interface DashboardQueryDto {
  period: DashboardPeriod;
}
