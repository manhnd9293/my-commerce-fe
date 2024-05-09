import httpClient from '@/http-client/http-client.ts';
import { Category } from '@/dto/category.ts';

class CategoriesService {
  create(name: string): Promise<Category> {
    return httpClient.post('/categories', {
      name
    });
  }

  update(id: number | undefined, category: Partial<Category>): Promise<Category> {
    if(!id) {
      throw Error('category id is required');
    }
    return httpClient.put(`/categories/${id}`, category );
  }

  getAll(): Promise<Category[]> {
    return httpClient.get('/categories');
  }

  getById(id: number | undefined): Promise<Category> {
    if (!id) {
      throw Error('category id is required');
    }
    return httpClient.get(`/categories/${id}`);
  }

  delete(ids: number[] | undefined): Promise<Category> {
    if (!ids) {
      throw Error('delete category ids is required');
    }
    return httpClient.delete(`/categories/`, {
      data: {ids}
    });
  }
}

export default new CategoriesService();