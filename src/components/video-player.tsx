"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";

interface VideoPlayerProps {
  videoId: number;
  title: string;
  channel: string;
  url: string;
  onClose: () => void;
  initiallyLiked?: boolean;
  initialLikes?: number;
  onLikeChange?: (newLikes: number, likedStatus: boolean) => void;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  username: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  title,
  url,
  initiallyLiked = false,
  initialLikes = 0,
  onLikeChange,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initiallyLiked);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [comment, setComment] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchComments = async () => {
      if (!token) return;
      try {
        const res = await axiosInstance.get<Comment[]>(`/Comments/video/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [videoId, token]);

  const handleLike = async () => {
    if (!token) return alert("Please login first.");
    try {
      setLoadingLike(true);
      const endpoint = isLiked ? `/Likes/${videoId}/dislike` : `/Likes/${videoId}/like`;
      const res = await axiosInstance.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const likedStatus = res.data.isLiked;
      const newLikes = likedStatus ? likes + 1 : likes > 0 ? likes - 1 : 0;
      setLikes(newLikes);
      setIsLiked(likedStatus);
      if (onLikeChange) setTimeout(() => onLikeChange(newLikes, likedStatus), 0);
    } catch (err) {
      console.error("Error updating like:", err);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !token) return;
    try {
      setLoadingComment(true);
      const res = await axiosInstance.post(`/Comments`, { videoId, content: comment }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(prev => [...prev, res.data]);
      setComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!token) return;
    try {
      await axiosInstance.delete(`/Comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="w-full flex flex-col mb-8">
      {/* Video */}
      <div className="w-full aspect-video max-h-[500px] rounded overflow-hidden bg-black">
    <video
      src={url}
      controls
      autoPlay
      className="w-full h-full object-cover"
    />
  </div>


      {/* Video Info */}
      <div className="mt-2 flex justify-between items-center text-white">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={handleLike}
          disabled={loadingLike}
          className={`px-2 py-1 text-sm rounded cursor-pointer ${
            isLiked ? "bg-red-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isLiked ? "❤️ Liked" : "👍 Like"} ({likes})
        </button>
      </div>

      {/* Comment Input */}
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="border border-blue-500 flex-1 p-2 rounded text-white"
        />
        <button
          onClick={handleAddComment}
          disabled={loadingComment}
          className="bg-green-600 text-white px-3 rounded"
        >
          {loadingComment ? "Posting..." : "Post"}
        </button>
      </div>

      {/* Comments */}
      <div className="mt-2">
        <ul className="space-y-2">
          {comments.map(c => (
            <li key={c.id} className="bg-gray-100 p-2 rounded text-black flex justify-between items-center relative">
              <span>
                <span className="font-semibold">{c.username}: </span>
                {c.content}
              </span>

              {userId && Number(userId) === c.userId && (
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                    className="text-gray-600 hover:text-black font-bold px-2"
                  >
                    ⋮
                  </button>
                  {openMenuId === c.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white border shadow-md rounded w-24 z-20">
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="block w-full text-left px-3 py-1 hover:bg-red-100 text-red-600 text-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {}}
                        className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-gray-600 text-sm"
                      >
                        Report
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoPlayer;
