import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/common/constant/query-key.ts";
import productsService from "@/services/products.service.ts";
import Utils from "@/utils/utils.ts";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "@/router/RoutePath.ts";
import { ProductQueryDto } from "@/dto/product/product-query.dto.ts";
import ProductCard from "@/pages/common/ProductCard.tsx";

interface ProductRecommendProps {
  categoryId: number | string | undefined;
}

function ProductRecommend({ categoryId }: ProductRecommendProps) {
  const productQueryDto: ProductQueryDto = {
    categoryId,
    pageSize: 20,
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

  const navigate = useNavigate();

  if (isError) {
    Utils.handleError(error);
  }

  if (isLoading) {
    return <div>Loading products recommends ...</div>;
  }

  return (
    <div className={"mt-4"}>
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
