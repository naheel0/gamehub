import { Eye, Trash2, Package, X, Users, IndianRupee } from "lucide-react";
import { useAdmin } from "./contexts/AdminContext";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";

export default function AdminOrders() {
  const { orders, deleteOrder, updateOrderStatus, users, loading } = useAdmin();
  const [selectedOrder, setSelectedOrder] = useState(null);

  console.log('Orders data:', orders); // Debug log
  console.log('Users data:', users); // Debug log

  const getTotalPrice = (items) => {
    return items.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  };

  const getTotalQty = (items) => {
    return items.reduce((sum, item) => sum + (item.qty || 1), 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteOrder(id);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateOrderStatus(id, newStatus);
  };

  const getUsernameFromEmail = (email) => {
    const user = users.find(user => user.email === email);
    return user?.firstName || user?.name || email;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'cancelled':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black/70 backdrop-blur-md flex items-center justify-center">
        <div className="bg-gray-800 rounded-xl p-6 flex items-center gap-3 border border-gray-700">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
          <span className="text-white">Loading orders...</span>
        </div>
      </div>
    );
  }

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
              <Package className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Order Management
              </h2>
              <p className="text-sm text-gray-400">
                Manage customer orders ({orders.length} orders)
              </p>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No orders found</p>
            <p className="text-gray-500 text-sm mt-2">
              Make sure your JSON server is running and has orders data.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-700/50">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="p-4 text-left text-gray-300 font-semibold text-sm uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="p-4 text-left text-gray-300 font-semibold text-sm uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="p-4 text-left text-gray-300 font-semibold text-sm uppercase tracking-wider">
                    Total
                  </th>
                  <th className="p-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wider">
                    Items
                  </th>
                  <th className="p-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-center text-gray-300 font-semibold text-sm uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700/50">
                {orders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-800/30 transition-all duration-200 group"
                  >
                    <td className="p-4">
                      <div className="text-white font-medium">
                        {order.orderId || order.id}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="text-gray-300">
                        {getUsernameFromEmail(order.email)}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {order.email}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 text-white font-semibold">
                        <IndianRupee className="w-4 h-4" />
                        {getTotalPrice(order.items).toLocaleString()}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="text-white font-medium">
                        {getTotalQty(order.items)}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center">
                        <select
                          value={order.status || 'Pending'}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className={`bg-gray-800/50 border border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-200 text-white cursor-pointer hover:border-gray-500`}
                        >
                          <option value="Pending" className="bg-gray-800">Pending</option>
                          <option value="Delivered" className="bg-gray-800">Delivered</option>
                          <option value="Cancelled" className="bg-gray-800">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-all duration-200 group-hover:scale-110"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 group-hover:scale-110"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-3xl p-6 w-full max-w-2xl shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-xl">
                  <Package className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Order Details
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {selectedOrder.orderId || selectedOrder.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-700/50 rounded-xl transition-all duration-200"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-800/50 rounded-2xl p-4 mb-4 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-4 h-4 text-blue-400" />
                <h3 className="text-white font-semibold">Customer Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white">{getUsernameFromEmail(selectedOrder.email)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white text-sm">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-800/50 rounded-2xl p-4 mb-4 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-3">
                <Package className="w-4 h-4 text-green-400" />
                <h3 className="text-white font-semibold">Order Items</h3>
              </div>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-gray-700/30 p-3 rounded-xl border border-gray-600/50"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=Image+Error';
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{item.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-gray-400 text-sm">
                          Qty: {item.qty || 1}
                        </p>
                        <p className="text-gray-400 text-sm">•</p>
                        <p className="text-green-400 text-sm font-medium">
                          ₹{item.price} each
                        </p>
                      </div>
                    </div>
                    <div className="text-white font-semibold">
                      ₹{(item.price * (item.qty || 1)).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Total Amount</span>
                <div className="flex items-center gap-1 text-xl font-bold text-white">
                  <IndianRupee className="w-5 h-5" />
                  {getTotalPrice(selectedOrder.items).toLocaleString()}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}