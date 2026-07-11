"use server";

import { requireRole } from "@/app/auth/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const ALLOWED_MIMES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Upload a content image to Supabase Storage.
 * Returns the public URL for embedding in step markdown.
 *
 * Validates: MIME type, max size, admin role.
 */
export async function uploadContentImage(formData: FormData) {
  await requireRole(["admin", "super_admin"]);

  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided." };

  // Validate MIME
  if (!ALLOWED_MIMES.includes(file.type)) {
    return { error: `Invalid file type: ${file.type}. Allowed: PNG, JPEG, WebP, GIF.` };
  }

  // Validate size
  if (file.size > MAX_SIZE) {
    return { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max: 5MB.` };
  }

  // Generate unique filename
  const ext = file.name.split(".").pop() || "png";
  const filename = `content/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const supabase = await createServerSupabaseClient();
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from("content-assets")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return { error: `Upload failed: ${error.message}` };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("content-assets")
      .getPublicUrl(filename);

    return { url: urlData.publicUrl };
  } catch (e: any) {
    return { error: `Upload error: ${e.message}` };
  }
}
