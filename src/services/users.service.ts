import { SignInDto } from "@/dto/auth/sign-in.dto.ts";
import httpClient from "@/http-client/http-client.ts";

class UsersService {
  signUp(signInDto: SignInDto) {
    return httpClient.post("/users", signInDto);
  }

  me() {
    return httpClient.get("/users/me");
  }

  uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);
    return httpClient.patch("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new UsersService();
