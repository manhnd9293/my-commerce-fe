import httpClient from "@/http-client/http-client.ts";
import { Category } from "@/dto/category/category.ts";
import { UpdateCategoryDto } from "@/dto/category/update-category.dto.ts";

class CategoriesService {
  create(name: string, image: File): Promise<Category> {
    const formData = new FormData();
    formData.set("name", name);
    formData.set("image", image);
    return httpClient.post("/categories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  update(id: string, category: UpdateCategoryDto): Promise<Category> {
    const formData = new FormData();
    formData.set("name", category.name);
    category.updateImage && formData.set("updateImage", category.updateImage);
    return httpClient.put(`/categories/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  getAll(): Promise<Category[]> {
    return httpClient.get("/categories");
  }

  getById(id: string): Promise<Category> {
    return httpClient.get(`/categories/${id}`);
  }

  delete(ids: string[]): Promise<Category> {
    return httpClient.delete(`/categories/`, {
      data: { ids },
    });
  }
}

export default new CategoriesService();
