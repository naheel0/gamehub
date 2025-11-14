import { useState } from "react";
import { useAdmin } from "./contexts/AdminContext";
import { Edit3, Plus, Trash2 } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AdminAddProducts from "./AdminAddProducts";

export default function AdminProducts() {
  const { products, deleteProduct } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-semibold text-white">Manage Products</h1>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition duration-300 transform hover:scale-105"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-800 text-sm text-white">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!products ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-slate-400">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-slate-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-t border-gray-800">
                    <td className="p-3">
                      <img
                        src={p.images?.[0] || "/placeholder-game.jpg"}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.genre}</td>
                    <td className="p-3">₹ {p.price}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.inStock
                            ? "bg-green-900 text-green-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-3 flex items-center justify-center gap-4">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-blue-400 hover:text-blue-300 mx-2"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="text-red-500 hover:text-red-400 mx-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <AdminAddProducts
          onClose={() => setIsModalOpen(false)}
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
}
