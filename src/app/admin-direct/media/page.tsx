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
import {
  uploadMediaFromUrl,
  deleteMediaItem as deleteMediaItemFromAppwrite,
  MediaItem,
} from "@/app/lib/appwrite";

// Custom Toast type
interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

// Add improved admin auth check with consistent values for deployed version
const ADMIN_EMAIL = "ecoexpert@gmail.com";
const ADMIN_PASSWORD = "admin123";

// Update the DefaultMediaItems to use working URLs
const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  {
    id: "1",
    name: "Earth Graphic",
    url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
    publicId: "earth-graphic",
    uploadedAt: new Date().toISOString(),
    inMediaSlider: true,
    description: "Beautiful image of Earth from space",
    type: "image",
  },
  {
    id: "2",
    name: "Recycling Bins",
    url: "https://images.unsplash.com/photo-1582408921715-16067da6a8f9?auto=format&fit=crop&w=1200&q=80",
    publicId: "recycling-bins",
    uploadedAt: new Date().toISOString(),
    inMediaSlider: true,
    description: "Colorful recycling bins for sorting waste",
    type: "image",
  },
  {
    id: "3",
    name: "Green Energy",
    url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
    publicId: "green-energy",
    uploadedAt: new Date().toISOString(),
    inMediaSlider: true,
    description: "Solar panels powering eco-friendly solutions",
    type: "image",
  },
];

