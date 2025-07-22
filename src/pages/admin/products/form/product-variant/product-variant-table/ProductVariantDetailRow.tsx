import { ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { ProductVariant } from "@/dto/product/product-variant.ts";
import { ProductOptionValue } from "@/pages/admin/products/form/product-variant/product-option-form/product-options-form-types.ts";
import { ChangeEvent, KeyboardEvent } from "react";

interface ProductVariantDetailRowProps {
  variant: ProductVariant;
  groupByOptionValue: ProductOptionValue;
  onChangeQuantity: (id: string, q: number) => void;
  onChangePrice: (id: string, price: number) => void;
}

function ProductVariantDetailRow({
  variant,
  groupByOptionValue,
  onChangeQuantity,
  onChangePrice,
}: ProductVariantDetailRowProps) {
  function handleChangeQuantity(e: ChangeEvent<HTMLInputElement>) {
    onChangeQuantity(variant.id!, Number(e.target.value));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!/\d/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  }

  function handleChangePrice(e: ChangeEvent<HTMLInputElement>) {
    const price = Number(e.target.value);
    onChangePrice(variant.id!, price);
  }

  return (
    <div
      key={variant.specs.map((v) => v.optionValueName).join("-")}
      className={"flex items-center gap-2 hover:bg-gray-100 pl-8 pr-2 py-1"}
    >
      <div className={"basis-1/2 flex gap-2  items-center"}>
        <div
          className={
            "size-10 border rounded-sm border-dashed border-gray-300 flex items-center justify-center"
          }
        >
          <ImagePlus className={"size-3 text-blue-800"} />
        </div>
        <div>
          <div className={"text-sm"}>
            {variant.specs
              .filter((s) => s.optionValueName !== groupByOptionValue.name)
              .map((spec) => spec.optionValueName)
              .join(" / ")}
          </div>
        </div>
      </div>

      <Input
        className={"basis-1/3"}
        placeholder={"price"}
        value={variant.price}
        onKeyDown={handleKeyDown}
        onChange={handleChangePrice}
      />

      <Input
        className={"basis-1/6"}
        placeholder={"available"}
        value={variant.quantity}
        onChange={handleChangeQuantity}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default ProductVariantDetailRow;
