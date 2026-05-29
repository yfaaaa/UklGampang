import type { Metadata } from "next";
import { Toaster } from "sonner"; // 👈 Import toaster untuk notifikasi

export const metadata: Metadata = {
  title: "Sistem Manajemen Restoran",
  description: "Aplikasi Front-End UKL Kuliner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {/* Notifikasi toast ditaruh di sini agar aktif di seluruh halaman */}
        <Toaster position="top-center" richColors /> 
        
        {children}
      </body>
    </html>
  );
}