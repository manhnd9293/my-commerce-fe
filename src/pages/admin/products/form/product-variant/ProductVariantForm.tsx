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
import {
  ProductVariantSpecs,
  SingleSpec,
} from "@/dto/product/product-variant-specs.ts";
import { ProductVariant } from "@/dto/product/product-variant.ts";
import { ProductVariantFormContext } from "@/pages/admin/products/form/product-variant/ProductVariantFormContext.ts";
import { Product } from "@/dto/product/product.ts";

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

function getUpdateProductVariantOnChangeOptionList(
  newOptionList: ProductOption[],
  initialData: Product,
) {
  const initialProductVariants = initialData.productVariants || [];
  const optionIdToOption = newOptionList.reduce<{
    [key: string]: ProductOption;
  }>((map, option) => {
    map[option.id!] = option;
    return map;
  }, {});
  const currentOptionId = new Set();
  let currentProductVariants = structuredClone(initialProductVariants);
  const deleteOptionValueIdSet = new Set<string>();
  const deleteOptionIdSet = new Set<string>();

  /* update option name and option value name in spec field of product variant */
  for (const pv of currentProductVariants) {
    const specs = pv.specs;
    for (const spec of specs) {
      const optionId = spec.optionId;
      currentOptionId.add(optionId);
      const updateOption = optionIdToOption[optionId];

      if (!updateOption) {
        deleteOptionIdSet.add(optionId);
        continue;
      }

      spec.optionName = updateOption.name;
      const updateOptionValue = updateOption.optionValues!.find(
        (v) => v.id === spec.optionValueId,
      );
      if (!updateOptionValue) {
        deleteOptionValueIdSet.add(spec.optionValueId);
        continue;
      }
      spec.optionValueName = updateOptionValue.name;
    }
  }
  console.log({ deleteOptionValueIdSet });
  currentProductVariants = currentProductVariants.filter(
    (pv) =>
      !pv.specs.some((spec) => deleteOptionValueIdSet.has(spec.optionValueId)),
  );

  /* add variants of existing options but have new option values */
  const existingOptions = newOptionList.filter((op) => !op.isNew);
  const optionsWithNewOptionValue = existingOptions.filter((op) => {
    return op.optionValues?.some((ov) => ov.isNew);
  });
  const productVariantsFromNewOption = [];
  for (const option of optionsWithNewOptionValue) {
    /*Get a list of product variants specs from options other than current looping option*/
    const otherOptions = existingOptions.filter((op) => op.id !== option.id);
    let otherProductVariantSpecs: ProductVariantSpecs[] = [[]];

    for (const option of otherOptions) {
      const next: ProductVariantSpecs[] = [];
      for (const ov of option.optionValues!) {
        for (const spec of otherProductVariantSpecs) {
          next.push([
            ...structuredClone(spec),
            {
              optionId: option.id!,
              optionName: option.name,
              optionValueId: ov.id!,
              optionValueName: ov.name,
            },
          ]);
        }
      }
      otherProductVariantSpecs = next;
    }

    /*Create product variants from new option values and specs created by other options*/
    const newOptionValues = option.optionValues?.filter((ov) => ov.isNew) || [];
    for (const newOptionValue of newOptionValues) {
      for (const productVariantSpec of otherProductVariantSpecs) {
        const pv: ProductVariant = {
          id: uuidV4(),
          productId: initialData.id!,
          quantity: 0,
          price: 0,
          isNew: true,
          specs: [
            {
              optionId: option.id!,
              optionName: option.name,
              optionValueId: newOptionValue.id!,
              optionValueName: newOptionValue.name,
            },
            ...productVariantSpec,
          ],
        };
        productVariantsFromNewOption.push(pv);
      }
    }
  }

  /* create new variants from existing variants and new options */
  const newOptionIds = Object.keys(optionIdToOption).filter(
    (id) => !currentOptionId.has(id),
  );

  if (newOptionIds.length === 0) {
    return [...currentProductVariants, ...productVariantsFromNewOption];
  }

  let updateVariants = [
    ...currentProductVariants,
    ...productVariantsFromNewOption,
  ];
  for (const newOptionId of newOptionIds) {
    const newOption = optionIdToOption[newOptionId];
    const next = [];
    for (const variant of updateVariants) {
      for (let index = 0; index < newOption.optionValues!.length; index++) {
        const optionValue = newOption.optionValues![index];
        const newSpec = {
          optionId: newOptionId,
          optionName: newOption.name,
          optionValueId: optionValue.id!,
          optionValueName: optionValue.name,
        };
        const cloneVariant = structuredClone(variant);
        cloneVariant.specs.push(newSpec);

        if (index !== 0) {
          cloneVariant.id = uuidV4();
          cloneVariant.quantity = 0;
        }
        next.push(cloneVariant);
      }
    }
    updateVariants = next;
  }

  return updateVariants;
}

type ProductVariantFormProps = {
  productVariants: ProductVariant[];
  options: ProductOption[];
  onUpdateOptions: (options: ProductOption[]) => void;
  onUpdateProductVariants: (productVariants: ProductVariant[]) => void;
  initialData: Product | undefined;
};

function ProductVariantForm({
  productVariants,
  options,
  onUpdateOptions,
  onUpdateProductVariants,
  initialData,
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
    const newId = uuidV4();
    const newOption = {
      name: "",
      id: newId,
      isNew: true,
      productId: initialData ? initialData.id! : undefined,
      position: options.length,
    };
    onUpdateOptions([...options, newOption]);
    setCollapseOptionForm((prev) => ({ ...prev, [newId]: false }));
  }

  function onDeleteOptionForm(id: string) {
    const updateOptions = structuredClone(options).filter(
      (option) => option.id !== id,
    );
    updateOptions.forEach((option, index) => {
      option.position = index;
    });
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
    cloneOptionList[index] = {
      ...cloneOptionList[index],
      name,
      optionValues,
    };
    onUpdateOptions(cloneOptionList);

    if (cloneOptionList.length === 1 && cloneOptionList[0].id) {
      setGroupById(cloneOptionList[0].id);
    }

    const updateProductVariants = initialData
      ? getUpdateProductVariantOnChangeOptionList(cloneOptionList, initialData)
      : getProductVariants(cloneOptionList);
    onUpdateProductVariants(updateProductVariants);
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

        {groupByOption && productVariants && productVariants.length > 0 && (
          <ProductVariantTable
            groupByOption={groupByOption}
            productVariants={productVariants}
            options={options}
          />
        )}
      </div>
    </ProductVariantFormContext.Provider>
  );
}

export default ProductVariantForm;
