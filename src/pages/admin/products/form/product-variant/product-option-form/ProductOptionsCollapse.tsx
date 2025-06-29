import { ProductOption } from "@/pages/admin/products/form/product-variant/product-option-form/product-options-form-types.ts";
import { v4 as uuidV4 } from "uuid";
import { MouseEvent } from "react";

type ProductOptionsCollapseProps = {
  data: ProductOption;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
};

export function ProductOptionsCollapse({
  data,
  onClick,
}: ProductOptionsCollapseProps) {
  return (
    <div
      className={"p-4 hover:bg-gray-100 rounded-sm select-none"}
      onClick={onClick}
    >
      <div className={"font-bold"}>{data?.name}</div>
      <div className={"mt-2 flex gap-2"}>
        {data?.optionValues?.map((value) => {
          return (
            <div
              key={uuidV4()}
              className={
                "bg-gray-200 rounded-sm text-sm p-2 max-w-48 line-clamp-1 text-ellipsis"
              }
            >
              {value.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
