"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useStore } from "@/app/lib/store";
import { CldUploadWidget } from "next-cloudinary";
import { motion } from "framer-motion";

// Type definition for the Cloudinary upload result
interface CloudinaryResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
}

// Media item type
interface MediaItem {
  id: string;
  publicId: string;
  url: string;
  name: string;
  uploadedAt: string;
}

export default function MediaManagement() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Local image upload state
  const [localImageName, setLocalImageName] = useState("");
  const [localImageUrl, setLocalImageUrl] = useState("");
  
  // Get content settings from store
  const contentSettings = useStore(state => state.contentSettings);
  const updateContentSettings = useStore(state => state.updateContentSettings);
  
  // Local state for media
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  
  // Load media items from store for faster initial render
  useEffect(() => {
    if (contentSettings.media?.images) {
      setMediaItems(contentSettings.media.images);
    }
    setLoading(false);
  }, [contentSettings.media]);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push("/auth/login");
    }
  }, [isAdmin, router]);

  // Handle media upload
  const handleMediaUpload = (result: CloudinaryResult) => {
    const newImage = {
      id: Date.now().toString(),
      publicId: result.public_id,
      url: result.secure_url,
      name: result.original_filename,
      uploadedAt: new Date().toISOString()
    };
    
    const updatedImages = [...mediaItems, newImage];
    setMediaItems(updatedImages);
    
    // Save to store
    updateContentSettings({ 
      media: { 
        images: updatedImages 
      } 
    });
    
    setSuccessMessage("Image uploaded successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };
  
  // Handle local image upload
  const handleLocalImageUpload = () => {
    if (!localImageUrl || !localImageName) {
      setSuccessMessage("Please provide both name and URL for the image.");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }
    
    const newImage = {
      id: Date.now().toString(),
      publicId: `local_${Date.now()}`,
      url: localImageUrl,
      name: localImageName,
      uploadedAt: new Date().toISOString()
    };
    
    const updatedImages = [...mediaItems, newImage];
    setMediaItems(updatedImages);
    
    // Save to store
    updateContentSettings({ 
      media: { 
        images: updatedImages 
      } 
    });
    
    // Clear the form
    setLocalImageName("");
    setLocalImageUrl("");
    
    setSuccessMessage("Local image added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };
  
  // Handle media deletion
  const deleteMedia = (id: string) => {
    const updatedImages = mediaItems.filter(img => img.id !== id);
    setMediaItems(updatedImages);
    
    // Save to store
    updateContentSettings({ 
      media: { 
        images: updatedImages 
      } 
    });
    
    // Close detail view if the deleted item was selected
    if (selectedMedia && selectedMedia.id === id) {
      setSelectedMedia(null);
    }
    
    setSuccessMessage("Image deleted successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-green-900 p-6 rounded-lg mb-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Media Library</h1>
            <p className="text-green-400 mt-1">Manage your images and media assets</p>
          </div>
          <Link 
            href="/admin/dashboard" 
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left panel - Upload section */}
        <div className="md:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-4">Upload Media</h2>
            
            {/* Upload section */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-4">
                Upload images to use throughout your website.
              </p>
              
              {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                <div>
                  <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 mb-6">
                    <h3 className="text-red-400 text-sm font-medium mb-2">Cloudinary Configuration Missing</h3>
                    <p className="text-gray-400 text-xs mb-2">
                      Configure your Cloudinary credentials in <code className="bg-gray-800 px-1 py-0.5 rounded">.env.local</code>
                    </p>
                    <div className="bg-gray-900 p-2 rounded font-mono text-xs text-gray-400 mb-3">
                      <div>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dlfoyasxp</div>
                      <div>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=recycle_uploads</div>
                      <div>NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                    <h3 className="text-green-400 text-sm font-medium mb-2">Manual Image Entry</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Image Name</label>
                        <input
                          type="text"
                          placeholder="Recycling Graphic"
                          value={localImageName}
                          onChange={(e) => setLocalImageName(e.target.value)}
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded p-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Image URL</label>
                        <input
                          type="text"
                          placeholder="/images/recycling.jpg"
                          value={localImageUrl}
                          onChange={(e) => setLocalImageUrl(e.target.value)}
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded p-2 text-sm"
                        />
                      </div>
                      <button
                        onClick={handleLocalImageUpload}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors text-sm font-medium"
                      >
                        Add Image
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "recycle_uploads"}
                  options={{
                    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                    sources: ['local', 'url', 'camera'],
                    multiple: false,
                    maxFiles: 1,
                    styles: {
                      palette: {
                        window: "#1F2937",
                        windowBorder: "#374151",
                        tabIcon: "#10B981",
                        menuIcons: "#D1D5DB",
                        textDark: "#FFFFFF",
                        textLight: "#9CA3AF",
                        link: "#10B981",
                        action: "#10B981",
                        inactiveTabIcon: "#9CA3AF",
                        error: "#EF4444",
                        inProgress: "#10B981",
                        complete: "#10B981",
                        sourceBg: "#1F2937"
                      }
                    }
                  }}
                  onSuccess={(result: any) => {
                    if (result.info && result.info.secure_url) {
                      handleMediaUpload({
                        public_id: result.info.public_id,
                        secure_url: result.info.secure_url,
                        original_filename: result.info.original_filename || 'unnamed'
                      });
                    }
                  }}
                >
                  {({ open }) => (
                    <button
                      onClick={() => open()}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded transition-colors"
                    >
                      Choose Files to Upload
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </div>
            
            {/* Tips section */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-white text-sm font-medium mb-2">Tips</h3>
              <ul className="text-gray-400 text-xs space-y-2">
                <li className="flex gap-2 items-start">
                  <span className="text-green-400">•</span>
                  <span>Use high-quality images for better website appearance</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-green-400">•</span>
                  <span>Recommended image size: 1200 × 800 pixels</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-green-400">•</span>
                  <span>Supported formats: JPG, PNG, WebP</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Right panel - Media gallery */}
        <div className="md:col-span-2">
          {/* Status message */}
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-900/20 border border-green-600 text-green-400 p-4 rounded-lg mb-4 flex items-center gap-2"
            >
              <span className="font-bold">✓</span> {successMessage}
            </motion.div>
          )}
          
          {/* Media gallery */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Your Media</h2>
              <span className="text-gray-400 text-sm">{mediaItems.length} items</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-60">
                <div className="w-8 h-8 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin"></div>
              </div>
            ) : mediaItems.length === 0 ? (
              <div className="bg-gray-700 p-8 rounded-lg text-center">
                <p className="text-gray-400">No media items found. Upload your first image.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaItems.map((image) => (
                  <motion.div
                    key={image.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMedia(image)}
                    className={`cursor-pointer bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                      selectedMedia?.id === image.id ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <div className="aspect-video relative overflow-hidden bg-gray-900">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-white text-xs truncate">{image.name}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(image.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* Selected media detail view */}
          {selectedMedia && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-gray-800 rounded-lg p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Media Details</h3>
                <button 
                  onClick={() => setSelectedMedia(null)}
                  className="text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <img 
                    src={selectedMedia.url} 
                    alt={selectedMedia.name}
                    className="w-full h-auto"
                  />
                </div>
                
                <div>
                  <div className="mb-4">
                    <label className="block text-gray-400 text-xs mb-1">Name</label>
                    <p className="text-white break-words">{selectedMedia.name}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-400 text-xs mb-1">URL</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={selectedMedia.url}
                        readOnly
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded p-2 text-sm"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedMedia.url);
                          setSuccessMessage("URL copied to clipboard!");
                          setTimeout(() => setSuccessMessage(""), 2000);
                        }}
                        className="flex-shrink-0 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-400 text-xs mb-1">Uploaded On</label>
                    <p className="text-white">{new Date(selectedMedia.uploadedAt).toLocaleString()}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-400 text-xs mb-1">ID</label>
                    <p className="text-gray-300 text-sm font-mono">{selectedMedia.publicId}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <a
                      href={selectedMedia.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded text-center"
                    >
                      View Full Size
                    </a>
                    <button
                      onClick={() => deleteMedia(selectedMedia.id)}
                      className="bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 