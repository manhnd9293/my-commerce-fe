import PageTitle from '@/pages/common/PageTitle.tsx';
import {CategoryTable} from '@/pages/admin/categories/list/category-table/CategoryTable.tsx';

function CategoriesList() {


  return (
    <div>
      <PageTitle>Categories</PageTitle>

      <div className={'mt-4 max-w-4xl'}>
        <CategoryTable/>
      </div>
    </div>
  );
}

export default CategoriesList;