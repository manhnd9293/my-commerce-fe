import { useMutation, useQuery } from '@tanstack/react-query';
import { QueryKey } from '@/constant/query-key.ts';
import { useNavigate, useParams } from 'react-router-dom';
import ProductsService from '@/services/products.service.ts';
import Utils from '@/utils/utils.ts';
import PageTitle from '@/pages/common/PageTitle.tsx';
import ProductForm from '@/pages/admin/products/form/ProductForm.tsx';
import notification from '@/utils/notification.tsx';
import { Product } from '@/dto/product/product.ts';

function ProductUpdatePage() {
  const params = useParams();
  const navigate = useNavigate();
  const {data, isLoading, isError, error} = useQuery({
    queryKey: [QueryKey.Products, {id: params.id}],
    queryFn: () => ProductsService.get(params.id!),
  });

  const {mutate, isPending} = useMutation({
    mutationFn: (data: Partial<Product>) => ProductsService.update(data!, new FileList()),
    onSuccess: ()=> {
      notification.success('Update product success');
      navigate('/admin/products')
    }
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
        data &&
        <ProductForm mutate={mutate}
                     isPending={isPending}
                     initialData={data}/>
      }
    </div>
  );
}

export default ProductUpdatePage;