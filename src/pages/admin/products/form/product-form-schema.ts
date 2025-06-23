import { z } from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please provide product name",
    })
    .max(255),
  productMedia: z.string().array().optional(),
  price: z.number().optional(),
  description: z.string().max(50000).optional(),
  categoryId: z.string({ message: "Please provide category information" }),
  productSizes: z
    .object({
      name: z.string(),
      id: z.string().optional().nullable(),
    })
    .array()
    .optional(),
  productColors: z
    .object({
      name: z.string().min(1, { message: "Product color required" }),
      code: z.string(),
      id: z.string().optional().nullable(),
    })
    .array()
    .optional(),
});
