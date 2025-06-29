import { PlusIcon } from "lucide-react";
import { useState } from "react";
import ProductOptionForm from "@/pages/admin/products/form/product-variant/product-option-form/ProductOptionForm.tsx";
import { v4 as uuidV4 } from "uuid";
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
import { ProductVariantFormContext } from "@/pages/admin/products/form/product-variant/ProductVariantFormContext.ts";

function getProductVariants(optionList: ProductOption[]): ProductVariant[] {
  if (optionList.length === 0) return [];

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
      id: uuidV4(),
    };
  });

  return productVariants;
}

type ProductVariantFormProps = {
  productVariants: ProductVariant[];
  options: ProductOption[];
  onUpdateOptions: (options: ProductOption[]) => void;
  onUpdateProductVariants: (productVariants: ProductVariant[]) => void;
};

function ProductVariantForm({
  productVariants,
  options,
  onUpdateOptions,
  onUpdateProductVariants,
}: ProductVariantFormProps) {
  const [groupById, setGroupById] = useState<string | null>(
    options.length > 0 && options[0].id ? options[0].id : null,
  );
  const [collapseOptionForm, setCollapseOptionForm] = useState<{
    [key: string]: boolean;
  }>(
    options.reduce<{ [key: string]: boolean }>((map, option) => {
      map[option.id!] = true;
      return map;
    }, {}),
  );

  function handleAddOption() {
    onUpdateOptions([...options, { name: "", id: uuidV4(), isNew: true }]);
  }

  function onDeleteOptionForm(id: string) {
    const updateOptions = structuredClone(options).filter(
      (option) => option.id !== id,
    );
    onUpdateOptions(updateOptions);
    const productVariants = getProductVariants(updateOptions);

    onUpdateProductVariants(productVariants);
  }

  function handleUpdateOptionForm(data: {
    index: number;
    updateValues: z.infer<typeof optionFormSchema>;
  }) {
    const { index, updateValues } = data;
    const { name, optionValues } = updateValues;
    const cloneOptionList: ProductOption[] = structuredClone(options);
    const item: ProductOption = {
      ...cloneOptionList[index],
      name,
      optionValues,
    };
    cloneOptionList[index] = item;
    onUpdateOptions(cloneOptionList);

    if (cloneOptionList.length === 1 && cloneOptionList[0].id) {
      setGroupById(cloneOptionList[0].id);
    }
    const productVariants = getProductVariants(cloneOptionList);

    onUpdateOptions(cloneOptionList);
    onUpdateProductVariants(productVariants);
  }

  function handleProductVariantUpdate(updateProductVariants: ProductVariant[]) {
    const allVariantsClone = structuredClone(productVariants);
    const updateIdToProductVariant = updateProductVariants.reduce(
      (acc: Map<string, ProductVariant>, currentVariant: ProductVariant) => {
        acc.set(currentVariant.id!, currentVariant);
        return acc;
      },
      new Map<string, ProductVariant>(),
    );
    const allVariantsUpdate = allVariantsClone.map((pv) => {
      return updateIdToProductVariant.has(pv.id!)
        ? updateIdToProductVariant.get(pv.id!)!
        : pv;
    });

    onUpdateProductVariants(allVariantsUpdate);
  }

  const groupByOption = options.find((op) => op.id === groupById);

  function handleChangeGroupId(value: string) {
    setGroupById(value);
  }

  function updateOptionFormCollapse(optionId: string, value: boolean) {
    if (collapseOptionForm[optionId] === undefined) {
      throw new Error("Invalid option id");
    }
    setCollapseOptionForm({
      ...collapseOptionForm,
      [optionId]: value,
    });
  }

  return (
    <ProductVariantFormContext.Provider value={{ handleProductVariantUpdate }}>
      <div className={"flex flex-col border p-4 rounded-md"}>
        {options.map((option, index) => {
          return (
            <div key={index}>
              <ProductOptionForm
                data={option}
                onDelete={onDeleteOptionForm}
                onUpdate={handleUpdateOptionForm}
                index={index}
                collapse={collapseOptionForm[option.id!]}
                updateCollapse={updateOptionFormCollapse}
              />
              {index !== options.length - 1 && (
                <div
                  className={
                    "w-[calc(100%+var(--spacing))] -mx-4 bg-slate-300 h-[1px] my-4"
                  }
                />
              )}
            </div>
          );
        })}
        {options.length < 3 && (
          <div
            className={
              "flex items-center hover:bg-gray-100 p-2 rounded-sm cursor-pointer gap-2"
            }
            onClick={handleAddOption}
          >
            <PlusIcon
              className={"size-4 rounded-full border border-gray-900"}
            />
            <span>Add option like size or color</span>
          </div>
        )}

        {options.length > 1 && (
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
                {options.map((option) => {
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
    </ProductVariantFormContext.Provider>
  );
}

export default ProductVariantForm;
