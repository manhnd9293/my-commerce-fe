import { BaseDto } from "@/dto/base.dto.ts";
import { Asset } from "@/dto/asset.ts";

export interface Category extends BaseDto {
  name: string;

  imageFileId?: number | null;

  imageFile?: Asset | null;

  imageFileUrl?: string | null;
}
