import httpClient from "@/http-client/http-client.ts";
import { Product } from "@/dto/product/product.ts";
import { z } from "zod";
import { productFormSchema } from "@/pages/admin/products/form/ProductForm.tsx";
import { ProductQueryDto } from "@/dto/product/product-query.dto.ts";
import { PageData } from "@/dto/page-data/page-data.ts";
import { BaseQueryDto } from "@/dto/query/base-query.dto.ts";
import Utils from "@/utils/utils.ts";

class ProductsService {
  async create(data: z.infer<typeof productFormSchema>) {
    const product = (await httpClient.post("/products", data)) as Product;
    const images = data.newImages;
    const formData = new FormData();

    images &&
      Array.from(images).forEach((item) =>
        formData.append("productImages", item),
      );
    return httpClient.patch(`/products/${product.id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

  async update(updateProduct: z.infer<typeof productFormSchema>) {
    await httpClient.put(`/products`, updateProduct);

    const images = updateProduct.newImages;
    const formData = new FormData();
    images &&
      Array.from(images).forEach((item) =>
        formData.append("productImages", item),
      );
    return httpClient.patch(`/products/${updateProduct.id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async getSimilarProducts(
    productId: number,
    query: BaseQueryDto,
  ): Promise<PageData<Product>> {
    const queryString = Utils.getQueryString(query);
    return httpClient.get(`/products/${productId}/similar?${queryString}`);
  }
}

export default new ProductsService();
