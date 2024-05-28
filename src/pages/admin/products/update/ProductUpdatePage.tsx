import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '@/constant/query-key.ts';
import { useParams } from 'react-router-dom';
import ProductsService from '@/services/products.service.ts';
import Utils from '@/utils/utils.ts';
import PageTitle from '@/pages/common/PageTitle.tsx';
import ProductForm from '@/pages/admin/products/form/ProductForm.tsx';

function ProductUpdatePage() {
  const params = useParams();
  const {data, isLoading, isError, error} = useQuery({
    queryKey: [QueryKey.Products, {id: params.id}],
    queryFn: () => ProductsService.get(params.id!),
  });


  if (isError) {
    Utils.handleError(error);
    return;
  }

  if (isLoading) {
    return <div>Loading product data ...</div>
  }

  return (
    <div>
      <PageTitle>Update Product</PageTitle>
      {
        data && <ProductForm initialData={data}/>
      }
    </div>
  );
}

export default ProductUpdatePage;