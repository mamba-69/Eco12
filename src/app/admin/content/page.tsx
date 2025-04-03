"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useStore } from "@/app/lib/store";
import {
  broadcastSettingsChange,
  useSettingsChangeListener,
} from "@/app/lib/sitebridge";
import { CldUploadWidget } from "next-cloudinary";

// Type definition for the Cloudinary upload result
interface CloudinaryResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
}

export default function ContentManagement() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Local image upload state
  const [localImageName, setLocalImageName] = useState("");
  const [localImageUrl, setLocalImageUrl] = useState("");

  // Get content settings from store
  const contentSettings = useStore((state) => state.contentSettings);
  const updateContentSettings = useStore(
    (state) => state.updateContentSettings
  );

  // Local state that mirrors the store
  const [heroContent, setHeroContent] = useState(contentSettings.hero);
  const [missionContent, setMissionContent] = useState(contentSettings.mission);
  const [achievementsContent, setAchievementsContent] = useState(
    contentSettings.achievements
  );
  const [videosContent, setVideosContent] = useState(contentSettings.videos);
  const [mediaContent, setMediaContent] = useState(contentSettings.media);

  // Check for tab query parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (
        tab &&
        ["hero", "mission", "achievements", "videos", "media"].includes(tab)
      ) {
        setActiveTab(tab);
      }
    }
  }, []);

  // Sync local state with store when it changes
  useEffect(() => {
    setHeroContent(contentSettings.hero);
    setMissionContent(contentSettings.mission);
    setAchievementsContent(contentSettings.achievements);
    setVideosContent(contentSettings.videos);
    setMediaContent(contentSettings.media);
  }, [contentSettings]);

  // Listen for changes from other components
  useSettingsChangeListener((data) => {
    if (data.settings?.contentSettings) {
      // Only update if we're not the source
      if (data.source !== "content-management") {
        updateContentSettings(data.settings.contentSettings, false);
      }
    }
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push("/auth/login");
    }
  }, [isAdmin, router]);

  // Handle form submission
  const handleSave = () => {
    setSaving(true);

    // Prepare the update object based on active tab
    let update = {};

    switch (activeTab) {
      case "hero":
        update = { hero: heroContent };
        break;
      case "mission":
        update = { mission: missionContent };
        break;
      case "achievements":
        update = { achievements: achievementsContent };
        break;
      case "videos":
        update = { videos: videosContent };
        break;
      case "media":
        update = { media: mediaContent };
        break;
    }

    // Update the store (which will persist and broadcast)
    updateContentSettings(update);

    // Simulate a short delay for UX
    setTimeout(() => {
      setSaving(false);
      setSuccessMessage("Content updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 500);
  };

  // Handle mission point addition
  const addMissionPoint = () => {
    setMissionContent({
      ...missionContent,
      points: [...missionContent.points, ""],
    });
  };

  // Handle mission point removal
  const removeMissionPoint = (index: number) => {
    setMissionContent({
      ...missionContent,
      points: missionContent.points.filter((_, i) => i !== index),
    });
  };

  // Handle mission point update
  const updateMissionPoint = (index: number, value: string) => {
    const updatedPoints = [...missionContent.points];
    updatedPoints[index] = value;
    setMissionContent({
      ...missionContent,
      points: updatedPoints,
    });
  };

  // Handle video addition
  const addVideo = () => {
    setVideosContent({
      ...videosContent,
      videos: [...videosContent.videos, { title: "", url: "", thumbnail: "" }],
    });
  };

  // Handle video removal
  const removeVideo = (index: number) => {
    setVideosContent({
      ...videosContent,
      videos: videosContent.videos.filter((_, i) => i !== index),
    });
  };

  // Handle video update
  const updateVideo = (index: number, field: string, value: string) => {
    const updatedVideos = [...videosContent.videos];
    updatedVideos[index] = {
      ...updatedVideos[index],
      [field]: value,
    };
    setVideosContent({
      ...videosContent,
      videos: updatedVideos,
    });
  };

  // Handle achievement stat addition
  const addStat = () => {
    setAchievementsContent({
      ...achievementsContent,
      stats: [...achievementsContent.stats, { value: "", label: "" }],
    });
  };

  // Handle achievement stat removal
  const removeStat = (index: number) => {
    setAchievementsContent({
      ...achievementsContent,
      stats: achievementsContent.stats.filter((_, i) => i !== index),
    });
  };

  // Handle achievement stat update
  const updateStat = (index: number, field: string, value: string) => {
    const updatedStats = [...achievementsContent.stats];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value,
    };
    setAchievementsContent({
      ...achievementsContent,
      stats: updatedStats,
    });
  };

  // Handle media upload
  const handleMediaUpload = (result: CloudinaryResult) => {
    const newImage = {
      id: Date.now().toString(),
      publicId: result.public_id,
      url: result.secure_url,
      name: result.original_filename,
      uploadedAt: new Date().toISOString(),
    };

    const updatedMedia = {
      ...mediaContent,
      images: [...mediaContent.images, newImage],
    };

    setMediaContent(updatedMedia);

    // Save immediately
    updateContentSettings({ media: updatedMedia });
    setSuccessMessage("Image uploaded successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Handle media deletion
  const deleteMedia = (id: string) => {
    const updatedImages = mediaContent.images.filter((img) => img.id !== id);
    const updatedMedia = { ...mediaContent, images: updatedImages };
    setMediaContent(updatedMedia);
    updateContentSettings({ media: updatedMedia });
    setSuccessMessage("Image deleted successfully!");
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
      uploadedAt: new Date().toISOString(),
    };

    const updatedMedia = {
      ...mediaContent,
      images: [...mediaContent.images, newImage],
    };

    setMediaContent(updatedMedia);
    updateContentSettings({ media: updatedMedia });

    // Clear the form
    setLocalImageName("");
    setLocalImageUrl("");

    setSuccessMessage("Local image added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container py-10">
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a2e35 0%, #0d4b3f 100%)",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          marginBottom: "1.5rem",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#ffffff" }}
          >
            Content Management
          </h1>
          <Link
            href="/admin/dashboard"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              fontWeight: "medium",
              fontSize: "0.875rem",
              textDecoration: "none",
              transition: "background-color 0.2s",
            }}
          >
            Back to Dashboard
          </Link>
        </div>
        <p style={{ color: "#a3e635", marginTop: "0.5rem" }}>
          Edit your website's homepage content here
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#1F2937",
          borderRadius: "0.5rem",
          overflow: "hidden",
          marginBottom: "2rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {["hero", "mission", "achievements", "videos", "media"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "1rem 1.5rem",
              backgroundColor: activeTab === tab ? "#0f766e" : "transparent",
              color: activeTab === tab ? "white" : "rgba(255, 255, 255, 0.7)",
              border: "none",
              cursor: "pointer",
              fontWeight: activeTab === tab ? "bold" : "normal",
              transition: "all 0.2s",
              textTransform: "capitalize",
              flex: 1,
              textAlign: "center",
              position: "relative",
            }}
          >
            {tab}
            {activeTab === tab && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "30%",
                  height: "3px",
                  backgroundColor: "#a3e635",
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Form content based on active tab */}
      <div
        style={{
          backgroundColor: "#1F2937",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Hero Section Form */}
        {activeTab === "hero" && (
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                color: "white",
                marginBottom: "1.5rem",
                borderLeft: "4px solid #10B981",
                paddingLeft: "0.75rem",
              }}
            >
              Hero Section
            </h2>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#D1D5DB",
                  fontSize: "0.875rem",
                }}
              >
                Heading
              </label>
              <input
                type="text"
                value={heroContent.heading}
                onChange={(e) =>
                  setHeroContent({ ...heroContent, heading: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "#374151",
                  border: "1px solid #4B5563",
                  borderRadius: "0.375rem",
                  color: "white",
                  fontSize: "1rem",
                }}
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#D1D5DB",
                  fontSize: "0.875rem",
                }}
              >
                Subheading
              </label>
              <textarea
                value={heroContent.subheading}
                onChange={(e) =>
                  setHeroContent({ ...heroContent, subheading: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "#374151",
                  border: "1px solid #4B5563",
                  borderRadius: "0.375rem",
                  color: "white",
                  fontSize: "1rem",
                  minHeight: "100px",
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1, marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#D1D5DB",
                    fontSize: "0.875rem",
                  }}
                >
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={heroContent.ctaText}
                  onChange={(e) =>
                    setHeroContent({ ...heroContent, ctaText: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    backgroundColor: "#374151",
                    border: "1px solid #4B5563",
                    borderRadius: "0.375rem",
                    color: "white",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div style={{ flex: 1, marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#D1D5DB",
                    fontSize: "0.875rem",
                  }}
                >
                  CTA Button Link
                </label>
                <input
                  type="text"
                  value={heroContent.ctaLink}
                  onChange={(e) =>
                    setHeroContent({ ...heroContent, ctaLink: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    backgroundColor: "#374151",
                    border: "1px solid #4B5563",
                    borderRadius: "0.375rem",
                    color: "white",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Media Upload Section */}
        {activeTab === "media" && (
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                color: "white",
                marginBottom: "1.5rem",
                borderLeft: "4px solid #10B981",
                paddingLeft: "0.75rem",
              }}
            >
              Media Library
            </h2>

            {/* Upload Button */}
            <div style={{ marginBottom: "2rem" }}>
              <p
                style={{
                  color: "#D1D5DB",
                  marginBottom: "1rem",
                  fontSize: "0.875rem",
                }}
              >
                Upload images to use throughout your website. Uploaded images
                are stored in Cloudinary.
              </p>

              {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                <div>
                  <div
                    style={{
                      backgroundColor: "#2D3748",
                      padding: "1.5rem",
                      borderRadius: "0.5rem",
                      marginBottom: "1.5rem",
                      border: "1px dashed #4B5563",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1rem",
                        color: "#EF4444",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Cloudinary Configuration Missing
                    </h3>
                    <p
                      style={{
                        color: "#D1D5DB",
                        fontSize: "0.875rem",
                        marginBottom: "1rem",
                      }}
                    >
                      To enable cloud media uploads, you need to add your
                      Cloudinary credentials to the{" "}
                      <code
                        style={{
                          backgroundColor: "#374151",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                        }}
                      >
                        .env.local
                      </code>{" "}
                      file:
                    </p>
                    <div
                      style={{
                        backgroundColor: "#1F2937",
                        padding: "1rem",
                        borderRadius: "0.375rem",
                        fontFamily: "monospace",
                        fontSize: "0.875rem",
                        color: "#D1D5DB",
                        marginBottom: "1rem",
                      }}
                    >
                      <div>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dlfoyasxp</div>
                      <div>
                        NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=recycle_uploads
                      </div>
                      <div>CLOUDINARY_API_KEY=872796138558662</div>
                      <div>
                        CLOUDINARY_API_SECRET=mK6ZH1AklJeS-AFmQa5SLm2QGRE
                      </div>
                    </div>
                    <p
                      style={{
                        color: "#D1D5DB",
                        fontSize: "0.875rem",
                        marginBottom: "1rem",
                      }}
                    >
                      After adding these values, restart the development server.
                    </p>
                    <h3
                      style={{
                        fontSize: "1rem",
                        color: "#10B981",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Using Local File Upload
                    </h3>
                    <p
                      style={{
                        color: "#D1D5DB",
                        fontSize: "0.875rem",
                        marginBottom: "1rem",
                      }}
                    >
                      In the meantime, you can use local file paths for
                      development:
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Image Name"
                        value={localImageName}
                        onChange={(e) => setLocalImageName(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          backgroundColor: "#374151",
                          border: "1px solid #4B5563",
                          borderRadius: "0.375rem",
                          color: "white",
                          fontSize: "1rem",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Image URL (e.g., /images/earth-graphic.png)"
                        value={localImageUrl}
                        onChange={(e) => setLocalImageUrl(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          backgroundColor: "#374151",
                          border: "1px solid #4B5563",
                          borderRadius: "0.375rem",
                          color: "white",
                          fontSize: "1rem",
                        }}
                      />
                      <button
                        onClick={handleLocalImageUpload}
                        style={{
                          backgroundColor: "#10B981",
                          color: "white",
                          border: "none",
                          padding: "0.75rem 1.5rem",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontSize: "1rem",
                          fontWeight: "medium",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        Add Local Image
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <CldUploadWidget
                  uploadPreset={
                    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                    "recycle_uploads"
                  }
                  cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                  options={{
                    sources: ["local", "url", "camera"],
                    multiple: false,
                    maxFiles: 1,
                    styles: {
                      palette: {
                        window: "#1F2937",
                        windowBorder: "#374151",
                        tabIcon: "#10B981",
                        menuIcons: "#CBD5E1",
                        textDark: "#FFFFFF",
                        textLight: "#9CA3AF",
                        link: "#10B981",
                        action: "#10B981",
                        inactiveTabIcon: "#9CA3AF",
                        error: "#EF4444",
                        inProgress: "#10B981",
                        complete: "#10B981",
                        sourceBg: "#1F2937",
                      },
                    },
                  }}
                  onSuccess={(result: any) => {
                    if (result.info && result.info.secure_url) {
                      handleMediaUpload({
                        public_id: result.info.public_id,
                        secure_url: result.info.secure_url,
                        original_filename:
                          result.info.original_filename || "unnamed",
                      });
                    }
                  }}
                >
                  {({ open }) => (
                    <button
                      onClick={() => open()}
                      style={{
                        backgroundColor: "#10B981",
                        color: "white",
                        border: "none",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        fontSize: "1rem",
                        fontWeight: "medium",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      Upload New Media
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </div>

            {/* Media Gallery */}
            <div>
              <h3
                style={{
                  fontSize: "1rem",
                  color: "white",
                  marginBottom: "1rem",
                }}
              >
                Your Media Library
              </h3>

              {mediaContent.images.length === 0 ? (
                <div
                  style={{
                    backgroundColor: "#2D3748",
                    padding: "2rem",
                    borderRadius: "0.5rem",
                    textAlign: "center",
                    color: "#9CA3AF",
                  }}
                >
                  No images uploaded yet. Upload your first image above.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {mediaContent.images.map((image) => (
                    <div
                      key={image.id}
                      style={{
                        backgroundColor: "#2D3748",
                        borderRadius: "0.5rem",
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div style={{ position: "relative", paddingTop: "75%" }}>
                        <img
                          src={image.url}
                          alt={image.name}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div style={{ padding: "0.75rem" }}>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "white",
                            marginBottom: "0.5rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {image.name}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(image.url);
                              setSuccessMessage("URL copied to clipboard!");
                              setTimeout(() => setSuccessMessage(""), 2000);
                            }}
                            style={{
                              backgroundColor: "#374151",
                              color: "#D1D5DB",
                              border: "none",
                              padding: "0.5rem",
                              borderRadius: "0.375rem",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                            }}
                          >
                            Copy URL
                          </button>
                          <button
                            onClick={() => deleteMedia(image.id)}
                            style={{
                              backgroundColor: "#EF4444",
                              color: "white",
                              border: "none",
                              padding: "0.5rem",
                              borderRadius: "0.375rem",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mission Section Form */}
        {activeTab === "mission" && (
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                color: "white",
                marginBottom: "1.5rem",
                borderLeft: "4px solid #10B981",
                paddingLeft: "0.75rem",
              }}
            >
              Our Mission Section
            </h2>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#D1D5DB",
                  fontSize: "0.875rem",
                }}
              >
                Heading
              </label>
              <input
                type="text"
                value={missionContent.heading}
                onChange={(e) =>
                  setMissionContent({
                    ...missionContent,
                    heading: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "#374151",
                  border: "1px solid #4B5563",
                  borderRadius: "0.375rem",
                  color: "white",
                  fontSize: "1rem",
                }}
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#D1D5DB",
                  fontSize: "0.875rem",
                }}
              >
                Description
              </label>
              <textarea
                value={missionContent.description}
                onChange={(e) =>
                  setMissionContent({
                    ...missionContent,
                    description: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "#374151",
                  border: "1px solid #4B5563",
                  borderRadius: "0.375rem",
                  color: "white",
                  fontSize: "1rem",
                  minHeight: "150px",
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <label
                  style={{
                    color: "#D1D5DB",
                    fontSize: "0.875rem",
                  }}
                >
                  Mission Points
                </label>
                <button
                  onClick={addMissionPoint}
                  style={{
                    backgroundColor: "#10B981",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  + Add Point
                </button>
              </div>
              {missionContent.points.map((point, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => updateMissionPoint(index, e.target.value)}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      backgroundColor: "#374151",
                      border: "1px solid #4B5563",
                      borderRadius: "0.375rem",
                      color: "white",
                      fontSize: "1rem",
                    }}
                  />
                  <button
                    onClick={() => removeMissionPoint(index)}
                    style={{
                      backgroundColor: "#EF4444",
                      color: "white",
                      border: "none",
                      padding: "0.5rem",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontSize: "1rem",
                      lineHeight: 1,
                      width: "2.5rem",
                      height: "2.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Section Form */}
        {activeTab === "achievements" && (
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                color: "white",
                marginBottom: "1.5rem",
                borderLeft: "4px solid #10B981",
                paddingLeft: "0.75rem",
              }}
            >
              Achievements Section
            </h2>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#D1D5DB",
                  fontSize: "0.875rem",
                }}
              >
                Heading
              </label>
              <input
                type="text"
                value={achievementsContent.heading}
                onChange={(e) =>
                  setAchievementsContent({
                    ...achievementsContent,
                    heading: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "#374151",
                  border: "1px solid #4B5563",
                  borderRadius: "0.375rem",
                  color: "white",
                  fontSize: "1rem",
                }}
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <label
                  style={{
                    color: "#D1D5DB",
                    fontSize: "0.875rem",
                  }}
                >
                  Statistics
                </label>
                <button
                  onClick={addStat}
                  style={{
                    backgroundColor: "#10B981",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  + Add Statistic
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "1rem",
                }}
              >
                {achievementsContent.stats.map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#2D3748",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      position: "relative",
                    }}
                  >
                    <button
                      onClick={() => removeStat(index)}
                      style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        backgroundColor: "#EF4444",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "1.5rem",
                        height: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.875rem",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                    <div style={{ marginBottom: "0.75rem" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          color: "#D1D5DB",
                          fontSize: "0.75rem",
                        }}
                      >
                        Value
                      </label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) =>
                          updateStat(index, "value", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          backgroundColor: "#374151",
                          border: "1px solid #4B5563",
                          borderRadius: "0.375rem",
                          color: "white",
                          fontSize: "0.875rem",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          color: "#D1D5DB",
                          fontSize: "0.75rem",
                        }}
                      >
                        Label
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) =>
                          updateStat(index, "label", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          backgroundColor: "#374151",
                          border: "1px solid #4B5563",
                          borderRadius: "0.375rem",
                          color: "white",
                          fontSize: "0.875rem",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Videos Section Form */}
        {activeTab === "videos" && (
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                color: "white",
                marginBottom: "1.5rem",
                borderLeft: "4px solid #10B981",
                paddingLeft: "0.75rem",
              }}
            >
              Videos Section
            </h2>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#D1D5DB",
                  fontSize: "0.875rem",
                }}
              >
                Heading
              </label>
              <input
                type="text"
                value={videosContent.heading}
                onChange={(e) =>
                  setVideosContent({
                    ...videosContent,
                    heading: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "#374151",
                  border: "1px solid #4B5563",
                  borderRadius: "0.375rem",
                  color: "white",
                  fontSize: "1rem",
                }}
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <label
                  style={{
                    color: "#D1D5DB",
                    fontSize: "0.875rem",
                  }}
                >
                  Videos
                </label>
                <button
                  onClick={addVideo}
                  style={{
                    backgroundColor: "#10B981",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  + Add Video
                </button>
              </div>
              {videosContent.videos.map((video, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#2D3748",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    position: "relative",
                  }}
                >
                  <button
                    onClick={() => removeVideo(index)}
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      backgroundColor: "#EF4444",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "1.5rem",
                      height: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "#D1D5DB",
                        fontSize: "0.875rem",
                      }}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      value={video.title}
                      onChange={(e) =>
                        updateVideo(index, "title", e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        backgroundColor: "#374151",
                        border: "1px solid #4B5563",
                        borderRadius: "0.375rem",
                        color: "white",
                        fontSize: "1rem",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "#D1D5DB",
                        fontSize: "0.875rem",
                      }}
                    >
                      Video URL (YouTube embed link)
                    </label>
                    <input
                      type="text"
                      value={video.url}
                      onChange={(e) =>
                        updateVideo(index, "url", e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        backgroundColor: "#374151",
                        border: "1px solid #4B5563",
                        borderRadius: "0.375rem",
                        color: "white",
                        fontSize: "1rem",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "#D1D5DB",
                        fontSize: "0.875rem",
                      }}
                    >
                      Thumbnail Image URL
                    </label>
                    <input
                      type="text"
                      value={video.thumbnail}
                      onChange={(e) =>
                        updateVideo(index, "thumbnail", e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        backgroundColor: "#374151",
                        border: "1px solid #4B5563",
                        borderRadius: "0.375rem",
                        color: "white",
                        fontSize: "1rem",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "1px solid #10B981",
              color: "#10B981",
              padding: "1rem",
              borderRadius: "0.375rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontWeight: "bold" }}>✓</span> {successMessage}
          </div>
        )}

        {/* Save button - Only show for non-media tabs as media has its own auto-save */}
        {activeTab !== "media" && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                backgroundColor: "#10B981",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.375rem",
                cursor: saving ? "not-allowed" : "pointer",
                fontSize: "1rem",
                fontWeight: "medium",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                opacity: saving ? 0.7 : 1,
                transition: "opacity 0.2s, transform 0.2s",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              onMouseOver={(e) => {
                if (!saving)
                  e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
