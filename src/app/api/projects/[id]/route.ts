import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { hasCloudinaryEnv, hasSupabaseAdminEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { projectSchema } from "@/lib/validations";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await assertAdmin())) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  if (!hasSupabaseAdminEnv) return NextResponse.json({ message: "Supabase غير مربوط" }, { status: 503 });
  const { id } = await params;
  const parsed = projectSchema.partial().safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "بيانات غير صحيحة" }, { status: 400 });
  const supabase = createAdminClient();
  const { data: previous } = await supabase
    .from("projects")
    .select("cloudinary_public_id, cloudinary_resource_type")
    .eq("id", id)
    .maybeSingle();
  const { data, error } = await supabase.from("projects").update(parsed.data).eq("id", id).select("*, category:categories(id,name,slug)").single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  if (
    previous?.cloudinary_public_id &&
    parsed.data.cloudinary_public_id &&
    previous.cloudinary_public_id !== parsed.data.cloudinary_public_id &&
    hasCloudinaryEnv
  ) {
    try {
      await deleteCloudinaryAsset(
        previous.cloudinary_public_id,
        previous.cloudinary_resource_type === "video" ? "video" : "image",
      );
    } catch (cloudinaryError) {
      console.error("Old Cloudinary asset cleanup failed", cloudinaryError);
    }
  }

  revalidatePath("/");
  revalidatePath("/gallery");
  return NextResponse.json({ project: data });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await assertAdmin())) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  if (!hasSupabaseAdminEnv) return NextResponse.json({ message: "Supabase غير مربوط" }, { status: 503 });
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: project } = await supabase.from("projects").select("cloudinary_public_id, cloudinary_resource_type").eq("id", id).maybeSingle();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  if (project?.cloudinary_public_id && hasCloudinaryEnv) {
    try {
      await deleteCloudinaryAsset(project.cloudinary_public_id, project.cloudinary_resource_type === "video" ? "video" : "image");
    } catch (cloudinaryError) {
      console.error("Cloudinary cleanup failed", cloudinaryError);
    }
  }
  revalidatePath("/");
  revalidatePath("/gallery");
  return NextResponse.json({ success: true });
}
