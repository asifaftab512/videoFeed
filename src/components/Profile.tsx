"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Video {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  createdAt: string;
  totalLikes: number;
}

const BASE_URL = "https://videoshare-bdducrcvaxapa5gg.southeastasia-01.azurewebsites.net";

export default function ProfilePage() {
  const router = useRouter();

  // ✅ Always call hooks at the top (include updateUser here)
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();

  const [hydrated, setHydrated] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Profile update form
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [dob, setDob] = useState(user?.dateOfBirth || "");
  const [picture, setPicture] = useState<File | null>(null);



  // ✅ Build a proper picture URL (supports null/relative/absolute)
  // const formatPictureUrl = (pic?: string | null): string => {
  //   if (!pic) return "/default-avatar.png";
  //   if (pic.startsWith("https")) return pic;
  //   return BASE_URL + pic;
  // };


  // const pictureURL = BASE_URL + (user?.bio);

  // console.log("user Details: ", user);  
  // console.log("User Picture URL: ", pictureURL);
  // console.log("User Picture: ", user?.bio);

  // What we actually render for the avatar
  // const [preview, setPreview] = useState<string>(
  //   formatPictureUrl(user?.bio)
  // );

  const [preview, setPreview] = useState(user?.bio || "/default-avatar.png")

  // Hydration + auth redirect
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) router.push("/login");
  }, [hydrated, isAuthenticated, router]);



  // Sync preview when user changes + fetch videos
  useEffect(() => {
    if (!user) return;


    // keep preview in sync with the store value (e.g., after login/rehydrate)
    // setPreview(formatPictureUrl(user.picture));

    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/Videos/my-videos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [user]);

  // While rehydrating, avoid flicker
  if (!hydrated) return null;
  if (!user) return null;

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Not logged in");

      const formData = new FormData();
      formData.append("DisplayName", displayName);
      formData.append("FullName", fullName);
      formData.append("Bio", bio);
      formData.append("DateOfBirth", dob);
      if (picture) formData.append("Picture", picture);

      const res = await fetch(`${BASE_URL}/api/Users/Update`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Update error:", errorData);
        alert("Failed to update profile. Check console.");
        return;
      }

      const updatedUser = await res.json();

      // ✅ Persist to store (so it survives reload)
      updateUser(updatedUser);

      // ✅ Update local preview immediately
      // setPreview(formatPictureUrl(updatedUser.picture));

      alert("Profile updated successfully!");
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  const handleFileChange = (file: File | null) => {
    setPicture(file);
    if (file) {
      // local preview (blob:) works with next/image if unoptimized
      setPreview(URL.createObjectURL(file));
      
    }
  };

  return (
    <div className="flex-1 ml-64 min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
      {/* Profile Card */}
      <div className="relative max-w-3xl w-full bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 rounded-3xl p-1 shadow-lg hover:scale-105 transition-transform duration-300 mb-12">
        <div className="bg-gray-900 bg-opacity-90 rounded-3xl p-10 backdrop-blur-md border border-gray-700 shadow-xl text-center">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <Image
              src={preview}
              alt="Profile"
              width={112}                 // w-28
              height={112}                // h-28
              unoptimized                 // remove if you add your domain to next.config.js
              className="w-28 h-28 rounded-full border-4 border-purple-600 object-cover shadow-lg"
            />
          </div>

          <h1 className="text-4xl font-extrabold tracking-wide mb-3">
            {user.displayName}
          </h1>
          <p className="text-gray-400 text-lg">{user.email}</p>
          <p className="text-gray-400 mt-1 text-sm uppercase tracking-wide">
            Role: {user.role || "User"}
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setShowModal(true)}
              className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all py-3 px-8 rounded-full font-semibold shadow-lg shadow-blue-600/50 hover:shadow-indigo-600/70 transform hover:scale-105 duration-300"
            >
              Edit Profile
            </button>
            <button
              onClick={logout}
              className="cursor-pointer bg-gradient-to-r from-red-600 via-pink-600 to-red-600 hover:from-pink-600 hover:to-red-600 transition-all py-3 px-8 rounded-full font-semibold shadow-lg shadow-red-600/50 hover:shadow-pink-600/70 transform hover:scale-105 duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Update Profile
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                className="w-full p-3 rounded bg-black border border-gray-600 text-white"
              />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full p-3 rounded bg-black border border-gray-600 text-white"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Bio"
                className="w-full p-3 rounded bg-black border border-gray-600 text-white"
              />
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-3 rounded bg-black border border-gray-600 text-white [color-scheme:dark]"
              />

              {/* File Upload with Preview */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 
                             file:rounded-full file:border-0 
                             file:text-sm file:font-semibold 
                             file:bg-blue-600 file:text-white 
                             hover:file:bg-blue-700"
                />
                {preview && (
                  <Image
                    src={preview}
                    alt="Preview"
                    width={96}
                    height={96}
                    unoptimized
                    className="w-24 h-24 rounded-full mt-3 object-cover border border-gray-600"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Videos Section */}
      <div className="max-w-7xl w-full">
        <h2 className="text-3xl font-semibold mb-8 border-b border-gray-700 pb-3 text-center">
          My Videos
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-72 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-700 animate-pulse shadow-lg"
              />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <p className="text-gray-500 text-center text-lg py-12">
            No videos uploaded yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {videos.map((video) => (
              <article
                key={video.id}
                className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl transform transition-transform hover:scale-105 duration-300"
                tabIndex={0}
              >
                <video
                  src={video.videoUrl}
                  controls
                  className="w-full h-48 object-cover bg-black"
                  preload="metadata"
                  poster={video.thumbnail}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity flex flex-col justify-center items-center px-6 text-center text-white pointer-events-none group">
                  <h3 className="text-xl font-extrabold truncate max-w-full">
                    {video.title}
                  </h3>
                  <p className="text-sm mt-2">
                    👍 {video.totalLikes.toLocaleString()} Likes
                  </p>
                </div>

                {/* Video details */}
                <div className="p-5 bg-gray-900 bg-opacity-80 backdrop-blur-sm">
                  <h3 className="font-semibold text-lg truncate">
                    {video.title}
                  </h3>
                  <p className="text-gray-400 mt-2 text-sm line-clamp-3">
                    {video.description}
                  </p>
                  <time
                    className="block mt-4 text-gray-500 text-xs"
                    dateTime={video.createdAt}
                  >
                    Uploaded:{" "}
                    {new Date(video.createdAt).toLocaleDateString()}
                  </time>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
