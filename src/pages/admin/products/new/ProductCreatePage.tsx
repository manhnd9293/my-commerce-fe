import PageTitle from '@/pages/common/PageTitle.tsx';
import ProductForm from '@/pages/admin/products/new/ProductForm.tsx';
import { useMutation } from '@tanstack/react-query';
import  ProductsService  from '@/services/products.service.ts';
import Utils from '@/utils/utils.ts';

function ProductCreatePage() {
  const {
    isPending,
    mutate,
    isError,
    error
  } = useMutation({
    mutationFn: ProductsService.create
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