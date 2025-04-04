"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiSettings,
  FiLayout,
  FiImage,
  FiUsers,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSave,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";
import { useStore } from "@/app/lib/store";
import { useSettingsChangeListener } from "@/app/lib/sitebridge";

// Define content types
interface Page {
  id: string;
  title: string;
  path: string;
  content: string;
  lastUpdated: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: string;
  author: string;
  date: string;
  featuredImage?: string;
}

// Inline AdminSidebar component for deployment compatibility
function AdminSidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full shadow-sm">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <Link href="/admin-direct" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <span className="text-lg font-semibold dark:text-white">
            Guj Admin
          </span>
        </Link>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Direct access mode
        </p>
      </div>

      <nav className="mt-6 px-4">
        <ul className="space-y-1">
          <li>
            <Link
              href="/admin-direct"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
            >
              <FiHome className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin-direct/content"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            >
              <FiLayout className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span>Content</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin-direct/media"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
            >
              <FiImage className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span>Media</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin-direct/users"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
            >
              <FiUsers className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span>Users</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin-direct/settings"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
            >
              <FiSettings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-1">
            Direct Admin Access
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This admin panel bypasses authentication for development purposes.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default function DirectContentManagement() {
  const { contentSettings, updateContentSettings } = useStore();
  const [activeTab, setActiveTab] = useState("pages");
  const [pages, setPages] = useState<Page[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    path: "",
    content: "",
    excerpt: "",
    status: "",
    featuredImage: "",
  });

  // Add state for media selection modal
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState("");

  // Load content data from store or use defaults
  useEffect(() => {
    if (contentSettings) {
      if (contentSettings.pages) {
        setPages(contentSettings.pages);
      } else {
        // Default pages
        setPages([
          {
            id: "1",
            title: "Home Page",
            path: "/",
            content: "Welcome to our eco-friendly recycling service.",
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "2",
            title: "About Us",
            path: "/about",
            content: "Learn about our mission and values.",
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "3",
            title: "Services",
            path: "/services",
            content: "Explore our recycling services.",
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "4",
            title: "Contact",
            path: "/contact",
            content: "Get in touch with our team.",
            lastUpdated: new Date().toISOString(),
          },
        ]);
      }

      if (contentSettings.blog) {
        setBlogPosts(contentSettings.blog);
      } else {
        // Default blog posts
        setBlogPosts([
          {
            id: "1",
            title: "Understanding E-Waste Management",
            excerpt: "Learn about the importance of proper e-waste disposal.",
            content: "E-waste management is crucial for our planet's health...",
            status: "Published",
            author: "Admin",
            date: new Date().toISOString(),
            featuredImage: "/images/blog1.jpg",
          },
          {
            id: "2",
            title: "The Impact of Recycling Electronics",
            excerpt:
              "Discover how recycling electronics can make a difference.",
            content:
              "Recycling electronics has a significant positive impact...",
            status: "Published",
            author: "Admin",
            date: new Date().toISOString(),
            featuredImage: "/images/blog2.jpg",
          },
          {
            id: "3",
            title: "Corporate Sustainability Programs",
            excerpt:
              "How businesses can implement effective recycling programs.",
            content:
              "Corporate sustainability is not just good for the environment...",
            status: "Draft",
            author: "Admin",
            date: new Date().toISOString(),
            featuredImage: "",
          },
        ]);
      }
    }
    setLoading(false);
  }, [contentSettings]);

  // Listen for content setting changes
  useSettingsChangeListener((data) => {
    if (data.settings?.contentSettings) {
      if (data.settings.contentSettings.pages) {
        setPages(data.settings.contentSettings.pages);
      }
      if (data.settings.contentSettings.blog) {
        setBlogPosts(data.settings.contentSettings.blog);
      }
      console.log("Content settings updated from:", data.source);
    }
  });

  // Save content to the store
  const saveContent = () => {
    updateContentSettings({
      pages: pages,
      blog: blogPosts,
    });
    setSuccessMessage("Content updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Handle editing page
  const handleEditPage = (page: Page) => {
    setIsEditing(true);
    setEditingItemId(page.id);
    setEditForm({
      title: page.title,
      path: page.path,
      content: page.content,
      excerpt: "",
      status: "",
      featuredImage: "",
    });
    setActiveTab("pages");
  };

  // Handle editing blog post
  const handleEditBlogPost = (post: BlogPost) => {
    setIsEditing(true);
    setEditingItemId(post.id);
    setEditForm({
      title: post.title,
      path: "",
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      featuredImage: post.featuredImage || "",
    });
    setActiveTab("blog");
  };

  // Save edited item
  const saveEdit = () => {
    if (activeTab === "pages" && editingItemId) {
      const updatedPages = pages.map((page) =>
        page.id === editingItemId
          ? {
              ...page,
              title: editForm.title,
              path: editForm.path,
              content: editForm.content,
              lastUpdated: new Date().toISOString(),
            }
          : page
      );
      setPages(updatedPages);
      updateContentSettings({ pages: updatedPages });
    } else if (activeTab === "blog" && editingItemId) {
      const updatedPosts = blogPosts.map((post) =>
        post.id === editingItemId
          ? {
              ...post,
              title: editForm.title,
              excerpt: editForm.excerpt,
              content: editForm.content,
              status: editForm.status,
              featuredImage: editForm.featuredImage,
              date: new Date().toISOString(),
            }
          : post
      );
      setBlogPosts(updatedPosts);
      updateContentSettings({ blog: updatedPosts });
    }

    setIsEditing(false);
    setEditingItemId(null);
    setSuccessMessage(
      `${activeTab === "pages" ? "Page" : "Blog post"} updated successfully!`
    );
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Handle form input changes
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
    setEditingItemId(null);
  };

  // Delete item
  const handleDelete = (id: string, type: "page" | "post" | "media") => {
    if (type === "page") {
      const updatedPages = pages.filter((page) => page.id !== id);
      setPages(updatedPages);
      updateContentSettings({ pages: updatedPages });
    } else if (type === "post") {
      const updatedPosts = blogPosts.filter((post) => post.id !== id);
      setBlogPosts(updatedPosts);
      updateContentSettings({ blog: updatedPosts });
    } else if (type === "media") {
      const updatedImages = contentSettings.media.images.filter(
        (image) => image.id !== id
      );
      updateContentSettings({
        media: { ...contentSettings.media, images: updatedImages },
      });
    }
    setSuccessMessage(
      `${
        type === "page" ? "Page" : type === "post" ? "Blog post" : "Media image"
      } deleted successfully!`
    );
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Add a new blog post
  const addNewBlogPost = () => {
    const newPost = {
      id: Date.now().toString(),
      title: "New Blog Post",
      excerpt: "Enter a brief excerpt here...",
      content: "Enter your content here...",
      status: "Draft",
      author: "Admin",
      date: new Date().toISOString(),
      featuredImage: "",
    };

    const updatedPosts = [...blogPosts, newPost];
    setBlogPosts(updatedPosts);
    updateContentSettings({ blog: updatedPosts });

    // Start editing the new post
    handleEditBlogPost(newPost);
  };

  // Handle selecting media for blog post
  const selectMediaForBlog = (url: string) => {
    setEditForm((prev) => ({ ...prev, featuredImage: url }));
    setSelectedMedia(url);
    setShowMediaSelector(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar - hidden on mobile, shown on md and up */}
        <AdminSidebar />

        {/* Main content */}
        <main className="w-full md:ml-64 flex-1 p-4 md:p-6">
          <div className="mb-6 md:mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">Content Management</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create, edit, and manage your website content
                </p>
              </div>
              <button
                onClick={saveContent}
                className="hidden md:flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FiSave className="mr-2" />
                Save All Changes
              </button>
            </div>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="mb-6 bg-green-100 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          {/* Mobile save button */}
          <div className="md:hidden mb-4">
            <button
              onClick={saveContent}
              className="w-full flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FiSave className="mr-2" />
              Save All Changes
            </button>
          </div>

          {/* Content Tabs */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <div className="flex whitespace-nowrap">
              <button
                onClick={() => {
                  setActiveTab("pages");
                  if (isEditing) cancelEdit();
                }}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "pages"
                    ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Pages
              </button>
              <button
                onClick={() => {
                  setActiveTab("blog");
                  if (isEditing) cancelEdit();
                }}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "blog"
                    ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Blog Posts
              </button>
              <button
                onClick={() => {
                  setActiveTab("media");
                  if (isEditing) cancelEdit();
                }}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "media"
                    ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Media Slider
              </button>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">
                  Edit {activeTab === "pages" ? "Page" : "Blog Post"}
                </h2>
                <button
                  onClick={cancelEdit}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                </div>

                {activeTab === "pages" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Path
                    </label>
                    <input
                      type="text"
                      name="path"
                      value={editForm.path}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    />
                  </div>
                )}

                {activeTab === "blog" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Excerpt
                      </label>
                      <textarea
                        name="excerpt"
                        value={editForm.excerpt}
                        onChange={handleFormChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={editForm.content}
                    onChange={handleFormChange}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pages Tab Content */}
          {activeTab === "pages" && !isEditing && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium mb-2 sm:mb-0">
                  Website Pages
                </h2>
                <button className="w-full sm:w-auto px-3 py-1 bg-green-500 text-white rounded-md text-sm flex items-center justify-center">
                  <FiPlus className="mr-1" size={16} />
                  Add New Page
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-60">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                          Path
                        </th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                          Last Updated
                        </th>
                        <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {pages.map((page) => (
                        <tr
                          key={page.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-750"
                        >
                          <td className="py-4 px-6 text-sm font-medium whitespace-nowrap">
                            {page.title}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                            {page.path}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                            {new Date(page.lastUpdated).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-sm text-right whitespace-nowrap">
                            <button
                              onClick={() => handleEditPage(page)}
                              className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 mr-3"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(page.id, "page")}
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Blog Posts Tab Content */}
          {activeTab === "blog" && !isEditing && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Blog Posts</h2>
                <button
                  onClick={addNewBlogPost}
                  className="flex items-center text-sm px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <FiPlus className="mr-1" />
                  New Post
                </button>
              </div>

              {/* Blog posts list */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-750">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                        Status
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                        Date
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {blogPosts.map((post) => (
                      <tr
                        key={post.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-750"
                      >
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {post.featuredImage && (
                              <div className="flex-shrink-0 h-10 w-10 mr-3">
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={post.featuredImage}
                                  alt={post.title}
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {post.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {post.excerpt}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap hidden md:table-cell">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              post.status === "Published"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {post.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                          {new Date(post.date).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditBlogPost(post)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(post.id, "post")}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Blog post editing form */}
          {activeTab === "blog" && isEditing && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">
                  {editingItemId ? "Edit Blog Post" : "New Blog Post"}
                </h2>
                <button
                  onClick={cancelEdit}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    value={editForm.excerpt}
                    onChange={handleFormChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    placeholder="Brief summary of the post..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={editForm.content}
                    onChange={handleFormChange}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Featured Image
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 h-24 border border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {editForm.featuredImage ? (
                        <img
                          src={editForm.featuredImage}
                          alt="Featured"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiImage className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMediaSelector(true)}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Select Image
                    </button>
                    {editForm.featuredImage && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm((prev) => ({
                            ...prev,
                            featuredImage: "",
                          }))
                        }
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md mr-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Media selector modal */}
          {showMediaSelector && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                </div>

                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
                  <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Select Media</h3>
                      <button
                        onClick={() => setShowMediaSelector(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                      {contentSettings?.media?.images.map((image) => (
                        <div
                          key={image.id}
                          className={`border rounded-md overflow-hidden cursor-pointer transition-all ${
                            selectedMedia === image.url
                              ? "ring-2 ring-green-500 dark:ring-green-400"
                              : "hover:opacity-80"
                          }`}
                          onClick={() => selectMediaForBlog(image.url)}
                        >
                          <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700">
                            {image.type === "video" ? (
                              <video
                                src={image.url}
                                className="w-full h-full object-cover"
                                muted
                              />
                            ) : (
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="p-2 text-sm truncate">
                            {image.name}
                          </div>
                        </div>
                      ))}

                      {(!contentSettings?.media?.images ||
                        contentSettings.media.images.length === 0) && (
                        <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400">
                          No media available. Please upload some media in the
                          Media section.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-750 px-4 py-3 sm:px-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setShowMediaSelector(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMediaSelector(false)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Media Tab Content */}
          {activeTab === "media" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 dark:border-gray-700 mb-6">
                <h2 className="text-lg font-medium mb-2 sm:mb-0">
                  Media Slider Gallery
                </h2>
                <Link
                  href="/admin-direct/media"
                  className="w-full sm:w-auto px-3 py-1 bg-green-500 text-white rounded-md text-sm flex items-center justify-center"
                >
                  <FiPlus className="mr-1" size={16} />
                  Upload New Media
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-60">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                </div>
              ) : contentSettings?.media?.images?.filter(
                  (img) => img.inMediaSlider
                ).length === 0 ? (
                <div className="text-center py-8">
                  <FiImage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    No Images In Media Slider
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Add images to the media slider by visiting the Media Library
                    and selecting them for the slider.
                  </p>
                  <Link
                    href="/admin-direct/media"
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center"
                  >
                    <FiImage className="mr-2" />
                    Go to Media Library
                  </Link>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium mb-4">Current Slider Images</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {contentSettings.media.images
                      .filter((image) => image.inMediaSlider)
                      .map((image) => (
                        <div
                          key={image.id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden group relative"
                        >
                          <div className="aspect-video relative">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium truncate">
                              {image.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(image.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Media Slider Preview */}
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <FiImage className="mr-2 text-green-500" />
                      Media Slider Preview
                    </h3>

                    {contentSettings.media.images.filter(
                      (img) => img.inMediaSlider
                    ).length > 0 && (
                      <div className="mb-4">
                        <div className="relative border-2 border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-black shadow-md">
                          <div className="aspect-video p-3">
                            <img
                              src={
                                contentSettings.media.images.find(
                                  (img) => img.inMediaSlider
                                )?.url
                              }
                              alt="Preview"
                              className="w-full h-full object-contain rounded-md"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-black">
                              <h3 className="text-white text-base font-medium truncate">
                                {contentSettings.media.images.find(
                                  (img) => img.inMediaSlider
                                )?.name || "Media title"}
                              </h3>
                              <p className="text-white text-opacity-80 text-xs mt-0.5 truncate">
                                {contentSettings.media.images.find(
                                  (img) => img.inMediaSlider
                                )?.description || "Media description"}
                              </p>
                            </div>

                            {/* Nav buttons preview */}
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black bg-opacity-80 rounded-full border border-white border-opacity-30">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-4 h-4"
                              >
                                <polyline points="15 18 9 12 15 6"></polyline>
                              </svg>
                            </div>

                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black bg-opacity-80 rounded-full border border-white border-opacity-30">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-4 h-4"
                              >
                                <polyline points="9 18 15 12 9 6"></polyline>
                              </svg>
                            </div>

                            {/* Pagination dots preview */}
                            <div className="absolute bottom-16 left-0 right-0 flex justify-center">
                              <div className="flex gap-1.5">
                                {Array.from({
                                  length: Math.min(
                                    5,
                                    contentSettings.media.images.filter(
                                      (img) => img.inMediaSlider
                                    ).length
                                  ),
                                }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2.5 h-2.5 rounded-full ${
                                      i === 0 ? "bg-white" : "bg-white/50"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Counter */}
                            <div className="absolute top-3 right-3 px-2 py-0.5 bg-black rounded-full text-white text-xs">
                              1 /{" "}
                              {
                                contentSettings.media.images.filter(
                                  (img) => img.inMediaSlider
                                ).length
                              }
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm">
                          <div className="flex items-start">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p>
                              The slider has been updated with a boxed design
                              and improved controls. It supports both images and
                              videos from your media library.
                              {contentSettings.media.images.filter(
                                (img) => img.inMediaSlider
                              ).length > 1 &&
                                " Multiple items will rotate automatically with navigation controls."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-2">
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        To manage which media appears in the slider, go to the
                        Media Library and use the toggle buttons on each item.
                      </p>
                      <Link
                        href="/admin-direct/media"
                        className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center"
                      >
                        <FiImage className="mr-2" />
                        Manage Media Slider Content
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Development Notice */}
          <div className="mt-6 text-center p-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-750 rounded-lg">
            This is a direct content management page without authentication to
            help bypass login issues. Changes made here will sync with your
            website.
          </div>
        </main>
      </div>
    </div>
  );
}
