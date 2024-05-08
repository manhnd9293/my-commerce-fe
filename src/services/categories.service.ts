import httpClient from '@/http-client/http-client.ts';

class CategoriesService {
  create(name: string) {
    return httpClient.post('/categories', {
      name
    });
  }
  get() {
    return httpClient.get('/categories');
  }
}

export default new CategoriesService();