import httpClient from '@/http-client/http-client.ts';
import { Product } from '@/dto/product/product.ts';
import { z } from 'zod';
import { productFormSchema } from '@/pages/admin/products/form/ProductForm.tsx';

class ProductsService {
  async create(data: z.infer<typeof productFormSchema>) {
    const product = await httpClient.post('/products', data) as Product;
    const images = data.newImages;
    const formData = new FormData();

    images && Array.from(images).forEach(item => formData.append('productImages', item));
    return httpClient.patch(`/products/${product.id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  getAll(): Promise<Product[]> {
    return httpClient.get('/products');
  }

  get(id: string): Promise<Product | null> {
    return httpClient.get(`/products/${id}`);
  }

  async update(updateProduct: z.infer<typeof productFormSchema>) {

    await httpClient.put(`/products`, updateProduct)

    const images = updateProduct.newImages;
    const formData = new FormData();
    images && Array.from(images).forEach(item => formData.append('productImages', item));
    return httpClient.patch(`/products/${updateProduct.id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default new ProductsService();