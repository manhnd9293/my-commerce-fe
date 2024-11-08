import { SignInDto } from "@/dto/auth/sign-in.dto.ts";
import httpClient from "@/http-client/http-client.ts";
import { UserDto } from "@/dto/user/user.dto.ts";

class AuthService {
  signIn(signInDto: SignInDto): Promise<UserDto> {
    return httpClient.post("/auth/sign-in", signInDto);
  }

  googleSignIn(googleToken: string): Promise<UserDto> {
    return httpClient.post("/auth/google-sign-in", { googleToken });
  }

  signUp(signInDto: SignInDto) {
    return httpClient.post("/users", signInDto);
  }

  me(): Promise<UserDto> {
    return httpClient.get("/users/me");
  }
}

export default new AuthService();
