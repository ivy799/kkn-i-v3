export default function supabaseLoader({ src, width, quality }: {
    src: string;
    width: number;
    quality?: number;
}) {
    // For Supabase storage URLs, return them as-is
    // This bypasses Next.js image optimization and the private IP check
    return src;
}
