import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { uploadVideoApi } from "@/api/upload-video";

interface UploadModalTriggerProps {
  customButton?: (openModal: () => void) => React.ReactNode;
}

const UploadModalTrigger: React.FC<UploadModalTriggerProps> = ({ customButton }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !description) {
      alert("Video file, title and description are required.");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (thumbnail) formData.append("thumbnailFile", thumbnail);
      formData.append("title", title);
      formData.append("description", description);

      const { data } = await uploadVideoApi(file, thumbnail, title, description);

      console.log("✅ Uploaded Response:", data);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Upload failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const portalTarget = typeof window !== "undefined" ? document.body : null;

  return (
    <>
      {customButton ? (
        customButton(() => setIsOpen(true))
      ) : (
        <motion.button onClick={() => setIsOpen(true)} className="relative group">
          Upload
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-red-500 transition-all group-hover:w-full" />
        </motion.button>
      )}

      {portalTarget &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-gray-900 text-white p-6 rounded-xl shadow-lg w-full max-w-md relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white cursor-pointer"
                  >
                    ✖
                  </button>

                  <h2 className="text-xl font-bold mb-4">Upload Video</h2>

                  {success ? (
                    <p className="text-green-400 font-semibold">✅ Uploaded Successfully!</p>
                  ) : (
                    <form onSubmit={handleUpload} className="flex flex-col gap-4">
                      <label>Video</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="p-2 border border-gray-600 rounded bg-gray-800 text-sm"
                      />
                      <label>Thumbnail</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                        className="p-2 border border-gray-600 rounded bg-gray-800 text-sm"
                      />
                      
                      <input
                        type="text"
                        placeholder="Video Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="p-2 border border-gray-600 rounded bg-gray-800 text-sm"
                      />
                      <textarea
                        placeholder="Video Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="p-2 border border-gray-600 rounded bg-gray-800 text-sm"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 cursor-pointer transition py-2 rounded font-semibold disabled:opacity-50"
                      >
                        {loading ? "Uploading..." : "Upload"}
                      </button>
                    </form>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          portalTarget
        )}
    </>
  );
};

export default UploadModalTrigger;
