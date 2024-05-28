import PageTitle from '@/pages/common/PageTitle.tsx';
import ProductForm from '@/pages/admin/products/form/ProductForm.tsx';

function ProductCreatePage() {

  return (
    <div>
      <PageTitle>New Product</PageTitle>
      <ProductForm />
    </div>
  );
}

export default ProductCreatePage;