import httpClient from '@/http-client/http-client.ts';
import { Category } from '@/dto/category.ts';
import {SortingState} from "@tanstack/react-table";

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

  getPage(page: number, pageSize: number = 5, sorting: SortingState): Promise<{total: number, items: Category[]}> {
    let url = `/categories?page=${page}&pageSize=${pageSize}`;
    sorting.length > 0 && (url += `&sort=${sorting[0].id}&order=${sorting[0].desc ? 'desc' : 'asc'}`);
    return httpClient.get(url);
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