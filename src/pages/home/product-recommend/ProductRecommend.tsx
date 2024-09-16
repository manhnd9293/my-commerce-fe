import {useQuery} from "@tanstack/react-query";
import {QueryKey} from "@/constant/query-key.ts";
import productsService from "@/services/products.service.ts";
import Utils from "@/utils/utils.ts";
import {Card} from "@/components/ui/card.tsx";
import {useNavigate} from "react-router-dom";
import {RoutePath} from "@/router/RoutePath.ts";


function ProductRecommend() {
  const {data: productList, isLoading: isLoading, isError, error} = useQuery({
    queryKey: [QueryKey.Products],
    queryFn: productsService.getAll
  });

  const navigate = useNavigate();

  if (isError) {
    Utils.handleError(error);
  }

  return (
    <div className={'mt-4'}>
      <div className={'text-lg font-bold '}>
        Recommend for you
      </div>
      <div className={'grid grid-cols-4 lg:grid-cols-5 gap-4 mt-4'}>
        {
          productList && productList.map((product)=> (
            <Card className={'p-2 cursor-pointer flex flex-col space-y-3'}
                  onClick={()=> navigate(`${RoutePath.ProductDetail}/${product.id}`)}
            >
              <div className={'truncate font-semibold'}>
                {product.name}
              </div>
              <div>
                <img src={product.productImages[0].asset.preSignUrl}/>
              </div>
               <div>
                Price: { product.price ? new Intl.NumberFormat().format(product.price) : 'No Information'}
              </div>
            </Card>
          ))
        }
      </div>
    </div>


  );
}

export default ProductRecommend;
