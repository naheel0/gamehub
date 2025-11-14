import { useEffect, useState } from "react";
import { useAdmin } from "./contexts/AdminContext";
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Plus, Trash2 } from "lucide-react";

export default function AdminAddProducts({ onClose, editingProduct }) {
  const { addProduct, editProduct } = useAdmin();

  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    platform: "",
    price: "",
    rating: 4.0,
    inStock: true,
    stock: "",
    trailer: "",
    images: [""],
    description: ""
  });

  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        ...editingProduct,
        stock: editingProduct.stock || "",
        price: editingProduct.price || "",
        rating: editingProduct.rating || 4.0,
        inStock: editingProduct.inStock !== undefined ? editingProduct.inStock : true,
        images: editingProduct.images || [""],
        trailer: editingProduct.trailer || ""
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage("");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      rating: parseFloat(formData.rating),
      inStock: formData.inStock,
      images: formData.images.filter(img => img.trim() !== "")
    };

    if (editingProduct) {
      await editProduct(editingProduct.id, productData);
    } else {
      await addProduct(productData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur flex justify-center items-center text-white z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg border border-gray-800"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Elden Ring"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genre *
              </label>
              <input
                type="text"
                name="genre"
                placeholder="Action RPG"
                value={formData.genre}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Platform *
              </label>
              <input
                type="text"
                name="platform"
                placeholder="PC, PlayStation, Xbox"
                value={formData.platform}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                placeholder="3999"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                min="0"
                step="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                placeholder="50"
                value={formData.stock}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating *
              </label>
              <input
                type="number"
                name="rating"
                placeholder="4.5"
                value={formData.rating}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                min="0"
                max="5"
                step="0.1"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600 bg-gray-800 border-gray-700 rounded focus:ring-red-500"
                />
                <span className="text-gray-300">In Stock</span>
              </label>
            </div>
          </div>

          {/* Trailer URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              YouTube Trailer URL *
            </label>
            <input
              type="url"
              name="trailer"
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
              value={formData.trailer}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Enter product description..."
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              required
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Images *
            </label>
            
            {/* Existing Images */}
            {formData.images.map((image, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-2 text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            {/* Add New Image */}
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="Add new image URL..."
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="p-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Image Previews */}
          {formData.images.some(img => img.trim() !== "") && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image Previews
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.filter(img => img.trim() !== "").map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-700"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trailer Preview */}
          {formData.trailer && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trailer Preview
              </label>
              <div className="aspect-video bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <iframe
                  src={formData.trailer}
                  title="Trailer Preview"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
            >
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}