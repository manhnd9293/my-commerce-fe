import { Input } from "@/components/ui/input.tsx";
import { ProductOptionValue } from "@/pages/admin/products/form/product-variant/product-option-form/product-options-form-types.ts";
import { ChangeEvent, useContext, useState } from "react";
import { ChevronDown, ChevronUp, ImagePlus } from "lucide-react";
import { ProductVariant } from "@/dto/product/product-variant.ts";
import ProductVariantDetailRow from "@/pages/admin/products/form/product-variant/product-variant-table/ProductVariantDetailRow.tsx";
import Utils from "@/utils/utils.ts";
import { ProductVariantFormContext } from "@/pages/admin/products/form/product-variant/ProductVariantFormContext.ts";

interface ProductVariantTableRowProps {
  groupByOptionValue: ProductOptionValue;
  productVariants: ProductVariant[];
}

function ProductVariantTableRow({
  groupByOptionValue,
  productVariants,
}: ProductVariantTableRowProps) {
  const [collapse, setCollapse] = useState(true);
  const [groupPrice, setGroupPrice] = useState<string | number>(() => {
    const minPrice = Math.min(...productVariants.map((v) => v.price));
    const maxPrice = Math.max(...productVariants.map((v) => v.price));
    return minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`;
  });

  const context = useContext(ProductVariantFormContext);

  if (!context) {
    throw Error("Component must be in a product variant form context");
  }

  const handleProductVariantUpdate = context.handleProductVariantUpdate!;

  const totalAvailable = productVariants.reduce(
    (sum, variant) => sum + variant.quantity,
    0,
  );

  function handleRowClick() {
    if (productVariants.length > 1) {
      setCollapse((collapse) => !collapse);
    }
  }

  function handleChangeQuantity(productVariantId: string, quantity: number) {
    const updateVariant = productVariants.find(
      (pv) => pv.id === productVariantId,
    );
    if (!updateVariant) {
      throw Error("Invalid update variant");
    }

    handleProductVariantUpdate([
      { ...structuredClone(updateVariant), quantity },
    ]);
  }

  function handleChangePrice(productVariantId: string, price: number) {
    const updateVariant = productVariants.find(
      (pv) => pv.id === productVariantId,
    );
    if (!updateVariant) {
      throw Error("Invalid update variant");
    }

    const prices = productVariants.map((p) => {
      if (p.id !== productVariantId) {
        return p.price;
      }
      return price;
    });

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange =
      minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`;
    setGroupPrice(priceRange);

    handleProductVariantUpdate([{ ...structuredClone(updateVariant), price }]);
  }

  function handleChangeGroupPrice(e: ChangeEvent<HTMLInputElement>) {
    const newPrice = Number(e.target.value);

    setGroupPrice(newPrice);

    handleProductVariantUpdate(
      structuredClone(productVariants).map((pv) => ({
        ...pv,
        price: newPrice,
      })),
    );
  }

  function handleGroupPriceBlur() {
    if (typeof groupPrice === "number") {
      return;
    }
    const prices = productVariants.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
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
            return (
              <ProductVariantDetailRow
                key={variant.id}
                variant={variant}
                groupByOptionValue={groupByOptionValue}
                onChangeQuantity={handleChangeQuantity}
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
