import httpClient from '@/http-client/http-client.ts';
import { CreateProductDto } from '@/dto/product/create-product.dto.ts';
import { Product } from '@/dto/product/product.ts';

class ProductsService {
  async create(data: CreateProductDto) {

    const product = await httpClient.post('/products', data) as Product;

    const images = data.newImages;
    const formData = new FormData();
    Array.from(images).forEach(item => formData.append('productImages', item));
    return httpClient.patch(`/products/${product.id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  getAll() {
    return httpClient.get('/products');
  }

  get(id: string): Promise<Product | null> {
    return httpClient.get(`/products/${id}`);
  }

  update(updateProduct: Partial<Product>, addFiles: FileList) {
    return httpClient.patch(`/products`, updateProduct)
  }
}

export default new ProductsService();