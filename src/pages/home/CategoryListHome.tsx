import { Card } from "@/components/ui/card.tsx";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/common/constant/query-key.ts";
import categoriesService from "@/services/categories.service.ts";

interface CategoryListHomeProps {
  onSelectCategory: (id: number | string) => void;
}

function CategoryListHome({ onSelectCategory }: CategoryListHomeProps) {
  const { data: categoryList, isLoading } = useQuery({
    queryKey: [QueryKey.Categories],
    queryFn: categoriesService.getAll,
  });

  if (isLoading) {
    return <div>Loading categories ...</div>;
  }

  return (
    <div className={"grid grid-cols-2 gap-2 md:grid-cols-5 md:gap-4 mt-4"}>
      {categoryList &&
        categoryList.map((category) => (
          <Card
            className={"text-center cursor-pointer p-2"}
            onClick={() => onSelectCategory(category.id!)}
            key={category.id!}
          >
            <div className={"flex flex-col items-center justify-center gap-1"}>
              <img src={category.imageFileUrl!} className={"size-10"} />
              <span className={"font-semibold"}>{category.name}</span>
            </div>
          </Card>
        ))}
    </div>
  );
}

export default CategoryListHome;
