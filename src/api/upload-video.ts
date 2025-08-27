// videoService.ts
import axiosInstance from "./axiosInstance"; // adjust path

interface UploadResponse {
  message: string;
  url: string;
  [key: string]: unknown; // backend might return more fields
}

/**
 * Upload video to backend
 */
export const uploadVideoApi = async (
  file: File,
  thumbnailFile: File | null,
  title: string,
  description: string
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file); // main video
  if (thumbnailFile) {
    formData.append("thumbnailFile", thumbnailFile); // optional thumbnail
  }
  formData.append("title", title || "Untitled Video");
  formData.append("description", description || "No description");

  console.log("form Data: ", formData);
  const res = await axiosInstance.post<UploadResponse>(
    "/Videos/uploadS3", // ✅ matches your backend
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log("Upload Response: ", res.data);

  return res.data;
};
