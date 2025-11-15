// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAdmin } from "./contexts/AdminContext";
import {
  Shield,
  UserCog,
  UserX,
  Crown,
  User,
  Ban,
  CheckCircle,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function AdminUsers() {
  const { users, updateUser, deleteUser } = useAdmin();
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // ✅ Update Role (Saves to DB)
  const handleRoleChange = async (id, newRole) => {
    setUpdatingUserId(id);
    try {
      await updateUser(id, { role: newRole });
    } catch (error) {
      console.error("Failed to update user role:", error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ✅ Update Status (Active / Blocked)
  const handleStatusChange = async (id, newStatus) => {
    setUpdatingUserId(id);
    try {
      await updateUser(id, { status: newStatus });
    } catch (error) {
      console.error("Failed to update user status:", error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ✅ Delete User
  const handleDeleteUser = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await deleteUser(id);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const getStatusIcon = (status) => {
    const normalized = (status ?? "active").toLowerCase();
    return normalized === "active" ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <Ban className="w-4 h-4 text-red-400" />
    );
  };

  const getRoleIcon = (role) => {
    return role === "admin" ? (
      <Crown className="w-4 h-4 text-yellow-400" />
    ) : (
      <User className="w-4 h-4 text-blue-400" />
    );
  };

  return (
    <div className="min-h-screen bg-black/70 backdrop-blur-md px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-3xl p-6 sm:p-8 w-full max-w-6xl mx-auto shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-xl">
              <Users className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                User Management
              </h2>
              <p className="text-sm text-gray-400">
                Manage user roles and status ({users.length} users)
              </p>
            </div>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-700/50">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="p-4 text-left text-gray-300 font-semibold text-sm uppercase tracking-wider">
                    User
                  </th>
                  <th className="p-4 text-left text-gray-300 font-semibold text-sm uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="p-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wider">
                    Role
                  </th>
                  <th className="p-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700/50">
                {users.map((u) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-800/30 transition-all duration-200 group"
                  >
                    {/* User Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {u.firstName?.[0]}
                          {u.lastName?.[0]}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {u.firstName} {u.lastName}
                          </div>
                          <div className="text-gray-400 text-sm">
                            ID: {u.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="p-4">
                      <div className="text-gray-300">{u.email}</div>
                      {u.phone && (
                        <div className="text-gray-400 text-sm">{u.phone}</div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2">
                        {getStatusIcon(u.status)}
                        <select
                          value={u.status ?? "active"}
                          onChange={(e) =>
                            handleStatusChange(u.id, e.target.value)
                          }
                          disabled={updatingUserId === u.id}
                          className={`bg-gray-700/50 border border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-200 text-white ${
                            updatingUserId === u.id
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:border-gray-500 cursor-pointer"
                          }`}
                        >
                          <option value="active" className="bg-gray-800 text-green-400">
                            Active
                          </option>
                          <option value="blocked" className="bg-gray-800 text-red-400">
                            Blocked
                          </option>
                        </select>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2">
                        {getRoleIcon(u.role)}
                        <select
                          value={u.role || "user"}
                          onChange={(e) =>
                            handleRoleChange(u.id, e.target.value)
                          }
                          disabled={updatingUserId === u.id}
                          className={`bg-gray-700/50 border border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-200 text-white ${
                            updatingUserId === u.id
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:border-gray-500 cursor-pointer"
                          }`}
                        >
                          <option value="user" className="bg-gray-800">
                            User
                          </option>
                          <option value="admin" className="bg-gray-800">
                            Admin
                          </option>
                        </select>
                      </div>
                    </td>

                    {/* Actions - Direct Delete Button */}
                    <td className="p-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={updatingUserId === u.id}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 flex items-center gap-2 group"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Loading Overlay */}
        {updatingUserId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 flex items-center gap-3 border border-gray-700">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
              <span className="text-white">Updating user...</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}