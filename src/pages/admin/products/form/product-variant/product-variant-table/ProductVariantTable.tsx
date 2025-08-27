import { ProductOption } from "@/pages/admin/products/form/product-variant/product-option-form/product-options-form-types.ts";
import ProductVariantTableRow from "@/pages/admin/products/form/product-variant/product-variant-table/ProductVariantTableRow.tsx";
import { ProductVariant } from "@/dto/product/product-variant.ts";

interface ProductVariantTableProps {
  groupByOption: ProductOption;
  productVariants: ProductVariant[];
  options: ProductOption[];
}

function ProductVariantTable({
  groupByOption,
  productVariants,
  options,
}: ProductVariantTableProps) {
  const idToPosition = options.reduce<{ [key: string]: number }>(
    (map, option) => {
      map[`op-${option.id}`] = option.position;
      option.optionValues?.forEach((ov) => {
        map[`opv-${ov.id}`] = ov.position;
      });
      return map;
    },
    {},
  );
  return (
    <div className={"mt-4 -mx-4"}>
      <div className={"flex items-center mb-2 bg-gray-200 px-4 py-2 pt-1"}>
        <span className={"basis-1/2 text-gray-600"}>Variant</span>
        <span className={"basis-1/3 text-gray-600"}>Price</span>
        <span className={"basis-1/6 text-gray-600"}>Available</span>
      </div>

      <div className={"flex flex-col gap-2"}>
        {groupByOption.optionValues!.map((groupByOptionValue) => {
          const variantsInGroup = productVariants.filter((pv) =>
            pv.specs.some(
              (spec) =>
                spec.optionValueName === groupByOptionValue.name &&
                spec.optionName === groupByOption.name,
            ),
          );
          variantsInGroup.forEach((pv) => {
            pv.specs = pv.specs.sort((specA, specB) => {
              return idToPosition[`op-${specA.optionId}`] <
                idToPosition[`op-${specB.optionId}`]
                ? -1
                : 1;
            });
          });

          const sortVariants = variantsInGroup.sort((pvA, pvB) => {
            for (let i = 0; i < pvB.specs.length; i++) {
              if (pvA.specs[i].optionValueId !== pvB.specs[i].optionValueId) {
                const optionValuePositionA =
                  idToPosition[`opv-${pvA.specs[i].optionValueId}`];
                const optionValuePositionB =
                  idToPosition[`opv-${pvB.specs[i].optionValueId}`];

                return optionValuePositionA < optionValuePositionB ? -1 : 1;
              }
            }
            return 1;
          });

          return (
            <ProductVariantTableRow
              key={groupByOptionValue.id!}
              productVariants={sortVariants}
              groupByOptionValue={groupByOptionValue}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProductVariantTable;
