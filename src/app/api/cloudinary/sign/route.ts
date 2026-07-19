import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";
import { configureCloudinary } from "@/lib/cloudinary";
import { hasCloudinaryEnv } from "@/lib/env";

export async function POST(request: NextRequest) {
  if (!(await assertAdmin())) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  if (!hasCloudinaryEnv) return NextResponse.json({ message: "Cloudinary غير مربوط بعد" }, { status: 503 });

  const body = (await request.json().catch(() => ({}))) as { resourceType?: string };
  const resourceType = body.resourceType === "video" ? "video" : "image";
  const timestamp = Math.round(Date.now() / 1000);
  const folder = `shoaa/projects/${resourceType}`;
  const cloudinary = configureCloudinary();
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    resourceType,
  });
}
