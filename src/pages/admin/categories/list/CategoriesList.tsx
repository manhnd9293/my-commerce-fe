import PageTitle from '@/pages/common/PageTitle.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import categoriesService from '@/services/categories.service.ts';
import CategoryTable from '@/pages/admin/categories/list/category-table/CategoryTable.tsx';

function CategoriesList(props) {
  const {data, isLoading, error} = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.get
  });
  if (isLoading) {
    return <div>Loading data ...</div>
  }
  return (
    <div>
      <PageTitle>Categories</PageTitle>
      <Link to={'create'}><Button className={'mt-8'}>Create</Button></Link>
      <div className={'mt-4 max-w-4xl'}>
        <CategoryTable data={data}/>
      </div>
    </div>
  );
}

export default CategoriesList;