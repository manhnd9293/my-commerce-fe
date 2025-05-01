import { Asset } from "@/dto/asset.ts";
import httpClient from "@/http-client/http-client.ts";

export class MediaService {
  static getAllFiles(): Promise<Asset[]> {
    return httpClient.get("/media");
  }

  static uploadFile(files: FileList) {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    return httpClient.post("/media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}
