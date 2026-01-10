# Environment Variables untuk Supabase Storage

Tambahkan environment variables berikut ke file `.env` Anda:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Cara Mendapatkan Kredensial Supabase

1. **Login ke Supabase Dashboard**
   - Buka https://app.supabase.com
   - Login dengan akun Anda

2. **Pilih Project atau Buat Baru**
   - Jika sudah ada project, pilih project yang ingin digunakan
   - Jika belum, klik "New Project" dan ikuti wizard setup

3. **Dapatkan API Keys**
   - Di dashboard project, klik icon ⚙️ (Settings) di sidebar
   - Pilih menu **API**
   - Copy nilai berikut:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

## Setup Storage Bucket

Setelah menambahkan environment variables, Anda perlu membuat bucket storage:

1. **Buka Storage di Supabase Dashboard**
   - Di sidebar, klik **Storage**

2. **Create New Bucket**
   - Klik tombol **"Create a new bucket"** atau **"New bucket"**
   - Isi form:
     - **Name**: `events`
     - **Public bucket**: ✅ **Centang** (agar gambar bisa diakses publik)
     - **File size limit**: Biarkan default (50MB) atau sesuaikan kebutuhan
     - **Allowed MIME types**: Biarkan kosong atau isi `image/*` untuk hanya menerima gambar
   - Klik **"Create bucket"**

3. **Verifikasi Bucket**
   - Pastikan bucket `events` muncul di list
   - Status harus "Public"

## Testing

Setelah setup selesai, restart development server:

```bash
npm run dev
```

Kemudian test upload gambar event melalui dashboard aplikasi Anda.

## Troubleshooting

### Error: "Invalid API key"
- Pastikan environment variables sudah benar
- Restart development server setelah menambah/mengubah `.env`

### Error: "Bucket not found"
- Pastikan bucket `events` sudah dibuat di Supabase Dashboard
- Periksa nama bucket (case-sensitive)

### Gambar tidak bisa diakses (404)
- Pastikan bucket di-set sebagai **Public**
- Periksa Storage policies di Supabase Dashboard

### File upload gagal
- Cek file size limit di bucket settings
- Pastikan MIME type diizinkan
- Periksa quota storage di free plan (max 1GB)
