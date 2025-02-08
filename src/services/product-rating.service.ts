import httpClient from "@/http-client/http-client.ts";
import { productRatingSchema } from "@/pages/my-account/account-sub-page/product-rating/RatingDialog.tsx";
import { z } from "zod";
import { Product } from "@/dto/product/product.ts";
import { ProductRatingDto } from "@/dto/product-rating/product-rating.dto.ts";
import { PageData } from "@/dto/page-data/page-data.ts";
import Utils from "@/utils/utils.ts";
import { ProductRatingQueryDto } from "@/dto/product-rating/product-rating-query.dto.ts";

class ProductRatingService {
  getPending() {
    return httpClient.get("/product-rating/pending") as Promise<Product[]>;
  }

  rateProduct(
    productId: number,
    ratingData: z.infer<typeof productRatingSchema>,
  ) {
    const formData = new FormData();
    formData.append("rate", String(ratingData.rate));
    formData.append("textContent", ratingData.textContent);
    ratingData.productRatingMedia &&
      Array.from(ratingData.productRatingMedia).forEach((media) => {
        formData.append("productRatingMedia", media);
      });
    return httpClient.post(`/product-rating/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  getRatingList(
    productId: number,
    query: ProductRatingQueryDto,
  ): Promise<PageData<ProductRatingDto>> {
    const queryString = Utils.getQueryString(query);
    return httpClient.get(`product-rating/${productId}?${queryString}`);
  }
}

export default new ProductRatingService();
