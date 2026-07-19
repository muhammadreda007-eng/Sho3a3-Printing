export const hasSupabasePublicEnv = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

export const hasSupabaseAdminEnv = Boolean(
  hasSupabasePublicEnv && process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export const hasCloudinaryEnv = Boolean(
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);
