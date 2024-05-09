import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CategoriesService from '@/services/categories.service.ts';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryForm from '@/pages/admin/categories/components/CategoryForm.tsx';
import { Category } from '@/dto/category.ts';
import PageTitle from '@/pages/common/PageTitle.tsx';
import { QueryKey } from '@/constant/query-key.ts';
import notification from '@/utils/notification.tsx';

export function UpdateCategoryPage() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {data, isLoading, isError: isLoadError, error: loadError} = useQuery({
    queryKey: [QueryKey.Category, params.categoryId],
    queryFn: () => CategoriesService.getById(Number(params.categoryId))
  });

  const {mutate, isPending, isError: isMutationError ,error,} = useMutation({
    mutationFn: (data : Partial<Category>) => CategoriesService.update(Number(params.categoryId), data),
    onSuccess: () => {
      navigate('/admin/categories');
      queryClient.invalidateQueries({
        queryKey: [QueryKey.Category, params.categoryId]
      }).then(()=> {
        notification.success('Update category success')
      })

    },
    onError: (data) => {
      console.log({data})
      // @ts-ignore
      notification.error(`Fail to create category: ${data?.response?.data?.message}`)
    }
  });

  if (isLoading) {
    return <div>Loading category ...</div>
  }

  if (isLoadError) {
    return <div>Fail to load category ${loadError.message}</div>
  }
  if (isMutationError) {
    return <div>Fail to update category ${error.message}</div>
  }

  return (
    <>
      <PageTitle>Update category</PageTitle>
      {data && <CategoryForm initialData={data} mutate={mutate} isPending={isPending}/>}
    </>

  );
}