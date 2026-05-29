"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_BASE_URL } from "@/service/api";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 🛠️ Penjinak tombol Enter biar gak auto-submit saat masih ngisi nama
    function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    }

    async function handleRegister(e: FormEvent) {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // 🚀 KUNCI PERBAIKAN: Ubah 'name' menjadi 'nama' biar dibaca sama backend temen lo!
                body: JSON.stringify({ nama: name, email, password }),
            });

            if (response.ok) {
                toast.success("Akun kasir berhasil dibuat! Silakan login.");
                router.push("/login"); // 👈 Sekarang ini dijamin bakal tereksekusi dan pindah halaman
            } else {
                const errData = await response.json();
                toast.error(errData.message || "Gagal mendaftar akun");
            }
        } catch (error) {
            toast.error("Gagal terhubung ke server backend");
        }
    }

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#f5f7fb",
            fontFamily: "sans-serif"
        }}>
            <div style={{
                backgroundColor: "#ffffff",
                padding: "30px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "360px"
            }}>
                <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>Daftar Akun Kasir</h2>

                {/* Pasang handleKeyDown di sini */}
                <form onSubmit={handleRegister} onKeyDown={handleKeyDown} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#555" }}>Nama Lengkap</label>
                        <input
                            type="text"
                            placeholder="Masukkan nama Anda"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#555" }}>Alamat Email</label>
                        <input
                            type="email"
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#555" }}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
                        />
                    </div>

                    <button type="submit" style={{
                        backgroundColor: "#0070f3",
                        color: "white",
                        padding: "12px",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "16px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        marginTop: "10px"
                    }}>
                        Daftar Sekarang
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#666" }}>
                    Sudah punya akun?{" "}
                    <button onClick={() => router.push("/login")} style={{ background: "none", border: "none", color: "#0070f3", cursor: "pointer", padding: 0, textDecoration: "underline" }}>
                        Login di sini
                    </button>
                </div>
            </div>
        </div>
    );
}