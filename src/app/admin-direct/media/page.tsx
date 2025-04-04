"use client";

import { useState, useEffect, useRef } from "react";
import {
  FiHome,
  FiSettings,
  FiLayout,
  FiImage,
  FiUsers,
  FiPlus,
  FiTrash2,
  FiUpload,
  FiEdit,
  FiX,
  FiInfo,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
} from "@/app/lib/icons";
import { FaCheck, FaUpload, FaImage, FaRegCircleXmark } from "react-icons/fa6";
import { useStore } from "@/app/lib/store";
import { useRouter } from "next/navigation";

// Type definition for the Cloudinary upload result
interface CloudinaryResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
  width: number;
  height: number;
}

// Media item type
interface MediaItem {
  id: string;
  publicId: string;
  url: string;
  name: string;
  uploadedAt: string;
  inMediaSlider?: boolean;
  type?: "image" | "video";
  description?: string;
}

// Custom Toast type
interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

// Add improved admin auth check with consistent values for deployed version
const ADMIN_EMAIL = "ecoexpert@gmail.com";
const ADMIN_PASSWORD = "admin123";

// Remove the AdminSidebar import and create a local version with fixed logo
function AdminSidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-10">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <img
              src="https://i.postimg.cc/fbTQWhz9/Chat-GPT-Image-Apr-3-2025-09-48-35-PM.png"
              alt="Eco-Expert Recycling"
              className="w-10 h-10 mr-3 object-contain"
              onError={(e) => {
                // Fallback to local logo if the remote one fails
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop
                target.src = "/images/logo.svg";
              }}
            />
            <div>
              <h2 className="text-lg font-bold flex items-center">
                <span className="text-green-600 dark:text-green-400">Eco-</span>
                Expert
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1">
          <nav className="space-y-1">
            <a
              href="/admin-direct"
              className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FiHome className="w-5 h-5 mr-3" />
              Dashboard
            </a>
            <a
              href="/admin-direct/content"
              className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FiLayout className="w-5 h-5 mr-3" />
              Content
            </a>
            <a
              href="/admin-direct/media"
              className="flex items-center px-4 py-3 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg font-medium"
            >
              <FiImage className="w-5 h-5 mr-3" />
              Media
            </a>
            <a
              href="/admin-direct/users"
              className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FiUsers className="w-5 h-5 mr-3" />
              Users
            </a>
            <a
              href="/admin-direct/settings"
              className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FiSettings className="w-5 h-5 mr-3" />
              Settings
            </a>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-1">
              Direct Admin Access
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This admin panel bypasses authentication for development purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DirectMediaManagement() {
  // Store data
  const { contentSettings, updateContentSettings } = useStore();
  const [viewMode, setViewMode] = useState<"all" | "slider">("all");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadType, setUploadType] = useState<"local" | "cloudinary">("local");
  const [localImageUrl, setLocalImageUrl] = useState("");
  const [localImageName, setLocalImageName] = useState("");
  const [localImageDescription, setLocalImageDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingMedia, setIsEditingMedia] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem>({
    id: "",
    publicId: "",
    url: "",
    name: "",
    uploadedAt: "",
    inMediaSlider: false,
    type: "image",
    description: "",
  });
  const [animatingItemId, setAnimatingItemId] = useState<string | null>(null);
  const router = useRouter();
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Check admin authentication similar to main admin page
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for admin authentication before showing content
    const checkAdminAuth = () => {
      try {
        const adminCookie = document.cookie.includes("admin-session=true");
        const adminLocalStorage = localStorage.getItem("is-admin") === "true";

        if (!adminCookie && !adminLocalStorage) {
          console.log("Admin authentication required");
          router.push("/auth/login");
          return false;
        }

        return true;
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/auth/login");
        return false;
      }
    };

    if (!checkAdminAuth()) {
      return;
    }

    // Load media from content settings on mount
    if (contentSettings?.media?.images?.length > 0) {
      setMediaItems(contentSettings.media.images);
    } else {
      // Default media items if none exist
      setMediaItems([
        {
          id: "1",
          name: "Earth Graphic",
          url: "https://i.postimg.cc/J4hR6v1V/earth-graphics.png",
          publicId: "earth-graphic",
          uploadedAt: new Date().toISOString(),
          inMediaSlider: true,
        },
        {
          id: "2",
          name: "Recycling Icon",
          url: "https://i.postimg.cc/QM5P5Pb3/recycling.png",
          publicId: "recycling-icon",
          uploadedAt: new Date().toISOString(),
          inMediaSlider: true,
        },
        {
          id: "3",
          name: "Company Logo",
          url: "/images/logo.svg",
          publicId: "company-logo",
          uploadedAt: new Date().toISOString(),
          inMediaSlider: false,
        },
      ]);
    }
    setLoading(false);
  }, [contentSettings, router]);

  // Custom toast notification
  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    // Create a toast and add it to state
    setToasts((prev) => [...prev, { id, message, type }]);

    // Remove the toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // Handle media upload from Cloudinary
  const handleMediaUpload = (result: CloudinaryResult) => {
    const isVideo =
      result.secure_url.includes(".mp4") ||
      result.secure_url.includes(".webm") ||
      result.secure_url.includes("youtube");

    const newImage: MediaItem = {
      id: Date.now().toString(),
      publicId: result.public_id,
      url: result.secure_url,
      name: result.original_filename,
      uploadedAt: new Date().toISOString(),
      inMediaSlider: false,
      type: isVideo ? "video" : "image",
      description: `${result.original_filename} - Eco-friendly recycling solutions`,
    };

    const updatedMediaItems = [...mediaItems, newImage];
    setMediaItems(updatedMediaItems);

    // Update global store with Firebase sync
    updateContentSettings(
      {
        media: {
          images: updatedMediaItems,
        },
      },
      true // Ensure Firebase sync is triggered
    );

    showToast("Media uploaded successfully and synced to all clients");
  };

  // Handle media update
  const updateMediaItem = (
    id: string,
    updates: Partial<Omit<MediaItem, "id">>
  ) => {
    // Update in local state
    const updatedMediaItems = mediaItems.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setMediaItems(updatedMediaItems);

    // Update in global content settings with Firebase sync
    updateContentSettings(
      {
        media: {
          images: updatedMediaItems,
        },
      },
      true // Ensure Firebase sync is triggered
    );

    showToast("Media updated successfully and synced to all clients");
  };

  // Handle media deletion
  const deleteMediaItem = (id: string) => {
    // Remove from local state
    const updatedMediaItems = mediaItems.filter((item) => item.id !== id);
    setMediaItems(updatedMediaItems);

    // Update global content settings with Firebase sync
    updateContentSettings(
      {
        media: {
          images: updatedMediaItems,
        },
      },
      true // Ensure Firebase sync is triggered
    );

    showToast("Media deleted successfully and synced to all clients");
  };

  // Handle local image upload
  const handleLocalImageUpload = () => {
    if (!localImageUrl || !localImageName) {
      setSuccessMessage("Please provide both URL and name for the media");
      showToast("Please provide both URL and name for the media", "error");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    const isVideo =
      localImageUrl.includes(".mp4") ||
      localImageUrl.includes(".webm") ||
      localImageUrl.includes("youtube");

    const newImage = {
      id: Date.now().toString(),
      publicId: `local_${Date.now()}`,
      url: localImageUrl,
      name: localImageName,
      uploadedAt: new Date().toISOString(),
      inMediaSlider: false,
      type: isVideo ? ("video" as const) : ("image" as const),
      description:
        localImageDescription ||
        `${localImageName} - Eco-friendly recycling solutions`,
    };

    // Save image to local storage if it's a remote URL
    if (localImageUrl.startsWith("http")) {
      try {
        // Create a new hidden link element
        const link = document.createElement("a");
        link.href = localImageUrl;
        link.download =
          localImageName.replace(/\s+/g, "_").toLowerCase() +
          (isVideo ? ".mp4" : ".jpg");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Media saved to your downloads folder", "info");
      } catch (error) {
        console.error("Failed to download image:", error);
      }
    }

    const updatedMediaItems = [...mediaItems, newImage];
    setMediaItems(updatedMediaItems);

    // Update global store
    updateContentSettings({
      media: {
        images: updatedMediaItems,
      },
    });

    // Clear form
    setLocalImageName("");
    setLocalImageUrl("");
    setLocalImageDescription("");

    setSuccessMessage("Media added successfully!");
    showToast("Media added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Handle file selection from input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setIsUploading(true);

      // Create a file reader
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          const fileName = file.name;
          const fileUrl = event.target.result.toString();

          const isVideo =
            fileName.toLowerCase().endsWith(".mp4") ||
            fileName.toLowerCase().endsWith(".webm") ||
            fileName.toLowerCase().endsWith(".mov");

          const newImage = {
            id: Date.now().toString(),
            publicId: `local_${Date.now()}`,
            url: fileUrl,
            name: fileName,
            uploadedAt: new Date().toISOString(),
            inMediaSlider: false,
            type: isVideo ? ("video" as const) : ("image" as const),
            description: `${fileName}`,
          };

          const updatedMediaItems = [...mediaItems, newImage];
          setMediaItems(updatedMediaItems);

          // Update global store
          updateContentSettings({
            media: {
              images: updatedMediaItems,
            },
          });

          setSuccessMessage("Media uploaded successfully!");
          showToast("Media uploaded successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        }

        setIsUploading(false);
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };

      reader.onerror = () => {
        showToast("Error uploading file", "error");
        setIsUploading(false);
      };

      // Read the file as data URL
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setIsUploading(true);

      // Create a file reader
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          const fileName = file.name;
          const fileUrl = event.target.result.toString();

          const isVideo =
            fileName.toLowerCase().endsWith(".mp4") ||
            fileName.toLowerCase().endsWith(".webm") ||
            fileName.toLowerCase().endsWith(".mov");

          const newImage = {
            id: Date.now().toString(),
            publicId: `local_${Date.now()}`,
            url: fileUrl,
            name: fileName,
            uploadedAt: new Date().toISOString(),
            inMediaSlider: false,
            type: isVideo ? ("video" as const) : ("image" as const),
            description: `${fileName}`,
          };

          const updatedMediaItems = [...mediaItems, newImage];
          setMediaItems(updatedMediaItems);

          // Update global store
          updateContentSettings({
            media: {
              images: updatedMediaItems,
            },
          });

          setSuccessMessage("Media uploaded successfully!");
          showToast("Media uploaded successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        }

        setIsUploading(false);
      };

      reader.onerror = () => {
        showToast("Error uploading file", "error");
        setIsUploading(false);
      };

      // Read the file as data URL
      reader.readAsDataURL(file);
    }
  };

  const setMediaItemToSlider = (id: string, value: boolean) => {
    const updatedMediaItems = mediaItems.map((item) => {
      if (item.id === id) {
        return { ...item, inMediaSlider: value };
      }
      return item;
    });

    setMediaItems(updatedMediaItems);

    // Update global store
    updateContentSettings({
      media: {
        images: updatedMediaItems,
      },
    });

    // Set animating ID for feedback
    setAnimatingItemId(id);
    setTimeout(() => {
      setAnimatingItemId(null);
    }, 1000);

    if (value) {
      showToast("Added to slider!", "success");
    } else {
      showToast("Removed from slider!", "info");
    }
  };

  const editMedia = (id: string) => {
    const mediaToEdit = mediaItems.find((item) => item.id === id);
    if (mediaToEdit) {
      setEditingMedia(mediaToEdit);
      setIsEditingMedia(true);
    }
  };

  // Toast display component
  const ToastContainer = () => (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast: Toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded-md shadow-md text-white ${
            toast.type === "success"
              ? "bg-green-500"
              : toast.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex">
        <AdminSidebar />

        {/* Main content */}
        <main className="ml-64 flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Media Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload and manage your images and videos
            </p>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="mb-6 bg-green-100 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          {/* Toast Container */}
          <ToastContainer />

          {/* Upload Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  uploadType === "local"
                    ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setUploadType("local")}
              >
                Upload From URL
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  uploadType === "cloudinary"
                    ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setUploadType("cloudinary")}
              >
                Upload From Computer
              </button>
            </div>

            {/* Local Upload Form */}
            {uploadType === "local" && (
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Media URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={localImageUrl}
                    onChange={(e) => setLocalImageUrl(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter URL of an image or video (supports jpg, png, gif, mp4,
                    webm)
                  </p>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Media Name
                  </label>
                  <input
                    type="text"
                    placeholder="Product Image"
                    value={localImageName}
                    onChange={(e) => setLocalImageName(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Brief description for this media"
                    value={localImageDescription}
                    onChange={(e) => setLocalImageDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    rows={2}
                  />
                </div>
                <button
                  onClick={handleLocalImageUpload}
                  disabled={!localImageUrl || !localImageName}
                  className={`px-4 py-2 rounded-md flex items-center justify-center ${
                    !localImageUrl || !localImageName
                      ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  <FiUpload className="mr-2" />
                  Add Media
                </button>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
                  Remote media will also be saved to your local downloads
                  folder.
                </p>
              </div>
            )}

            {/* Computer Upload Form */}
            {uploadType === "cloudinary" && (
              <div className="p-6">
                <div
                  className={`text-center p-8 border-2 border-dashed rounded-lg transition-colors duration-200 ${
                    isDragging
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Uploading media...
                      </p>
                    </div>
                  ) : (
                    <>
                      <FaUpload className="mx-auto text-gray-400 text-4xl mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Upload Image or Video
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {isDragging
                          ? "Drop your file here"
                          : "Drag and drop files here or click to select files"}
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,video/*"
                      />
                      <button
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Select Files
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-md text-sm ${
                  viewMode === "all"
                    ? "bg-green-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                All Media ({mediaItems.length})
              </button>
              <button
                onClick={() => setViewMode("slider")}
                className={`px-4 py-2 rounded-md text-sm ${
                  viewMode === "slider"
                    ? "bg-green-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                In Slider (
                {mediaItems.filter((item) => item.inMediaSlider).length})
              </button>
            </div>
          </div>

          {/* Media Editing Modal */}
          {isEditingMedia && editingMedia && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full mx-4">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium">Edit Media</h2>
                  <button
                    onClick={() => {
                      setIsEditingMedia(false);
                      setEditingMedia({
                        id: "",
                        publicId: "",
                        url: "",
                        name: "",
                        uploadedAt: "",
                        inMediaSlider: false,
                        type: "image",
                        description: "",
                      });
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/2">
                      <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                        {editingMedia.type === "video" ? (
                          <video
                            src={editingMedia.url}
                            className="max-w-full max-h-full object-contain"
                            controls
                          />
                        ) : (
                          <img
                            src={editingMedia.url}
                            alt={editingMedia.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {editingMedia.url.startsWith("data:") ? (
                          <span>Local media file</span>
                        ) : (
                          <span title={editingMedia.url}>
                            URL: {editingMedia.url.substring(0, 40)}
                            {editingMedia.url.length > 40 ? "..." : ""}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-full md:w-1/2">
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                          Media Name
                        </label>
                        <input
                          type="text"
                          value={editingMedia.name}
                          onChange={(e) =>
                            setEditingMedia({
                              ...editingMedia,
                              name: e.target.value,
                            })
                          }
                          className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                          Description
                        </label>
                        <textarea
                          value={editingMedia.description || ""}
                          onChange={(e) =>
                            setEditingMedia({
                              ...editingMedia,
                              description: e.target.value,
                            })
                          }
                          className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                          rows={4}
                        />
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">
                            Include in Media Slider
                          </label>
                          <div className="relative inline-block w-12 align-middle select-none">
                            <input
                              type="checkbox"
                              name="inSlider"
                              id="inSlider"
                              className="hidden"
                              checked={editingMedia.inMediaSlider}
                              onChange={(e) =>
                                setEditingMedia({
                                  ...editingMedia,
                                  inMediaSlider: e.target.checked,
                                })
                              }
                            />
                            <label
                              htmlFor="inSlider"
                              className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                                editingMedia.inMediaSlider
                                  ? "bg-green-500"
                                  : "bg-gray-300 dark:bg-gray-600"
                              }`}
                            >
                              <span
                                className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ease-in ${
                                  editingMedia.inMediaSlider
                                    ? "translate-x-6"
                                    : "translate-x-0"
                                }`}
                              ></span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-6">
                        <button
                          onClick={() => {
                            setIsEditingMedia(false);
                            setEditingMedia({
                              id: "",
                              publicId: "",
                              url: "",
                              name: "",
                              uploadedAt: "",
                              inMediaSlider: false,
                              type: "image",
                              description: "",
                            });
                          }}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingMedia(false);
                            setEditingMedia({
                              ...editingMedia,
                              id: Date.now().toString(),
                              publicId: `local_${Date.now()}`,
                              url: selectedFile
                                ? URL.createObjectURL(selectedFile)
                                : "",
                              name: editingMedia.name,
                              uploadedAt: new Date().toISOString(),
                              inMediaSlider: editingMedia.inMediaSlider,
                              type: selectedFile
                                ? selectedFile.type.startsWith("video")
                                  ? "video"
                                  : "image"
                                : "image",
                              description: editingMedia.description,
                            });
                            setSelectedFile(null);
                            setIsUploading(false);
                            showToast("Media updated successfully!", "success");
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Media grid */}
          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
          ) : mediaItems.length === 0 ? (
            <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <FaImage className="mx-auto text-gray-400 text-5xl mb-4" />
              <h3 className="text-lg font-medium mb-2">No Media Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Upload images or videos to get started
              </p>
              <button
                onClick={() => setUploadType("local")}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                Upload Your First Media
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {mediaItems
                .filter(
                  (item) => viewMode === "all" || item.inMediaSlider === true
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all transform ${
                      animatingItemId === item.id ? "scale-[1.03]" : "scale-100"
                    }`}
                  >
                    <div
                      className={`aspect-video relative bg-gray-100 dark:bg-gray-700 cursor-pointer`}
                      onClick={() =>
                        setMediaItemToSlider(item.id, !item.inMediaSlider)
                      }
                    >
                      {item.type === "video" ? (
                        <video
                          src={item.url}
                          className="w-full h-full object-contain"
                          controls={false}
                          preload="metadata"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center overflow-hidden">
                          <img
                            src={item.url}
                            alt={item.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}

                      {/* Slider overlay on hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-colors flex items-center justify-center">
                        <div
                          className={`transform transition-transform scale-0 hover:scale-100 ${
                            item.inMediaSlider ? "text-green-400" : "text-white"
                          }`}
                        >
                          {item.inMediaSlider ? (
                            <div className="flex flex-col items-center">
                              <FiCheck className="w-8 h-8 mb-2" />
                              <span className="text-sm font-medium">
                                Remove from slider
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <FiPlus className="w-8 h-8 mb-2" />
                              <span className="text-sm font-medium">
                                Add to slider
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Always visible control buttons */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            editMedia(item.id);
                          }}
                          className="w-8 h-8 bg-gray-800/70 text-white hover:bg-gray-700/70 rounded-full flex items-center justify-center backdrop-blur-sm"
                          title="Edit media"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMediaItemToSlider(item.id, false);
                          }}
                          className="w-8 h-8 bg-gray-800/70 text-white hover:bg-red-600/70 rounded-full flex items-center justify-center backdrop-blur-sm"
                          title="Delete media"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Status badge for media slider */}
                      {item.inMediaSlider && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          In Slider
                        </div>
                      )}

                      {/* Media type badge */}
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                        {item.type === "video" ? "Video" : "Image"}
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="mb-2">
                        <h3
                          className="font-medium text-gray-800 dark:text-white mb-1 truncate"
                          title={item.name}
                        >
                          {item.name}
                        </h3>
                        <p
                          className="text-xs text-gray-500 dark:text-gray-400 truncate"
                          title={item.description}
                        >
                          {item.description || "No description"}
                        </p>
                      </div>

                      <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(item.uploadedAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMediaItemToSlider(item.id, !item.inMediaSlider);
                          }}
                          className={`px-2 py-1 text-xs rounded-md font-medium ${
                            item.inMediaSlider
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {item.inMediaSlider ? "In Slider" : "Add to Slider"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Media Slider Size Guide */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Media Slider Settings</h2>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-blue-800 dark:text-blue-300 mb-5">
              <h3 className="font-medium mb-2">
                How to manage your media slider:
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  Toggle the slider switch or use the + button to add/remove
                  media from slider
                </li>
                <li>Click the edit button to change name and description</li>
                <li>
                  Media used in the slider will appear with a green border
                </li>
                <li>The slider supports both images and videos</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">
                  Recommended Slider Settings
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Recommended size:
                    </span>
                    <span className="font-medium">
                      16:9 aspect ratio (1280x720 or larger)
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Max items:
                    </span>
                    <span className="font-medium">
                      5-7 items for best performance
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      File formats:
                    </span>
                    <span className="font-medium">
                      JPG, PNG, GIF, MP4, WebM
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Slider Preview</h3>
                <div className="aspect-[16/9] bg-black rounded-lg overflow-hidden flex items-center justify-center border border-gray-300 dark:border-gray-600 shadow-md relative">
                  <div className="text-center p-6 w-full h-full relative">
                    <img
                      src="/images/slider-preview.jpg"
                      alt="Slider Preview"
                      className="max-w-full max-h-full object-contain mb-4"
                    />
                    <p className="text-white text-sm">
                      The slider now has an optimized boxed design
                    </p>

                    {/* Navigation buttons */}
                    <button className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                      <FiChevronLeft size={24} />
                    </button>
                    <button className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                      <FiChevronRight size={24} />
                    </button>

                    {/* Pagination dots */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      <span className="w-2 h-2 rounded-full bg-white/50"></span>
                      <span className="w-2 h-2 rounded-full bg-white/50"></span>
                      <span className="w-2 h-2 rounded-full bg-white/50"></span>
                    </div>

                    {/* Slide counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      1/4
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Supports both images and videos</li>
                    <li>
                      Visible navigation controls for better user experience
                    </li>
                    <li>Items rotate automatically with added pagination</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Development Notice */}
          <div className="mt-6 text-center p-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-750 rounded-lg">
            This is a direct media management page without authentication to
            help bypass login issues.
          </div>
        </main>
      </div>
    </div>
  );
}
