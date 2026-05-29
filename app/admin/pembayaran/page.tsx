"use client";

import { useState, FormEvent } from "react";
import { getCookie } from "@/lib/helper";
import { API_BASE_URL } from "@/service/api";
import { toast } from "sonner";

export default function PembayaranKasirPage() {
    // State input kasir sesuai isi variabel CreatePembayaranDto
    const [pesananId, setPesananId] = useState("");
    const [totalBayar, setTotalBayar] = useState("");

    async function handleSimulasiBayar(e: FormEvent) {
        e.preventDefault();
        if (!pesananId || !totalBayar) {
            toast.warning("Mohon isi ID Pesanan dan jumlah uang bayar!");
            return;
        }

        try {
            const token = getCookie("token");

            // Ambil isian kasir, bungkus jadi format CreatePembayaranDto JSON murni
            const bodyPayload = {
                pesananId: Number(pesananId),
                total_bayar: Number(totalBayar)
            };

            const response = await fetch(`${API_BASE_URL}/pembayaran`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyPayload)
            });

            if (response.ok) {
                toast.success(`Transaksi Lunas untuk ID Pesanan #${pesananId}! Simulasi sukses.`);
                setPesananId("");
                setTotalBayar("");
            } else {
                const err = await response.json();
                toast.error(err.message || "Gagal memproses transaksi pembayaran");
            }
        } catch (error) {
            toast.error("Terjadi kegagalan jaringan kasir");
        }
    }

    return (
        <div>
            <h2>KASIR - SIMULASI PROSES PEMBAYARAN RESTORAN</h2>
            <hr />
            <div style={{ maxWidth: "400px", padding: "15px", border: "1px solid #ccc" }}>
                <form onSubmit={handleSimulasiBayar}>
                    <h3>Form Input Struk Pembayaran</h3>

                    <label>ID Pesanan Pelanggan:</label><br />
                    <input
                        type="number"
                        placeholder="Contoh: 12"
                        value={pesananId}
                        onChange={(e) => setPesananId(e.target.value)}
                    /><br /><br />

                    <label>Total Jumlah Uang Dibayar (Rp):</label><br />
                    <input
                        type="number"
                        placeholder="Contoh: 50000"
                        value={totalBayar}
                        onChange={(e) => setTotalBayar(e.target.value)}
                    /><br /><br />

                    <button type="submit" style={{ backgroundColor: "blue", color: "white", padding: "8px" }}>
                        Proses & Cetak Lunas
                    </button>
                </form>
            </div>
        </div>
    );
}