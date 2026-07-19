import { v2 as cloudinary } from "cloudinary";
import { hasCloudinaryEnv } from "@/lib/env";

export function configureCloudinary() {
  if (!hasCloudinaryEnv) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return cloudinary;
}

export async function deleteCloudinaryAsset(
  publicId: string,
  resourceType: "image" | "video" = "image",
) {
  const client = configureCloudinary();
  return client.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  });
}
