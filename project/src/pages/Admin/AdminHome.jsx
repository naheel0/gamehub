import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts";
import { motion } from "framer-motion";
import { useAdmin } from "./contexts/AdminContext";
import { Package, Users, ShoppingCart, TrendingUp } from "lucide-react";

export default function AdminHome() {
  const { products, users, orders } = useAdmin();

  // Stats Cards Data
  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      color: "bg-red-500",
      change: "+12%"
    },
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "bg-red-600",
      change: "+8%"
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      color: "bg-red-700",
      change: "+23%"
    },
    {
      title: "Revenue",
      value: `₹${orders.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-red-800",
      change: "+15%"
    }
  ];

  // Order Status Data for Pie Chart
  const orderStatusData = orders.reduce((acc, order) => {
    const status = order.status || "Pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(orderStatusData).map(status => ({
    name: status,
    value: orderStatusData[status]
  }));

  // Red color palette for charts
  const RED_COLORS = ["#DC2626", "#EF4444", "#F87171", "#FECACA", "#FCA5A5"];

  // Sales Data for Bar Chart (Last 7 days)
  const salesData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dailyOrders = orders.filter(o => 
      new Date(o.date).toDateString() === date.toDateString()
    );
    return {
      day: dateString,
      sales: dailyOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    };
  }).reverse();

  // Recent orders for activity section
  const recentOrders = orders.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-red-300">Welcome to your admin dashboard</p>
        </div>
        <div className="text-sm text-red-300">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-red-900/50 to-red-950/50 backdrop-blur-lg border border-red-800 rounded-xl p-6 hover:border-red-600 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                <p className="text-green-400 text-xs mt-1">{stat.change} from last month</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} shadow-lg shadow-red-500/20`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-red-900/50 to-red-950/50 backdrop-blur-lg border border-red-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Order Status</h3>
          {pieChartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={RED_COLORS[index % RED_COLORS.length]} 
                        stroke="#1f2937"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #dc2626',
                      borderRadius: '8px',
                      color: '#FFF'
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-red-300">
              No order data available
            </div>
          )}
        </motion.div>

        {/* Sales Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-900/50 to-red-950/50 backdrop-blur-lg border border-red-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Recent Sales</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#7f1d1d" />
                <XAxis 
                  dataKey="day" 
                  stroke="#fca5a5" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#fca5a5" 
                  fontSize={12}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #dc2626',
                    borderRadius: '8px',
                    color: '#FFF'
                  }}
                  formatter={(value) => [`₹${value}`, 'Sales']}
                />
                <Bar 
                  dataKey="sales" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]}
                  stroke="#dc2626"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-red-900/50 to-red-950/50 backdrop-blur-lg border border-red-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <motion.div 
                key={order.id} 
                className="flex items-center justify-between p-4 bg-red-800/20 rounded-lg border border-red-700/30 hover:border-red-600 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <p className="text-white font-medium">Order #{order.orderId}</p>
                  <p className="text-red-300 text-sm">{order.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">₹{(order.total || 0).toLocaleString()}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-red-300">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent orders</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}