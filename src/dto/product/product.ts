import { BaseDto } from "@/dto/base.dto.ts";
import { Category } from "@/dto/category/category.ts";
import { ProductSize } from "@/dto/product/product-size.ts";
import { ProductColor } from "@/dto/product/product-color.ts";
import { ProductVariant } from "@/dto/product/product-variant.ts";
import { ProductImage } from "@/dto/product/product-image.ts";

export interface Product extends BaseDto {
  name: string;

  description: string;

  productSizes?: ProductSize[];

  productColors?: ProductColor[];

  productVariants?: ProductVariant[];

  categoryId: number;

  category?: Category;

  productImages?: ProductImage[];

  price: number;

  thumbnailUrl: string;
}
