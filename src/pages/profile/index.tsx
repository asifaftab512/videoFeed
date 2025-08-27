"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProfileScreen from "@/components/Profile";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

function Index() {
  const {isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  // Wait for zustand-persist to rehydrate
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Redirect if not authenticated after hydration
  useEffect(() => {
    if (!hydrated) return; // wait until persist is ready
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  // Show loader until hydration is done or redirect happens
  if (!hydrated || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <ProfileScreen />
    </div>
  );
}

export default Index;
