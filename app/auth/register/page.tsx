"use client";
import {useState, FormEvent} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {API_BASE_URL} from "@/service/api";

export default function RegisterPage() {
    const router = useRouter();
    
    // State untuk menampung ketikan form sesuai RegisterDto dari Swagger
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleRegister(e: FormEvent) {
        e.preventDefault();

        try {
            // Tembak sesuai endpoint di foto Swagger lo: POST /auth/register
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Akun berhasil dibuat! Silakan login.");
                router.push("/login"); // Lempar ke halaman login
            } else {
                toast.error(data.message || "Gagal daftar akun");
            }
        } catch (error) {
            toast.error("Gagal terhubung ke server backend");
        }
    }

    return (
        <div>
            <h2>FORM REGISTER MURNI</h2>
            <form onSubmit={handleRegister}>
                <input 
                    type="text" 
                    placeholder="Nama Lengkap" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                /><br /><br />

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

                <button type="submit">Daftar Sekarang</button>
            </form>
            <p>Sudah punya akun? <button onClick={() => router.push("/login")}>Ke Halaman Login</button></p>
        </div>
    );
}