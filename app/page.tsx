"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_BASE_URL } from "@/service/api";

// Interface data sesuai kolom di database backend temen lo
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

  // 1. Ambil data menu dari API temen lo agar bisa dilihat pelanggan
  async function fetchMenuPelanggan() {
    try {
      const response = await fetch(`${API_BASE_URL}/menu`, { method: "GET" });
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

  // 2. Fungsi Logika Keranjang (Simpan sementara di memori Front-End)
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

  // Hitung total harga belanjaan pelanggan
  const totalHarga = cart.reduce((total, item) => total + item.harga * item.jumlah, 0);

  // 3. Fungsi Kirim Transaksi (POST /pesanan?pelangganId=xxx)
  async function handleCheckoutPesanan() {
    if (cart.length === 0) {
      toast.warning("Keranjang belanja lo masih kosong!");
      return;
    }

    try {
      // Dummy id pelanggan untuk ngetes awal transaksi sesuai parameter Swagger lo
      const dummyPelangganId = "1";

      // Bungkus data sesuai "CreatePesananDto" di kotak hitam Swagger lo
      const bodyPayload = {
        nomor_meja: "Meja No 3", // Sementara diisi teks manual/dummy dulu
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
        setCart([]); // Kosongkan keranjang setelah checkout berhasil
      } else {
        const errData = await response.json();
        toast.error(errData.message || "Gagal memproses pesanan");
      }
    } catch (error) {
      toast.error("Error jaringan saat mengirim transaksi pesanan");
    }
  }

  return (
    <div>
      {/* Tombol Rahasia buat Penguji/Guru biar gampang pindah ke halaman Login Kasir */}
      <div style={{ textAlign: "right" }}>
        <button onClick={() => router.push("/login")}>Masuk Sebagai Kasir/Admin</button>
      </div>

      <h1>SISI PELANGGAN - DAFTAR MENU KULINER</h1>
      <hr />

      {/* BLOK MENAMPILKAN MENU */}
      <div>
        <h3>Menu Makanan & Minuman</h3>
        {isLoading ? <p>Memuat menu makanan...</p> : (
          <table border={1} cellPadding={8} style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th>Nama</th>
                <th>Deskripsi</th>
                <th>Harga</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {menuList.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.nama}</strong></td>
                  <td>{item.deskripsi}</td>
                  <td>Rp {Number(item.harga).toLocaleString("id-ID")}</td>
                  <td>
                    <button onClick={() => masukKeranjang(item)}>+ Pilih Menu</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <hr />

      {/* BLOK STRUK KERANJANG & CHECKOUT */}
      <div>
        <h3>Keranjang Belanja Pelanggan</h3>
        {cart.length === 0 ? <p>Belum ada makanan yang dipilih.</p> : (
          <div>
            <ul>
              {cart.map((item) => (
                <li key={item.menuId}>
                  {item.nama} - ({item.jumlah} porsi) : Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
                </li>
              ))}
            </ul>
            <h4>Total Pembayaran: Rp {totalHarga.toLocaleString("id-ID")}</h4>
            <button onClick={handleCheckoutPesanan} style={{ color: "green", fontWeight: "bold" }}>
              KIRIM PESANAN SEKARANG (CHECKOUT)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}