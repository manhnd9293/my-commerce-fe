import httpClient from '@/http-client/http-client.ts';
import { CreateProductDto } from '@/dto/product/create-product.dto.ts';

class ProductsService {
  create(data: CreateProductDto) {
    return httpClient.post('/products', data)
  }
}

export default new ProductsService();