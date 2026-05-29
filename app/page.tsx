"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_BASE_URL } from "@/service/api";

interface Menu {
  id: number;
  nama: string;
  harga: number;
  deskripsi: string;
  image: string;
}

interface CartItem {
  menuId: number;
  nama: string;
  harga: number;
  jumlah: number;
}

export default function LandingPelangganPage() {
  const router = useRouter();
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Ambil data menu + Amankan gembok token otomatis lewat cookie browser
  async function fetchMenuPelanggan() {
    try {
      const token = typeof window !== "undefined" 
        ? document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1] 
        : null;

      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/menu`, { 
        method: "GET",
        headers: headers 
      });
      
      const data = await response.json();
      if (response.ok) {
        setMenuList(data.data || data || []);
      }
    } catch (error) {
      toast.error("Gagal mengambil daftar menu makanan");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { fetchMenuPelanggan(); }, []);

  // 2. Fungsi Logika Keranjang
  function masukKeranjang(item: Menu) {
    setCart((prevCart) => {
      const sudahAda = prevCart.find((cartItem) => cartItem.menuId === item.id);
      if (sudahAda) {
        return prevCart.map((cartItem) =>
          cartItem.menuId === item.id
            ? { ...cartItem, jumlah: cartItem.jumlah + 1 }
            : cartItem
        );
      }
      return [...prevCart, { menuId: item.id, nama: item.nama, harga: item.harga, jumlah: 1 }];
    });
    toast.success(`${item.nama} ditambah ke keranjang!`);
  }

  const totalHarga = cart.reduce((total, item) => total + item.harga * item.jumlah, 0);

  // 3. Fungsi Kirim Transaksi (Checkout)
  async function handleCheckoutPesanan() {
    if (cart.length === 0) {
      toast.warning("Keranjang belanja lo masih kosong!");
      return;
    }

    try {
      const dummyPelangganId = "1";
      const bodyPayload = {
        nomor_meja: "Meja No 3", 
        detail_pesanan: cart.map((item) => ({
          menuId: item.menuId,
          jumlah: item.jumlah,
        })),
      };

      const response = await fetch(`${API_BASE_URL}/pesanan?pelangganId=${dummyPelangganId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      if (response.ok) {
        toast.success("Pesanan sukses dikirim! Silakan bayar di kasir.");
        setCart([]); 
      } else {
        const errData = await response.json();
        toast.error(errData.message || "Gagal memproses pesanan");
      }
    } catch (error) {
      toast.error("Error jaringan saat mengirim transaksi pesanan");
    }
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "sans-serif", padding: "20px" }}>
      
      {/* Tombol Navigasi ke Halaman Login Kasir */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#1e293b", margin: 0, fontSize: "24px" }}>🍽️ RESTORAN KULINER UKL</h1>
        <button 
          onClick={() => router.push("/login")} 
          style={{ backgroundColor: "#64748b", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          Masuk Sebagai Kasir
        </button>
      </div>

      {/* CONTAINER UTAMA (KIRI MENU, KANAN STRUK KERANJANG) */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        
        {/* KIRI: DAFTAR MENU */}
        <div style={{ flex: "2", minWidth: "300px", backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <h2 style={{ color: "#334155", marginTop: 0, marginBottom: "15px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>Menu Makanan & Minuman</h2>
          
          {isLoading ? <p style={{ color: "#64748b" }}>Memuat menu makanan...</p> : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", color: "#475569" }}>
                  <th style={{ padding: "12px" }}>Foto</th>
                  <th style={{ padding: "12px" }}>Nama Menu</th>
                  <th style={{ padding: "12px" }}>Deskripsi</th>
                  <th style={{ padding: "12px" }}>Harga</th>
                  <th style={{ padding: "12px" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {menuList.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px" }}>
                      {/* Menggunakan Fallback Gambar Sakti Anti-Error */}
                      <img 
                        src={item.image && item.image.startsWith("http") ? item.image : `https://restoran-production-996f.up.railway.app/storage/${item.image}`} 
                        alt={item.nama} 
                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                        onError={(e) => { 
                          const target = e.target as HTMLImageElement;
                          if (target.src !== "https://placehold.co/50?text=Food") { target.src = "https://placehold.co/50?text=Food"; }
                        }} 
                      />
                    </td>
                    <td style={{ padding: "12px", color: "#1e293b" }}><strong>{item.nama}</strong></td>
                    <td style={{ padding: "12px", color: "#64748b", fontSize: "14px" }}>{item.deskripsi}</td>
                    <td style={{ padding: "12px", color: "#0f172a", fontWeight: "bold" }}>Rp {Number(item.harga).toLocaleString("id-ID")}</td>
                    <td style={{ padding: "12px" }}>
                      <button 
                        onClick={() => masukKeranjang(item)} 
                        style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                      >
                        + Pilih
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* KANAN: KERANJANG BELANJA */}
        <div style={{ flex: "1", minWidth: "260px", backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", height: "fit-content" }}>
          <h2 style={{ color: "#334155", marginTop: 0, marginBottom: "15px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>🛒 Keranjang</h2>
          
          {cart.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>Belum ada makanan yang dipilih.</p>
          ) : (
            <div>
              <ul style={{ listStyleType: "none", padding: 0, margin: "0 0 20px 0" }}>
                {cart.map((item) => (
                  <li key={item.menuId} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px dashed #e2e8f0", fontSize: "14px" }}>
                    <span style={{ color: "#334155" }}>{item.nama} <strong>(x{item.jumlah})</strong></span>
                    <span style={{ color: "#0f172a", fontWeight: "bold" }}>Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}</span>
                  </li>
                ))}
              </ul>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #e2e8f0", paddingTop: "15px", marginBottom: "20px" }}>
                <span style={{ fontSize: "16px", color: "#475569", fontWeight: "bold" }}>Total:</span>
                <span style={{ fontSize: "18px", color: "#16a34a", fontWeight: "bold" }}>Rp {totalHarga.toLocaleString("id-ID")}</span>
              </div>

              <button 
                onClick={handleCheckoutPesanan} 
                style={{ width: "100%", backgroundColor: "#16a34a", color: "white", border: "none", padding: "12px", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 2px 4px rgba(22,163,74,0.2)" }}
              >
                KIRIM PESANAN (CHECKOUT)
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}