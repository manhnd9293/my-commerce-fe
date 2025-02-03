import PageTitle from "@/pages/common/PageTitle.tsx";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CategoriesService from "@/services/categories.service.ts";
import notification from "@/utils/notification.tsx";
import Utils from "@/utils/utils.ts";
import CategoryForm, {
  categoryFormSchema,
} from "@/pages/admin/categories/components/CategoryForm.tsx";

function CategoryCreatePage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: (variables: z.infer<typeof categoryFormSchema>) =>
      CategoriesService.create(variables.name, variables.updateImage!),
    onSuccess: () => {
      navigate("/admin/categories");
      notification.success("Category crated success");
    },
    onError: (error) => {
      Utils.handleError(error as Error);
    },
  });

  return (
    <div>
      <PageTitle>New category</PageTitle>
      <CategoryForm onSubmit={mutate} isPending={isPending} />
    </div>
  );
}

export default CategoryCreatePage;
