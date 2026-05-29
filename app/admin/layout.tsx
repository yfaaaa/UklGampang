"use client";

import { useRouter } from "next/navigation";
import { deleteCookie } from "@/lib/helper";
import { toast } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    function handleLogout() {
        deleteCookie("token"); // Hapus token dari cookie browser
        toast.success("Berhasil keluar dari sistem kasir");
        router.push("/login"); // Tendang kembali ke halaman login
    }

    return (
        <div>
            {/* NAVIGASI MENU UTAMA ADMIN / KASIR */}
            <nav style={{ backgroundColor: "#eaeaea", padding: "10px", display: "flex", gap: "15px" }}>
                <button onClick={() => router.push("/admin/menu")}>🍔 Kelola Menu</button>
                <button onClick={() => router.push("/admin/pesanan")}>📋 Pesanan Masuk</button>
                <button onClick={() => router.push("/admin/pembayaran")}>💳 Proses Pembayaran</button>
                <button onClick={handleLogout} style={{ color: "red", marginLeft: "auto" }}>🚪 Logout</button>
            </nav>

            <main style={{ padding: "20px" }}>
                {children}
            </main>
        </div>
    );
}