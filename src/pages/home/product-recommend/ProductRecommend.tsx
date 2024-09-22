import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/constant/query-key.ts";
import productsService from "@/services/products.service.ts";
import Utils from "@/utils/utils.ts";
import { Card } from "@/components/ui/card.tsx";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "@/router/RoutePath.ts";
import categoriesService from "@/services/categories.service.ts";
import { useState } from "react";
import { ProductQueryDto } from "@/dto/product/product-query.dto.ts";

function ProductRecommend() {
  const [categoryId, setCategoryId] = useState<number>();
  const productQueryDto: ProductQueryDto = {
    categoryId,
  };

  const {
    data: productList,
    isLoading: isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [QueryKey.Products, categoryId],
    queryFn: () => productsService.getAll(productQueryDto),
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
      <div className={"grid grid-cols-5 gap-4 mt-4"}>
        {categoryList &&
          categoryList.map((category) => (
            <Card
              className={"text-center cursor-pointer p-1"}
              onClick={() => setCategoryId(category.id!)}
            >
              <span className={"font-semibold"}>{category.name}</span>
            </Card>
          ))}
      </div>

      <div className={"text-lg font-bold "}>Recommend for you</div>
      <div className={"grid grid-cols-4 lg:grid-cols-5 gap-4 mt-4"}>
        {productList &&
          productList.map((product) => (
            <Card
              className={"p-2 cursor-pointer flex flex-col space-y-3"}
              onClick={() =>
                navigate(`${RoutePath.ProductDetail}/${product.id}`)
              }
            >
              <div className={"truncate font-semibold"}>{product.name}</div>
              <div>
                <img src={product.thumbnailUrl} />
              </div>
              <div>
                Price:{" "}
                {product.price
                  ? new Intl.NumberFormat().format(product.price)
                  : "No Information"}
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default ProductRecommend;
