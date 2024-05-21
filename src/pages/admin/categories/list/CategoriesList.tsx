import PageTitle from '@/pages/common/PageTitle.tsx';
import { useQuery } from '@tanstack/react-query';
import categoriesService from '@/services/categories.service.ts';
import { CategoryTable } from '@/pages/admin/categories/list/category-table/CategoryTable.tsx';
import { QueryKey } from '@/constant/query-key.ts';

function CategoriesList() {
  const {data, isLoading, isError , error} = useQuery({
    queryKey: [QueryKey.Categories],
    queryFn: categoriesService.getAll
  });

  if (isLoading) {
    return <div>Loading data ...</div>
  }

  if(isError) {
    return <div>Fail to load categories: {error.message}</div>
  }

  return (
    <div>
      <PageTitle>Categories</PageTitle>

      <div className={'mt-4 max-w-4xl'}>
        {data && <CategoryTable data={data}/>}
      </div>
    </div>
  );
}

export default CategoriesList;