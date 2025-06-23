import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import ProductOptionForm from "@/pages/admin/products/form/product-variant/product-option-form/ProductOptionForm.tsx";
import { v4 as uuidv4 } from "uuid";
import {
  optionFormSchema,
  ProductOption,
} from "@/pages/admin/products/form/product-variant/product-option-form/product-options-form-types.ts";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import ProductVariantTable from "@/pages/admin/products/form/product-variant/product-variant-table/ProductVariantTable.tsx";
import { SingleSpec } from "@/dto/product/product-variant-specs.ts";
import { ProductVariant } from "@/dto/product/product-variant.ts";

type ProductVariantFormProps = {
  onUpdate: (data: {
    index: number;
    updateValues: z.infer<typeof optionFormSchema>;
  }) => void;
};

function getProductVariants(optionList: ProductOption[]): ProductVariant[] {
  let allCombineSpecs: SingleSpec[][] = [[]];
  const validOptions = optionList.filter(
    (op) => op.id && op.optionValues && op.optionValues.length > 0,
  );
  for (const option of validOptions) {
    const { id, name, optionValues } = option;
    const updateVariants = [];
    for (const optionValue of optionValues!) {
      for (const variant of allCombineSpecs) {
        const variantClone = structuredClone(variant);
        updateVariants.push([
          ...variantClone,
          {
            optionId: id!,
            optionName: name,
            optionValueId: optionValue.id!,
            optionValueName: optionValue.name,
          },
        ]);
      }
    }
    allCombineSpecs = updateVariants;
  }

  const productVariants: ProductVariant[] = allCombineSpecs.map((specs) => {
    return {
      specs,
      quantity: 0,
      price: 0,
      productId: null,
    };
  });

  return productVariants;
}

function ProductVariantForm({ onUpdate }: ProductVariantFormProps) {
  const [optionList, setOptionList] = useState<ProductOption[]>([]);
  const [groupById, setGroupById] = useState<string | null>(
    optionList.length > 0 && optionList[0].id ? optionList[0].id : null,
  );

  function handleAddOption() {
    setOptionList([...optionList, { name: "", id: uuidv4(), isNew: true }]);
  }

  function onDeleteForm(id: string) {
    setOptionList((prev) => prev.filter((option) => option.id !== id));
  }

  function handleUpdateOptionForm(data: {
    index: number;
    updateValues: z.infer<typeof optionFormSchema>;
  }) {
    const { index, updateValues } = data;
    const { name, optionValues } = updateValues;
    const clone = structuredClone(optionList);
    const item: ProductOption = {
      name,
      optionValues,
      id: uuidv4(),
    };
    clone[index] = item;
    setOptionList(clone);

    if (optionList.length === 1 && clone[0].id) {
      setGroupById(clone[0].id);
    }

    onUpdate(data);
  }

  const groupByOption = optionList.find((op) => op.id === groupById);

  const productVariants = useMemo<ProductVariant[]>(
    () => (groupById ? getProductVariants(optionList) : []),
    [optionList, groupById],
  );

  function handleChangeGroupId(value: string) {
    setGroupById(value);
  }

  return (
    <div className={"flex flex-col border p-4 rounded-md"}>
      {optionList.map((option, index) => {
        return (
          <div key={index}>
            <ProductOptionForm
              data={option}
              onDelete={onDeleteForm}
              onUpdate={handleUpdateOptionForm}
              index={index}
            />
            {index !== optionList.length - 1 && (
              <div
                className={
                  "w-[calc(100%+var(--spacing))] -mx-4 bg-slate-300 h-[1px] my-4"
                }
              />
            )}
          </div>
        );
      })}
      {optionList.length < 3 && (
        <div
          className={
            "flex items-center hover:bg-gray-100 p-2 rounded-sm cursor-pointer gap-2"
          }
          onClick={handleAddOption}
        >
          <PlusIcon className={"size-4 rounded-full border border-gray-900"} />
          <span>Add option like size or color</span>
        </div>
      )}

      {optionList.length > 1 && (
        <div className={"flex items-center gap-2 mt-4"}>
          <label>Group by</label>
          <Select
            value={groupById || undefined}
            onValueChange={handleChangeGroupId}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Option name" />
            </SelectTrigger>
            <SelectContent>
              {optionList.map((option) => {
                return (
                  <SelectItem key={option.id} value={option.id || ""}>
                    {option.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {groupByOption && productVariants.length > 0 && (
        <ProductVariantTable
          groupByOption={groupByOption}
          productVariants={productVariants}
        />
      )}
    </div>
  );
}

export default ProductVariantForm;
