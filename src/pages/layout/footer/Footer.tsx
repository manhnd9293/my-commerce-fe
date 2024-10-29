import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/common/constant/query-key.ts";
import categoriesService from "@/services/categories.service.ts";
import { Link } from "react-router-dom";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

function Footer() {
  const { data: categoryList } = useQuery({
    queryKey: [QueryKey.Categories],
    queryFn: categoriesService.getAll,
  });
  return (
    <div className={" border-t mt-4 p-10 bg-white"}>
      <div
        className={"max-w-screen-2xl mx-auto flex items-start justify-between"}
      >
        <div className={"text-xl font-semibold"}>My Commerce</div>
        <div className={"flex gap-24"}>
          <div>
            <div className={"font-semibold mb-2"}>Categories</div>
            {categoryList &&
              categoryList.map((category) => (
                <div key={category.id}>{category.name}</div>
              ))}
          </div>
          <div>
            <div className={"font-semibold mb-2"}>Author</div>
            <div className={"flex items-center gap-2"}>Manh Nguyen</div>
            <div className={"mt-2"}>
              <Link to={"https://github.com/manhnd9293"}>
                <GitHubLogoIcon className={"size-5"} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        className={"flex justify-between max-w-screen-2xl mx-auto mt-8 text-sm"}
      >
        <div>2024 - My commerce. All right reserved</div>
        <div>Power by NestJS & ReactJS</div>
      </div>
    </div>
  );
}

export default Footer;
