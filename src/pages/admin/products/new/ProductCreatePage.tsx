import PageTitle from '@/pages/common/PageTitle.tsx';
import ProductForm from '@/pages/admin/products/new/ProductForm.tsx';
import { useMutation } from '@tanstack/react-query';
import  ProductsService  from '@/services/products.service.ts';
import Utils from '@/utils/utils.ts';
import notification from '@/utils/notification.tsx';
import { useNavigate } from 'react-router-dom';

function ProductCreatePage() {
  const navigate = useNavigate();

  const {
    isPending,
    mutate,
    isError,
    error
  } = useMutation({
    mutationFn: ProductsService.create,
    onSuccess: ()=> {
      notification.success('Create product success');
      navigate('/admin/products')
    }
  });

  if (isError) {
    Utils.handleError(error);
  }

  return (
    <div>
      <PageTitle>New Product</PageTitle>
      <ProductForm mutate={mutate} isPending={isPending}/>
    </div>
  );
}

export default ProductCreatePage;