import httpClient from "@/http-client/http-client.ts";
import { Product } from "@/dto/product/product.ts";
import { z } from "zod";
import { ProductQueryDto } from "@/dto/product/product-query.dto.ts";
import { PageData } from "@/dto/page-data/page-data.ts";
import { BaseQueryDto } from "@/dto/query/base-query.dto.ts";
import Utils from "@/utils/utils.ts";
import { productFormSchema } from "@/pages/admin/products/form/product-form-schema.ts";
import { ProductOption } from "@/pages/admin/products/form/product-variant/product-option-form/product-options-form-types.ts";
import { ProductVariant } from "@/dto/product/product-variant.ts";

class ProductsService {
  async create(
    data: z.infer<typeof productFormSchema> & {
      productOptions: ProductOption[];
      productVariants: ProductVariant[];
    },
  ) {
    return httpClient.post("/products", data);
  }

  getPage(productQueryDto: ProductQueryDto): Promise<PageData<Product>> {
    const queryString = Utils.getQueryString(productQueryDto);
    return httpClient.get(`/products?${queryString}`);
  }

  getAll(): Promise<Product[]> {
    return httpClient.get(`/products/all`);
  }

  get(id: string): Promise<Product | null> {
    return httpClient.get(`/products/${id}`);
  }

  async update(
    productId: string,
    updateProduct: z.infer<typeof productFormSchema> & {
      productVariants: ProductVariant[];
      productOptions: ProductOption[];
    },
  ) {
    console.log({ updateProduct });
    return httpClient.put(`/products/${productId}`, updateProduct);
  }

  async getSimilarProducts(
    productId: string,
    query: BaseQueryDto,
  ): Promise<PageData<Product>> {
    const queryString = Utils.getQueryString(query);
    return httpClient.get(`/products/${productId}/similar?${queryString}`);
  }

  async updateProductMedia(productId: string, updateIds: string[]) {
    return httpClient.patch(`/products/${productId}/media`, {
      updateIds,
    });
  }

  deleteProductMedia(productId: string, assetIds: string[]) {
    return httpClient.delete(`/products/${productId}/media`, {
      data: { assetIds },
    });
  }
}

export default new ProductsService();
