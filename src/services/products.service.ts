import httpClient from '@/http-client/http-client.ts';
import { CreateProductDto } from '@/dto/product/create-product.dto.ts';
import { Product } from '@/dto/product/product.ts';

class ProductsService {
  async create(data: CreateProductDto) {
    const product = await httpClient.post('/products', data) as Product;

    const images = data.images;
    const formData = new FormData();
    Array.from(images).forEach(item =>  formData.append('productImages', item))
    return httpClient.patch(`/products/${product.id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  getAll() {
    return httpClient.get('/products');
  }
}

export default new ProductsService();