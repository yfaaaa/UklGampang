"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "@/lib/helper";
import { toast } from "sonner";
import { API_BASE_URL } from "@/service/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 🛠️ Penjinak tombol Enter liar
    function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    }

    async function handleLogin(e: FormEvent) {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Ambil token dari respons backend temen lo (sesuai isi DTO/Skenario token dia)
                const tokenKonten = data.token || data.data?.token || data.accessToken;

                if (tokenKonten) {
                    setCookie("token", tokenKonten, 1);
                    toast.success("Login sukses! Selamat datang kembali.");
                    router.push("/admin/menu");
                } else {
                    toast.error("Token tidak ditemukan dalam respons server");
                }
            } else {
                toast.error(data.message || "Email atau Password salah!");
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
                <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>Masuk Aplikasi Restoran</h2>

                <form onSubmit={handleLogin} onKeyDown={handleKeyDown} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "12px",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "16px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        marginTop: "10px"
                    }}>
                        Masuk Sekarang
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#666" }}>
                    Belum punya akun kasir?{" "}
                    <button onClick={() => router.push("/register")} style={{ background: "none", border: "none", color: "#0070f3", cursor: "pointer", padding: 0, textDecoration: "underline" }}>
                        Daftar di sini
                    </button>
                </div>
            </div>
        </div>
    );
}