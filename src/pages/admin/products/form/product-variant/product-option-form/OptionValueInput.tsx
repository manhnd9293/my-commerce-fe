import { z } from "zod";
import { optionFormSchema } from "@/pages/admin/products/form/product-variant/product-option-form/product-options-form-types.ts";
import { ChangeEvent, KeyboardEvent, useRef } from "react";
import { Input } from "@/components/ui/input.tsx";
import { TrashIcon } from "lucide-react";

export function OptionValueInput({
  optionValue,
  onChange,
  onKeyDown,
  onBlur,
  index,
  onDelete,
}: {
  optionValue: z.infer<typeof optionFormSchema>["optionValues"][number];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onBlur: (v: { index: number; value: string }) => void;
  onDelete: (index: number) => void;
  index: number;
}) {
  const initialNameRef = useRef(optionValue.name);

  function onBlurInput() {
    if (optionValue.name !== "") {
      return;
    }
    const v = { index, value: initialNameRef.current };
    onBlur(v);
  }

  return (
    <div className={"relative"}>
      <Input
        placeholder={"Add another value"}
        value={optionValue.name}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlurInput}
      />
      {!optionValue.empty && (
        <TrashIcon
          className={
            "absolute right-2 top-2 size-5 text-gray-600 cursor-pointer"
          }
          onClick={() => onDelete(index)}
        />
      )}
    </div>
  );
}
