import { supabase } from "@/integrations/supabase/client";

export const uploadFile = async (
  file: File,
  bucket: "avatars" | "medical_documents",
  userId: string
): Promise<{ url: string; path: string } | null> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

export const deleteFile = async (
  bucket: "avatars" | "medical_documents",
  path: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(file.type);
};

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];
