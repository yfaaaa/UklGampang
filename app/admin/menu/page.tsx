"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getCookie } from "@/lib/helper";
import { API_BASE_URL } from "@/service/api";

interface Menu {
    id: number;
    nama: string;
    harga: number;
    deskripsi: string;
    image: string;
}

export default function AdminMenuPage() {
    const router = useRouter();
    const [menuList, setMenuList] = useState<Menu[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // State Form Input
    const [idEdit, setIdEdit] = useState<number | null>(null);
    const [nama, setNama] = useState("");
    const [harga, setHarga] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [imageUrl, setImageUrl] = useState(""); // Menggunakan string URL sesuai request body application/json

    // 1. GET /menu (Tampil Data)
    async function fetchMenu() {
        try {
            const token = getCookie("token");
            if (!token) { router.push("/login"); return; }

            const response = await fetch(`${API_BASE_URL}/menu`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) setMenuList(data.data || data || []);
        } catch (error) {
            toast.error("Gagal mengambil data menu");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { fetchMenu(); }, []);

    // 2. POST /menu & PATCH /menu/{id} (Tambah & Edit)
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        try {
            const token = getCookie("token");

            // Ambil isian teks, bungkus jadi format objek JSON murni murni sesuai createMenuDto
            const bodyPayload = {
                nama,
                harga: Number(harga),
                deskripsi,
                image: imageUrl || "https://placehold.co/100" // fallback jika kosong
            };

            let url = `${API_BASE_URL}/menu`;
            let methodType = "POST";

            if (idEdit) {
                url = `${API_BASE_URL}/menu/${idEdit}`;
                methodType = "PATCH";
            }

            const response = await fetch(url, {
                method: methodType,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json" // 👈 Mengirim JSON murni
                },
                body: JSON.stringify(bodyPayload)
            });

            if (response.ok) {
                toast.success(idEdit ? "Menu berhasil diubah!" : "Menu berhasil ditambahkan!");
                resetForm();
                fetchMenu();
            } else {
                toast.error("Gagal memproses menu");
            }
        } catch (error) {
            toast.error("Terjadi error jaringan");
        }
    }

    // 3. DELETE /menu/{id} (Hapus Data)
    async function handleDelete(id: number, namaMenu: string) {
        if (!confirm(`Yakin mau hapus menu "${namaMenu}"?`)) return;
        try {
            const token = getCookie("token");
            const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success(`Menu "${namaMenu}" berhasil dihapus!`);
                fetchMenu();
            } else {
                toast.error("Gagal menghapus menu dari server");
            }
        } catch (error) {
            toast.error("Error koneksi sistem hapus");
        }
    }

    function pemicuEdit(item: Menu) {
        setIdEdit(item.id);
        setNama(item.nama);
        setHarga(item.harga.toString());
        setDeskripsi(item.deskripsi);
        setImageUrl(item.image);
    }

    function resetForm() {
        setIdEdit(null);
        setNama("");
        setHarga("");
        setDeskripsi("");
        setImageUrl("");
    }

    return (
        <div>
            <h2>PENGATURAN DATA MENU MAKANAN (ADMIN)</h2>
            <form onSubmit={handleSubmit}>
                <h3>{idEdit ? `Mode Edit (ID: ${idEdit})` : "Mode Tambah Menu"}</h3>
                <input type="text" placeholder="Nama Menu" value={nama} onChange={(e) => setNama(e.target.value)} required /><br /><br />
                <input type="number" placeholder="Harga" value={harga} onChange={(e) => setHarga(e.target.value)} required /><br /><br />
                <textarea placeholder="Deskripsi Singkat" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required /><br /><br />
                <input type="text" placeholder="URL Link Gambar (https://...)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /><br /><br />
                <button type="submit">{idEdit ? "Simpan Perubahan" : "Tambah Menu"}</button>
                {idEdit && <button type="button" onClick={resetForm}>Batal</button>}
            </form>
            <hr />
            <h3>Daftar Menu Restoran</h3>
            {isLoading ? <p>Memuat daftar data...</p> : (
                <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                            <th>Gambar</th>
                            <th>Nama</th>
                            <th>Deskripsi</th>
                            <th>Harga</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuList.map((item) => (
                            <tr key={item.id}>
                                <td><img src={item.image} alt={item.nama} style={{ width: "50px", height: "50px", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/50"; }} /></td>
                                <td><strong>{item.nama}</strong></td>
                                <td>{item.deskripsi}</td>
                                <td>Rp {Number(item.harga).toLocaleString("id-ID")}</td>
                                <td>
                                    <button onClick={() => pemicuEdit(item)}>Edit</button>
                                    <button onClick={() => handleDelete(item.id, item.nama)} style={{ color: "red", marginLeft: "10px" }}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}