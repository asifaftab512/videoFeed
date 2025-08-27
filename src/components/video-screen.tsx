"use client";
import { useState, useEffect } from "react";
import VideoCard from "./video-card";
import VideoPlayer from "./video-player";
import { fetchVideos, VideoResponse } from "@/api/videos/cardVideos";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function VideoScreen() {
  const router = useRouter();
  const [search] = useState("");
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoResponse | null>(null);

  const { isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) router.push("/login");
  }, [hydrated, isAuthenticated, router]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        if (!token) {
          setError("No token found. Please login first.");
          setLoading(false);
          return;
        }
        const data = await fetchVideos(token);
        setVideos(data);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos.");
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  if (loading) return <p className="text-white text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-black min-h-screen">
      {/* Search */}
      {/* <div className="mb-6">
        <input
          type="text"
          placeholder="Search videos..."
          className="w-full p-3 rounded-lg border border-blue-500 text-white bg-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div> */}

      {/* Video Player (full width) */}
      {selectedVideo && (
        <VideoPlayer
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          channel={selectedVideo.user.displayName}
          url={selectedVideo.videoUrl}
          initialLikes={selectedVideo.totalLikes}
          initiallyLiked={selectedVideo.isLiked}
          onClose={() => setSelectedVideo(null)}
          onLikeChange={(newLikes, likedStatus) => {
            setVideos(prev =>
              prev.map(v =>
                v.id === selectedVideo.id
                  ? { ...v, totalLikes: newLikes, isLiked: likedStatus }
                  : v
              )
            );
            setSelectedVideo(prev =>
              prev ? { ...prev, totalLikes: newLikes, isLiked: likedStatus } : prev
            );
          }}
        />
      )}

      {/* Video Grid */}
      <div className="mt-6">
        <VideoCard videos={filteredVideos} onSelect={setSelectedVideo} />
      </div>
    </div>
  );
}
