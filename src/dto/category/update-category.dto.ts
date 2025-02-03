import { Category } from "@/dto/category/category.ts";

export interface UpdateCategoryDto extends Pick<Category, "name"> {
  updateImage?: File;
}
