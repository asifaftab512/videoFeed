"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Youtube, Home, User, Upload, Menu } from "lucide-react";
import UploadModalTrigger from "./Upload-Modal";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import Image from "next/image";

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Profile", href: "/profile", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded bg-black text-white shadow"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-black text-white shadow-xl flex flex-col justify-between py-8 z-40
          w-64
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 mb-12">
          <Youtube className="w-10 h-10 text-red-600 animate-pulse" />
          <span className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-red-500">
            MyTube
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 px-4">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-500 hover:text-amber-50 transition-all group relative"
              >
                {item.icon}
                <span className="font-bold">{item.name}</span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white group-hover:w-full transition-all" />
              </Link>
            </motion.div>
          ))}

          {/* Upload Button */}
          <div>
            <UploadModalTrigger
              customButton={(onClick) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClick}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-500 hover:text-amber-50 transition-all cursor-pointer relative"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-bold">Upload</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white group-hover:w-full transition-all" />
                </motion.div>
              )}
            />
          </div>
        </nav>

        {/* User Info */}
        {user && (
          <div className="px-6 mt-auto flex items-center gap-3 py-4 border-t border-gray-800">
           

            <Image
              src={user?.bio || "/default-avatar.png"}
              alt={user?.displayName || "User profile"}
              width={40} // must provide width
              height={40} // must provide height
              className="w-10 h-10 rounded-full border-2 border-gradient-to-r from-purple-500 via-pink-500 to-red-500 object-cover"
            />

            <div className="flex flex-col">
              <span className="font-semibold">{user.displayName}</span>
              <span className="text-xs text-gray-400">{user.email}</span>
            </div>
          </div>
        )}
      </aside>

      {/* Overlay for mobile when sidebar open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
