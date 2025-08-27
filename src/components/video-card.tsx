
"use client";
import { motion } from "framer-motion";
import { VideoResponse } from "@/api/videos/cardVideos";
import Image from "next/image";

interface Props {
  videos: VideoResponse[];
  onSelect: (video: VideoResponse) => void;
}

const VideoCard: React.FC<Props> = ({ videos, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((video) => (
        <motion.div
      key={video.id}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(video)}
      tabIndex={0}
      role="button"
      aria-pressed="false"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect(video);
        }
      }}
      className="cursor-pointer bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 gap-2 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500"
    >
          <div className="relative">
        <Image
          src={video.thumbnailUrl || "https://placehold.co/600x400?text=No+Thumbnail"}
          alt={video.title}
          width={112}                
          height={112} 
          className="w-full h-52 object-cover rounded-t-2xl"
          loading="lazy"
        />
        <span className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full font-medium select-none flex items-center gap-1">
          {video.isLiked ? "❤️" : "👍"} {video.totalLikes.toLocaleString()} Likes
        </span>
      </div>

          <div className="p-4">
        <h3 className="font-semibold text-lg text-white leading-snug line-clamp-2 mb-2" title={video.title}>
          {video.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-3">{video.description || "No description available."}</p>
      </div>
    </motion.div>
      ))}
    </div>
  );
};

export default VideoCard;
