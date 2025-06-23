import { ProductOption } from "@/pages/admin/products/form/product-variant/product-option-form/product-options-form-types.ts";
import ProductVariantTableRow from "@/pages/admin/products/form/product-variant/product-variant-table/ProductVariantTableRow.tsx";
import { ProductVariant } from "@/dto/product/product-variant.ts";
import Utils from "@/utils/utils.ts";

interface ProductVariantTableProps {
  groupByOption: ProductOption;
  productVariants: ProductVariant[];
}

function ProductVariantTable({
  groupByOption,
  productVariants,
}: ProductVariantTableProps) {
  return (
    <div className={"mt-4 -mx-4"}>
      <div className={"flex items-center mb-2 bg-gray-200 px-4 pt-1"}>
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
          return (
            <ProductVariantTableRow
              key={`${groupByOptionValue.name}-${variantsInGroup.map((v) => Utils.getProductVariantSpecsString(v)).join("+")}`}
              productVariants={variantsInGroup}
              groupByOptionValue={groupByOptionValue}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProductVariantTable;
