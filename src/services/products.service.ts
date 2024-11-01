import httpClient from "@/http-client/http-client.ts";
import { Product } from "@/dto/product/product.ts";
import { z } from "zod";
import { productFormSchema } from "@/pages/admin/products/form/ProductForm.tsx";
import { ProductQueryDto } from "@/dto/product/product-query.dto.ts";
import { PageData } from "@/dto/page-data/page-data.ts";
import { BaseQueryDto } from "@/dto/query/base-query.dto.ts";

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

  getAll(productQueryDto: ProductQueryDto): Promise<PageData<Product>> {
    let queryString = "";
    const { categoryId, search } = productQueryDto;
    if (categoryId) queryString += `categoryId=${categoryId}`;
    if (search) queryString += `search=${search}`;
    return httpClient.get(`/products?${queryString}`);
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
    const queryArr: string[] = [];
    for (const key of Object.keys(query)) {
      query[key] !== undefined && queryArr.push(`${key}=${query[key]}`);
    }
    return httpClient.get(
      `/products/${productId}/similar?${queryArr.join("&")}`,
    );
  }
}

export default new ProductsService();
