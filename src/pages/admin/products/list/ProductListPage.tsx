import PageTitle from '@/pages/common/PageTitle.tsx';
import { ProductTable } from '@/pages/admin/products/list/product-table/ProductTable.tsx';

function ProductListPage() {
  return (
    <div>
      <PageTitle>Products</PageTitle>
      <div className={'mt-4 max-w-4xl'}>
        <ProductTable/>
      </div>
    </div>
  );
}

export default ProductListPage;