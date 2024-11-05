import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/common/constant/query-key.ts";
import productsService from "@/services/products.service.ts";
import Utils from "@/utils/utils.ts";
import { Card } from "@/components/ui/card.tsx";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "@/router/RoutePath.ts";
import categoriesService from "@/services/categories.service.ts";
import { useState } from "react";
import { ProductQueryDto } from "@/dto/product/product-query.dto.ts";
import { Product } from "@/dto/product/product.ts";
import ProductCard from "@/pages/common/ProductCard.tsx";

function ProductRecommend() {
  const [categoryId, setCategoryId] = useState<number>();
  const productQueryDto: ProductQueryDto = {
    categoryId,
  };

  const {
    data: pageProduct,
    isLoading: isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [QueryKey.Products, categoryId],
    queryFn: () => productsService.getPage(productQueryDto),
  });

  const {
    data: categoryList,
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
    error: errorCategory,
  } = useQuery({
    queryKey: [QueryKey.Categories],
    queryFn: categoriesService.getAll,
  });

  const navigate = useNavigate();

  if (isError) {
    Utils.handleError(error);
  }

  if (isLoading) {
    return <div>Loading products recommends ...</div>;
  }

  return (
    <div className={"mt-4"}>
      <div className={"grid grid-cols-2 gap-2 md:grid-cols-5 md:gap-4 mt-4"}>
        {categoryList &&
          categoryList.map((category) => (
            <Card
              className={"text-center cursor-pointer p-2"}
              onClick={() => setCategoryId(category.id!)}
              key={category.id!}
            >
              <div
                className={"flex flex-col items-center justify-center gap-1"}
              >
                <img src={category.imageFileUrl!} className={"size-10"} />
                <span className={"font-semibold"}>{category.name}</span>
              </div>
            </Card>
          ))}
      </div>

      <div className={"text-lg font-bold  mt-4"}>Recommend for you</div>
      <div className={"grid  grid-cols-2 gap-2 md:grid-cols-5 md:gap-4 mt-4"}>
        {pageProduct &&
          pageProduct.data.map((product) => (
            <ProductCard
              key={product.id!}
              onClick={() =>
                navigate(`${RoutePath.ProductDetail}/${product.id}`)
              }
              product={product}
            />
          ))}
      </div>
    </div>
  );
}

export default ProductRecommend;
