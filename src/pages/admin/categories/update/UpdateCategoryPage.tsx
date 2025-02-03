import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CategoriesService from "@/services/categories.service.ts";
import { useNavigate, useParams } from "react-router-dom";
import CategoryForm from "@/pages/admin/categories/components/CategoryForm.tsx";
import PageTitle from "@/pages/common/PageTitle.tsx";
import { QueryKey } from "@/common/constant/query-key.ts";
import notification from "@/utils/notification.tsx";
import Utils from "@/utils/utils.ts";
import { UpdateCategoryDto } from "@/dto/category/update-category.dto.ts";

export function UpdateCategoryPage() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    isError: isLoadError,
    error: loadError,
  } = useQuery({
    queryKey: [QueryKey.Category, params.categoryId],
    queryFn: () => CategoriesService.getById(Number(params.categoryId)),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateCategoryDto) =>
      CategoriesService.update(Number(params.categoryId), data),
    onSuccess: () => {
      navigate("/admin/categories");
      queryClient
        .invalidateQueries({
          queryKey: [QueryKey.Category, params.categoryId],
        })
        .then(() => {
          notification.success("Update category success");
        });
    },
    onError: (error) => {
      Utils.handleError(error as Error);
    },
  });

  if (isLoading) {
    return <div>Loading category ...</div>;
  }

  if (isLoadError) {
    return <div>Fail to load category ${loadError.message}</div>;
  }

  return (
    <>
      <PageTitle>Update category</PageTitle>
      {data && (
        <CategoryForm
          initialData={data}
          onSubmit={mutate}
          isPending={isPending}
        />
      )}
    </>
  );
}
