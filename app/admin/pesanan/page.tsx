"use client";

import { useState, useEffect } from "react";
import { getCookie } from "@/lib/helper";
import { API_BASE_URL } from "@/service/api";
import { toast } from "sonner";

export default function PesananMasukPage() {
    const [pesananList, setPesananList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchAllPesanan() {
        try {
            const token = getCookie("token");
            const response = await fetch(`${API_BASE_URL}/pesanan`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setPesananList(data.data || data || []);
            }
        } catch (error) {
            toast.error("Gagal memuat riwayat pesanan");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { fetchAllPesanan(); }, []);

    return (
        <div>
            <h2>RIWAYAT DAFTAR PESANAN MASUK (KASIR/DAPUR)</h2>
            <hr />
            {isLoading ? <p>Mengambil data transaksi terbaru...</p> : (
                <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                            <th>ID Pesanan</th>
                            <th>Nomor Meja</th>
                            <th>Status Transaksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pesananList.map((order: any) => (
                            <tr key={order.id}>
                                <td><strong>#{order.id}</strong></td>
                                <td>{order.nomor_meja || "Meja Kosong/Takeaway"}</td>
                                <td>{order.status || "PENDING"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}