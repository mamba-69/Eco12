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
  FiUserPlus,
  FiSearch,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { useStore, SiteSettings } from "@/app/lib/store";
import { useRouter } from "next/navigation";

// Define interface for a user
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin?: string | null;
}

// Add improved admin auth check with consistent values for deployed version
const ADMIN_EMAIL = "ecoexpert@gmail.com";
const ADMIN_PASSWORD = "admin123";

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
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
            >
              <FiLayout className="w-5 h-5 text-gray-500 dark:text-gray-400" />
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
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            >
              <FiUsers className="w-5 h-5 text-green-600 dark:text-green-400" />
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

export default function DirectUserManagement() {
  const { siteSettings, updateSiteSettings } = useStore();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // New/Edit user form state
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    role: "user",
    status: "active",
    createdAt: "",
  });

  // Load users data on mount
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

    if (siteSettings?.users) {
      setUsers(siteSettings.users);
    } else {
      // Default mock users if none exist
      const mockUsers = [
        {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          status: "active",
          createdAt: "2023-01-15T10:30:00Z",
          lastLogin: "2023-05-20T15:45:00Z",
        },
        {
          id: "2",
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          status: "active",
          createdAt: "2023-02-18T09:15:00Z",
          lastLogin: "2023-05-19T11:20:00Z",
        },
        {
          id: "3",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "editor",
          status: "active",
          createdAt: "2023-03-05T14:20:00Z",
          lastLogin: "2023-05-15T09:35:00Z",
        },
        {
          id: "4",
          name: "Bob Johnson",
          email: "bob@example.com",
          role: "user",
          status: "inactive",
          createdAt: "2023-04-12T16:40:00Z",
          lastLogin: "2023-04-30T13:15:00Z",
        },
      ];
      setUsers(mockUsers);

      // Update global store
      updateSiteSettings({
        users: mockUsers,
      });
    }
    setLoading(false);
  }, [siteSettings, updateSiteSettings, router]);

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Start creating new user
  const handleAddUser = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      role: "user",
      status: "active",
      createdAt: "",
    });
    setIsEditingUser(true);
    setSelectedUser(null);
  };

  // Start editing existing user
  const handleEditUser = (user: User) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    });
    setIsEditingUser(true);
  };

  // Save user (create or update)
  const handleSaveUser = () => {
    if (!formData.name || !formData.email) {
      setSuccessMessage("Name and email are required");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    let updatedUsers;

    if (formData.id) {
      // Update existing user
      updatedUsers = users.map((user) =>
        user.id === formData.id ? { ...user, ...formData } : user
      );
      setSuccessMessage("User updated successfully!");
    } else {
      // Create new user
      const newUser = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        lastLogin: null,
      };
      updatedUsers = [...users, newUser];
      setSuccessMessage("User created successfully!");
    }

    setUsers(updatedUsers);

    // Update global store
    updateSiteSettings({
      users: updatedUsers,
    });

    setIsEditingUser(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Delete user
  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);

    if (selectedUser?.id === userId) {
      setSelectedUser(null);
    }

    // Update global store
    updateSiteSettings({
      users: updatedUsers,
    });

    setSuccessMessage("User deleted successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <main className="ml-64 flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage user accounts and permissions
            </p>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="mb-6 bg-green-100 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          {/* Main content area */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            {/* User list header with search and add button */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-700"
                />
              </div>
              <button
                onClick={handleAddUser}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                <FiUserPlus className="mr-2" />
                Add User
              </button>
            </div>

            {/* User editing form */}
            {isEditingUser && (
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    {formData.id ? "Edit User" : "Add New User"}
                  </h3>
                  <button
                    onClick={() => setIsEditingUser(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                      placeholder="Full Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="user">User</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveUser}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                  >
                    {formData.id ? "Update User" : "Create User"}
                  </button>
                </div>
              </div>
            )}

            {/* Users list */}
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center">
                <FiUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  No users found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery
                    ? "No users match your search criteria"
                    : "Add your first user to get started"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-750">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Created
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"
                        onClick={() =>
                          setSelectedUser(user === selectedUser ? null : user)
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
                                : user.role === "editor"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                            }`}
                          >
                            {user.status === "active" ? (
                              <>
                                <FiCheck className="mr-1" /> Active
                              </>
                            ) : (
                              <>
                                <FiX className="mr-1" /> Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUser(user);
                            }}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user.id);
                            }}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* User details panel */}
          {selectedUser && (
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">User Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Account Information
                  </h4>
                  <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium">Name</dt>
                      <dd className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedUser.name}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium">Email</dt>
                      <dd className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedUser.email}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium">Role</dt>
                      <dd className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedUser.role}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium">Status</dt>
                      <dd className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedUser.status}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Activity Information
                  </h4>
                  <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium">Created On</dt>
                      <dd className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(selectedUser.createdAt).toLocaleString()}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium">Last Login</dt>
                      <dd className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedUser.lastLogin
                          ? new Date(selectedUser.lastLogin).toLocaleString()
                          : "Never"}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => handleEditUser(selectedUser)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    >
                      <FiEdit className="inline mr-2" />
                      Edit User
                    </button>
                    <button
                      onClick={() => handleDeleteUser(selectedUser.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    >
                      <FiTrash2 className="inline mr-2" />
                      Delete User
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center p-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-750 rounded-lg">
            This is a development page designed to help bypass login issues. In
            a production environment, proper authentication would be required.
          </div>
        </main>
      </div>
    </div>
  );
}
