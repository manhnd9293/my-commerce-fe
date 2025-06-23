import { Input } from "@/components/ui/input.tsx";
import { ProductOptionValue } from "@/pages/admin/products/form/product-variant/product-option-form/product-options-form-types.ts";
import { ChangeEvent, useState } from "react";
import { ChevronDown, ChevronUp, ImagePlus } from "lucide-react";
import { ProductVariant } from "@/dto/product/product-variant.ts";
import ProductVariantDetailRow from "@/pages/admin/products/form/product-variant/product-variant-table/ProductVariantDetailRow.tsx";
import Utils from "@/utils/utils.ts";

interface ProductVariantTableRowProps {
  groupByOptionValue: ProductOptionValue;
  productVariants: ProductVariant[];
}

function ProductVariantTableRow({
  groupByOptionValue,
  productVariants,
}: ProductVariantTableRowProps) {
  const [collapse, setCollapse] = useState(true);
  const [groupPrice, setGroupPrice] = useState<string | number>(0);

  const [quantityMap, setQuantityMap] = useState<{ [key: string]: number }>(
    productVariants.reduce((acc: { [key: string]: number }, pv) => {
      const key = Utils.getProductVariantSpecsString(pv);
      acc[key] = pv.quantity;
      return acc;
    }, {}),
  );

  const [priceMap, setPriceMap] = useState<{ [key: string]: number }>(
    productVariants.reduce((acc: { [key: string]: number }, pv) => {
      const key = Utils.getProductVariantSpecsString(pv);
      acc[key] = pv.price;
      return acc;
    }, {}),
  );

  const totalAvailable = Object.values(quantityMap).reduce(
    (sum, quantity) => sum + quantity,
    0,
  );

  function handleRowClick() {
    if (productVariants.length > 1) {
      setCollapse((collapse) => !collapse);
    }
  }

  function handleChangeQuantity(specString: string, quantity: number) {
    setQuantityMap({
      ...quantityMap,
      [specString]: quantity,
    });
  }

  function handleChangePrice(specString: string, price: number) {
    const updatePriceMap = {
      ...priceMap,
      [specString]: price,
    };
    setPriceMap(updatePriceMap);

    const minPrice = Math.min(...Object.values(updatePriceMap));
    const maxPrice = Math.max(...Object.values(updatePriceMap));
    const priceRange =
      minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`;
    setGroupPrice(priceRange);
  }

  function handleChangeGroupPrice(e: ChangeEvent<HTMLInputElement>) {
    const newPrice = Number(e.target.value);
    const clonePriceMap = structuredClone(priceMap);
    for (const key of Object.keys(priceMap)) {
      clonePriceMap[key] = newPrice;
    }

    setPriceMap(clonePriceMap);
    setGroupPrice(newPrice);
  }

  function handleGroupPriceBlur() {
    if (typeof groupPrice === "number") {
      return;
    }
    const minPrice = Math.min(...Object.values(priceMap));
    const maxPrice = Math.max(...Object.values(priceMap));
    const priceRange =
      minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`;
    setGroupPrice(priceRange);
  }

  function onFocusGroupPrice() {
    if (typeof groupPrice === "number") {
      return;
    }

    setGroupPrice("");
  }

  return (
    <div>
      <div
        className={
          "flex items-center gap-2 hover:bg-gray-100 p-2 cursor-pointer"
        }
        onClick={handleRowClick}
      >
        <div className={"basis-1/2 flex gap-2"}>
          <div
            className={
              "size-12 border rounded-sm border-dashed border-gray-300 flex items-center justify-center"
            }
          >
            <ImagePlus className={"size-4 text-blue-800"} />
          </div>
          <div>
            <div>{groupByOptionValue.name}</div>
            <div className={"flex items-center gap-1"}>
              <div className={"text-gray-500 text-sm"}>
                {productVariants.length} variants
              </div>
              {collapse ? (
                <ChevronDown className={"size-4"} />
              ) : (
                <ChevronUp className={"size-4"} />
              )}
            </div>
          </div>
        </div>

        <Input
          className={"basis-1/3"}
          placeholder={"price"}
          onClick={(e) => {
            e.stopPropagation();
          }}
          value={groupPrice}
          onChange={handleChangeGroupPrice}
          onKeyDown={Utils.handleKeyDownAllowNumberOnly}
          onFocus={onFocusGroupPrice}
          onBlur={handleGroupPriceBlur}
        />

        <Input
          disabled={true}
          readOnly={true}
          value={totalAvailable}
          className={"basis-1/6 bg-gray-300 text-black"}
          placeholder={"available"}
        />
      </div>

      {!collapse && (
        <div className={"flex flex-col gap-2"}>
          {productVariants.map((variant) => {
            const specString = Utils.getProductVariantSpecsString(variant);
            return (
              <ProductVariantDetailRow
                key={specString}
                variant={variant}
                groupByOptionValue={groupByOptionValue}
                onChangeQuantity={handleChangeQuantity}
                quantity={quantityMap[specString]}
                price={priceMap[specString]}
                onChangePrice={handleChangePrice}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductVariantTableRow;
