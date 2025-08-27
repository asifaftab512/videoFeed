// api/videos.ts
import axiosInstance from "../axiosInstance";

export interface VideoResponse {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    displayName: string;
  };
  totalLikes: number;
  isLiked?: boolean;
}

export const fetchVideos = async (token: string): Promise<VideoResponse[]> => {
  const res = await axiosInstance.get<VideoResponse[]>("/Videos/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
