import { ProductVariant } from "@/dto/product/product-variant.ts";
import { Category } from "@/dto/category/category.ts";

export interface DashboardDataDto {
  totalRevenue: number;
  revenueChange: number;

  totalOrder: number;
  orderChange: number;

  newCustomer: number;
  customerChange: number;

  productSold: number;
  productSoldChange: number;

  revenueChart: DataPoint[];
  orderChart: DataPoint[];

  topSellProduct: TopSellProductData[];

  topSellCategory: TopSellCategoryData[];

  recentSale: RecentSaleData[];
}

export interface DataPoint {
  xValue: string;
  yValue: number;
}

export interface TopSellProductData {
  productVariant: ProductVariant; //todo: optimize later
  saleQuantity: number;
  saleValue: number;
  valueChange?: number;
}

export interface TopSellCategoryData {
  category: Category; //todo: optimize later
  saleValue: number;
  valueChange: number;
}

export interface RecentSaleData {
  productVariant: ProductVariant; //todo: optimize later
  quantity: number;
}
