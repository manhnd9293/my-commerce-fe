import { SignInDto } from '@/dto/auth/sign-in.dto.ts';
import httpClient from '@/http-client/http-client.ts';

class AuthService {
  signIn(signInDto: SignInDto) {
    return httpClient.post('/auth/sign-in', signInDto);
  }

  signUp(signInDto: SignInDto) {
    return httpClient.post('/users', signInDto);
  }

  me() {
    return httpClient.get('/users/me');
  }
}

export default new AuthService();
