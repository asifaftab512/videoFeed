"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi } from "../../api/login/auth"; // adjust path
import { useAuthStore } from "@/store/authStore"; // adjust path

const LoginForm: React.FC = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const data = await loginApi(email, password);

    // Save token & userId to localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id.toString());

    // Optional: store in your auth store
    setAuth(data.user, data.token);

    // Redirect
    router.push("/profile");
  } catch (err) {
    console.error("❌ Login failed:", err);
    setError("Invalid email or password");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-800 to-green-950 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Sign In
        </h2>

        {error && <p className="text-center text-sm text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 placeholder-black focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 placeholder-black focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:opacity-90 transition shadow-lg disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-purple-600 font-medium cursor-pointer hover:underline"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
