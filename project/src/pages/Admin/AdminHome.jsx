import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
// eslint-disable-next-line no-unused-vars
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
      change: "+12%",
      color: "from-indigo-500 to-purple-600"
    },
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      change: "+8%",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      change: "+23%",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Revenue",
      value: `₹${orders.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()}`,
      icon: TrendingUp,
      change: "+15%",
      color: "from-cyan-500 to-blue-600"
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

  // Modern color palette
  const CHART_COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-600 dark:text-slate-300">Welcome to your admin dashboard</p>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
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
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white mt-2">{stat.value}</p>
                <p className="text-emerald-500 text-xs mt-1">{stat.change} from last month</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
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
          className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Order Status</h3>
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
                        fill={CHART_COLORS[index % CHART_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-500 dark:text-slate-400">
              No order data available
            </div>
          )}
        </motion.div>

        {/* Sales Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Recent Sales</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis 
                  dataKey="day" 
                  stroke="#64748b" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc'
                  }}
                  formatter={(value) => [`₹${value}`, 'Sales']}
                />
                <Bar 
                  dataKey="sales" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]}
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
        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
      >
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
              >
                <div>
                  <p className="text-slate-800 dark:text-white font-medium">Order #{order.orderId}</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">{order.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-800 dark:text-white font-semibold">₹{(order.total || 0).toLocaleString()}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
                    order.status === 'Pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' :
                    order.status === 'Cancelled' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800' :
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent orders</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}