"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_BASE_URL } from "@/service/api";
import { setCookie } from "@/lib/helper";

export default function LoginPage() {
    const router = useRouter();
    
    // State form sesuai LoginDto dari Swagger
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e: FormEvent) {
        e.preventDefault();

        try {
            // Tembak sesuai endpoint di foto Swagger lo: POST /auth/login
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Login Sukses!");

                // Ambil token dari respons backend temen lo. 
                // Biasanya formatnya data.token, data.access_token, atau data.data.token
                const tokenUser = data.token || data.access_token || data.data?.token;
                
                if (tokenUser) {
                    // Kunci tokennya ke dalam cookie biar gembok API Swagger bisa kebuka
                    setCookie("token", tokenUser, 1); 
                }

                // Kalau sukses, langsung lempar kasir/admin ke halaman manajemen menu
                router.push("/admin/menu");
            } else {
                toast.error(data.message || "Email atau password salah!");
            }
        } catch (error) {
            toast.error("Gagal terhubung ke server backend");
        }
    }

    return (
        <div>
            <h2>FORM LOGIN MURNI</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                /><br /><br />

                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                /><br /><br />

                <button type="submit">Masuk Sistem</button>
            </form>
            <p>Belum punya akun? <button onClick={() => router.push("/register")}>Ke Halaman Register</button></p>
        </div>
    );
}