// Remove the AdminSidebar import and create a local version with fixed logo
function AdminSidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-10">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <img
              src="https://i.postimg.cc/2SW1kwbf/Final.png"
              alt="Eco-Expert Recycling"
              className="w-12 h-12 mr-3 object-contain"
              onError={(e) => {
                console.log(
                  "Admin sidebar logo failed to load, trying fallback"
                );
                // Fallback to another image
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop
                // Try a different URL completely
                target.src =
                  "https://placehold.co/100x100/22c55e/ffffff?text=EE";
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

        <div className="p-4 flex-1 overflow-y-auto">
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

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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
  // Remove local upload and only use URL method
  const [externalImageUrl, setExternalImageUrl] = useState("");
  const [externalImageName, setExternalImageName] = useState("");
  const [externalImageDescription, setExternalImageDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
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

  // Since we're removing file uploads, we'll set this to null
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Check admin authentication similar to main admin page
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Function to process media items and ensure they have a type
  const processMediaItems = (items: any[]): MediaItem[] => {
    return items.map((item) => ({
      ...item,
      // Default to "image" if type is not specified
      type: item.type || "image",
    })) as MediaItem[];
  };

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
      setMediaItems(processMediaItems(contentSettings.media.images));
    } else {
      // Use our updated default media items
      setMediaItems(DEFAULT_MEDIA_ITEMS);
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

  // Handle external URL image upload using Appwrite
  const handleExternalImageUpload = async () => {
    if (!externalImageUrl) {
      showToast("Please enter an image URL", "error");
      return;
    }

    setIsUploading(true);

    try {
      // Determine if the URL is for an image or video based on extension
      const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(externalImageUrl);
      const mediaType = isVideo ? "video" : "image";

      // Use our Appwrite upload function
      const newMediaItem = await uploadMediaFromUrl(
        externalImageUrl,
        externalImageName || `Media ${Date.now()}`,
        mediaType,
        externalImageDescription || "",
        false, // Not in slider by default
        contentSettings
      );

      // Add to local state for immediate UI update
      const updatedItems = [...mediaItems, newMediaItem];
      setMediaItems(updatedItems);

      // Clear form
      setExternalImageUrl("");
      setExternalImageName("");
      setExternalImageDescription("");

      // Show success message
      showToast(
        `${
          mediaType === "video" ? "Video" : "Image"
        } uploaded successfully to Appwrite Storage`,
        "success"
      );
    } catch (error) {
      console.error("Error uploading media:", error);
      showToast(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    } finally {
      setIsUploading(false);
    }
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

    // Update in global content settings with Appwrite sync
    updateContentSettings(
      {
        media: {
          images: updatedMediaItems,
        },
      },
      true // Ensure sync is triggered
    );

    showToast("Media updated successfully and synced to all clients");
  };

  // Handle media deletion using Appwrite
  const deleteMediaItem = async (id: string) => {
    try {
      const itemToDelete = mediaItems.find((item) => item.id === id);

      if (!itemToDelete) {
        showToast("Media item not found", "error");
        return;
      }

      // Remove from local state first for immediate UI feedback
      const updatedMediaItems = mediaItems.filter((item) => item.id !== id);
      setMediaItems(updatedMediaItems);

      // Delete from Appwrite Storage and update content settings
      await deleteMediaItemFromAppwrite(itemToDelete, contentSettings);

      showToast("Media deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting media:", error);
      showToast(
        `Deletion failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );

      // Reload the media items from contentSettings to restore state
      if (contentSettings?.media?.images) {
        setMediaItems(processMediaItems(contentSettings.media.images));
      }
    }
  };

  // Update the slider toggle to use Appwrite updates
  const setMediaItemToSlider = async (id: string, inSlider: boolean) => {
    try {
      // Find the media item to update
      const mediaItem = mediaItems.find((item) => item.id === id);
      if (!mediaItem) {
        showToast("Media item not found", "error");
        return;
      }

      // Update the item in local state for immediate UI feedback
      const updatedMediaItems = mediaItems.map((item) => {
        if (item.id === id) {
          return { ...item, inMediaSlider: inSlider };
        }
        return item;
      });

      // Set animating ID for visual feedback
      setAnimatingItemId(id);
      setTimeout(() => {
        setAnimatingItemId(null);
      }, 1000);

      // Update the media items in state
      setMediaItems(updatedMediaItems);

      // Update content settings in Appwrite
      await updateContentSettings(
        {
          media: {
            images: updatedMediaItems,
          },
        },
        true
      );

      if (inSlider) {
        showToast("Added to slider!", "success");
      } else {
        showToast("Removed from slider!", "info");
      }
    } catch (error) {
      console.error("Error updating media item:", error);
      showToast("Error updating media item", "error");

      // Reload the media items from contentSettings to restore state
      if (contentSettings?.media?.images) {
        setMediaItems(processMediaItems(contentSettings.media.images));
      }
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

  // Update the edit function to work with Appwrite
  const saveEditedMedia = async () => {
    try {
      // Check if we have the necessary fields
      if (!editingMedia.url || !editingMedia.name) {
        showToast("Please provide a URL and name for the media", "error");
        return;
      }

      setIsEditingMedia(false);

      // Determine if it's a video or image based on URL
      const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(editingMedia.url);
      const mediaType = isVideo ? "video" : "image";

      // If this is an existing item, update it
      if (
        editingMedia.id &&
        mediaItems.find((item) => item.id === editingMedia.id)
      ) {
        // Update the existing media item without re-uploading
        const updatedMediaItems = mediaItems.map((item) => {
          if (item.id === editingMedia.id) {
            return {
              ...item,
              name: editingMedia.name,
              description: editingMedia.description,
              inMediaSlider: editingMedia.inMediaSlider,
              // Don't change URL, publicId, type if it already exists
            };
          }
          return item;
        });

        // Update in state and Appwrite
        setMediaItems(updatedMediaItems);
        await updateContentSettings(
          {
            media: {
              ...contentSettings.media,
              images: updatedMediaItems,
            },
          },
          true
        ); // Ensure sync with Appwrite

        showToast("Media updated successfully!", "success");
      } else {
        // This is a new media item being added via the edit form
        // Use our upload function to handle it
        const newMediaItem = await uploadMediaFromUrl(
          editingMedia.url,
          editingMedia.name,
          mediaType,
          editingMedia.description || "",
          editingMedia.inMediaSlider || false,
          contentSettings
        );

        // Add to local state
        const updatedMediaItems = [...mediaItems, newMediaItem];
        setMediaItems(updatedMediaItems);

        showToast("New media added successfully!", "success");
      }

      // Reset the editing state
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
    } catch (error) {
      console.error("Error saving media:", error);
      showToast(
        `Save failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 overflow-x-hidden">
      <div className="flex">
        <AdminSidebar />

        {/* Main content */}
        <main className="ml-64 flex-1 p-6 pb-24">
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

          {/* Upload section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Add Media from URL</h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="external-url"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Image URL
                </label>
                <input
                  type="text"
                  id="external-url"
                  value={externalImageUrl}
                  onChange={(e) => setExternalImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="image-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Image Name
                </label>
                <input
                  type="text"
                  id="image-name"
                  value={externalImageName}
                  onChange={(e) => setExternalImageName(e.target.value)}
                  placeholder="My Image"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="image-description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Description (optional)
                </label>
                <textarea
                  id="image-description"
                  value={externalImageDescription}
                  onChange={(e) => setExternalImageDescription(e.target.value)}
                  placeholder="Description of the image"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows={2}
                ></textarea>
              </div>

              <div>
                <button
                  onClick={handleExternalImageUpload}
                  disabled={isUploading || !externalImageUrl}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaUpload className="mr-2" />
                  {isUploading ? "Adding..." : "Add Image"}
                </button>
              </div>
            </div>
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
                            saveEditedMedia();
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
                onClick={() => setViewMode("all")}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                Upload Your First Media
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {mediaItems
                .filter(
                  (item) => viewMode === "all" || item.inMediaSlider === true
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all transform ${
                      animatingItemId === item.id ? "scale-[1.03]" : "scale-100"
                    } border ${
                      item.inMediaSlider
                        ? "border-green-500"
                        : "border-transparent"
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
                          className="w-full h-full object-cover"
                          controls={false}
                          preload="metadata"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center overflow-hidden">
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log("Image failed to load:", item.url);
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src =
                                "https://placehold.co/600x400/22c55e/ffffff?text=Image+Error";
                            }}
                          />
                        </div>
                      )}

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
                            if (
                              confirm(
                                "Are you sure you want to delete this media?"
                              )
                            ) {
                              deleteMediaItem(item.id);
                            }
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

          {/* Media Slider Preview with fixed image URLs */}
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
                    {mediaItems.length > 0 &&
                    mediaItems.some((item) => item.inMediaSlider) ? (
                      <img
                        src={
                          mediaItems.find((item) => item.inMediaSlider)?.url ||
                          DEFAULT_MEDIA_ITEMS[0].url
                        }
                        alt="Slider Preview"
                        className="w-full h-full object-cover absolute inset-0"
                        onError={(e) => {
                          console.log("Preview image failed to load");
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src =
                            "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80";
                        }}
                      />
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80"
                        alt="Default Slider Preview"
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    )}

                    {/* Dark overlay for better text visibility */}
                    <div className="absolute inset-0 bg-black/30"></div>

                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div></div> {/* Spacer */}
                      <p className="text-white text-xl font-bold">
                        {mediaItems.find((item) => item.inMediaSlider)?.name ||
                          "Eco-Expert Recycling"}
                      </p>
                      <p className="text-white text-sm mb-8">
                        {mediaItems.find((item) => item.inMediaSlider)
                          ?.description ||
                          "Transforming electronic waste into valuable resources"}
                      </p>
                    </div>

                    {/* Navigation buttons */}
                    <button className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-20">
                      <FiChevronLeft size={24} />
                    </button>
                    <button className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-20">
                      <FiChevronRight size={24} />
                    </button>

                    {/* Pagination dots */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      <span className="w-2 h-2 rounded-full bg-white/50"></span>
                      <span className="w-2 h-2 rounded-full bg-white/50"></span>
                      <span className="w-2 h-2 rounded-full bg-white/50"></span>
                    </div>

                    {/* Slide counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full z-20">
                      1/
                      {mediaItems.filter((item) => item.inMediaSlider).length ||
                        1}
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
        </main>
      </div>
    </div>
  );
}
