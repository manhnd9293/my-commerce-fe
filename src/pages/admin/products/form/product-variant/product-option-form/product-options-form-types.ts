import { z } from "zod";
import { ProductVariant } from "@/dto/product/product-variant.ts";

export const optionFormSchema = z.object({
  name: z.string().min(1, {
    message: "Option name must be at least 1 characters.",
  }),
  optionValues: z
    .object({
      id: z.string().optional().nullable(),
      name: z
        .string()
        .min(1, { message: "Option value must be at least 1 character" }),
      empty: z.boolean().optional().nullable(),
    })
    .array()
    .refine(
      (listValues) => {
        const set = new Set();
        for (const val of listValues) {
          if (set.has(val.name)) {
            return false;
          }
          set.add(val.name);
        }
        return true;
      },
      {
        message: "Option value exist",
      },
    )
    .refine(
      (listValues) => {
        return !listValues.some(
          (v, i) => v.name === "" && i !== listValues.length - 1,
        );
      },
      {
        message: "Some value is empty",
      },
    ),
});

export type ProductOptionFormProps = {
  data: ProductOption;
  onDelete: (id: string) => void;
  onUpdate: (data: {
    updateValues: z.infer<typeof optionFormSchema>;
    index: number;
  }) => void;
  index: number;
  collapse: boolean;
  updateCollapse: (id: string, updateValue: boolean) => void;
};

export interface ProductOption {
  id?: string | null;
  name: string;
  optionValues?: ProductOptionValue[] | null;
  isNew?: boolean;
}

export interface ProductOptionValue {
  id?: string | null;
  name: string;
  productOptionId?: string | null;
}

export type ProductVariantFormUpdateData = {
  options: ProductOption[];
  productVariants: ProductVariant[];
};
