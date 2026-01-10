import { supabaseAdmin } from './supabaseClient';

export function generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${timestamp}-${randomString}-${sanitizedName}`;
}

/**
 * Upload file ke Supabase Storage
 * @param bucket - Nama bucket (contoh: 'events')
 * @param file - File object atau Buffer
 * @param filePath - Path file di dalam bucket (opsional, akan di-generate jika tidak ada)
 * @returns Object berisi success status, publicUrl, dan filePath
 */
export async function uploadFile(
    bucket: string,
    file: File | Buffer,
    filePath?: string
): Promise<{ success: boolean; publicUrl?: string; filePath?: string; error?: string }> {
    try {
        // Generate unique file name jika tidak ada filePath
        let fileName = filePath;
        if (!fileName) {
            if (file instanceof File) {
                fileName = generateUniqueFileName(file.name);
            } else {
                fileName = generateUniqueFileName(`file-${Date.now()}.bin`);
            }
        }

        // Convert File to ArrayBuffer jika perlu
        let fileData: ArrayBuffer | Buffer;
        if (file instanceof File) {
            fileData = await file.arrayBuffer();
        } else {
            fileData = file;
        }

        // Upload file ke Supabase Storage
        const { data, error } = await supabaseAdmin.storage
            .from(bucket)
            .upload(fileName, fileData, {
                contentType: file instanceof File ? file.type : 'application/octet-stream',
                upsert: false, // Jangan overwrite file yang sudah ada
            });

        if (error) {
            console.error('Error uploading file to Supabase:', error);
            return { success: false, error: error.message };
        }

        // Dapatkan public URL
        const { data: urlData } = supabaseAdmin.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return {
            success: true,
            publicUrl: urlData.publicUrl,
            filePath: fileName,
        };
    } catch (error) {
        console.error('Unexpected error uploading file:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Hapus file dari Supabase Storage
 * @param bucket - Nama bucket
 * @param filePath - Path file di dalam bucket
 * @returns Object berisi success status
 */
export async function deleteFile(
    bucket: string,
    filePath: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabaseAdmin.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error('Error deleting file from Supabase:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Unexpected error deleting file:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Dapatkan public URL untuk mengakses file
 * @param bucket - Nama bucket
 * @param filePath - Path file di dalam bucket
 * @returns Public URL
 */
export function getPublicUrl(bucket: string, filePath: string): string {
    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
}

/**
 * Extract file path dari Supabase public URL
 * @param publicUrl - Public URL dari Supabase Storage
 * @param bucket - Nama bucket
 * @returns File path atau null jika tidak valid
 */
export function extractFilePathFromUrl(publicUrl: string, bucket: string): string | null {
    try {
        // Format URL: https://[project].supabase.co/storage/v1/object/public/[bucket]/[filepath]
        const urlPattern = new RegExp(`/storage/v1/object/public/${bucket}/(.+)$`);
        const match = publicUrl.match(urlPattern);
        return match ? match[1] : null;
    } catch (error) {
        console.error('Error extracting file path from URL:', error);
        return null;
    }
}