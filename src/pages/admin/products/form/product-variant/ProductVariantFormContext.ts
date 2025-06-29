import { createContext } from "react";
import { ProductVariant } from "@/dto/product/product-variant.ts";

export type ProductVariantFormContextProps = {
  handleProductVariantUpdate: (updateData: ProductVariant[]) => void;
};

export const ProductVariantFormContext =
  createContext<ProductVariantFormContextProps | null>(null);
