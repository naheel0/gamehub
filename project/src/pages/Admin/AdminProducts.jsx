import { useState, useMemo } from "react";
import { useAdmin } from "./contexts/AdminContext";
import { Edit3, Plus, Trash2,  Search, X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AdminAddProducts from "./AdminAddProducts";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function AdminProducts() {
  const { products, deleteProduct } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    
    const term = searchTerm.toLowerCase();
    return products.filter(product => 
      product.name?.toLowerCase().includes(term) ||
      product.genre?.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term) ||
      product.price?.toString().includes(term)
    );
  }, [products, searchTerm]);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Reset to first page when search term changes
  useState(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);

  // Page change handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // In the middle
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-white">Manage Products</h1>
              <p className="text-gray-400 mt-1">
                {searchTerm ? (
                  <>Showing {filteredProducts.length} of {products?.length || 0} products for "{searchTerm}"</>
                ) : (
                  <>Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products</>
                )}
              </p>
            </div>

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition duration-300 transform hover:scale-105"
            >
              <Plus size={18} /> Add Product
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products by name, category, description, or price..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/80 border border-gray-700 rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="text-xs text-gray-500 mt-2">
                Search results: {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
        </div>

        <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-800">
          <table className="w-full text-sm text-white">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!products ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-slate-400">
                    Loading products...
                  </td>
                </tr>
              ) : currentProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-slate-400">
                    {searchTerm ? 'No products found matching your search' : 'No products found.'}
                  </td>
                </tr>
              ) : (
                currentProducts.map((p) => (
                  <tr key={p.id} className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <img
                        src={p.images?.[0] || "/placeholder-game.jpg"}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4 text-gray-300">{p.genre}</td>
                    <td className="p-4 font-semibold">₹ {p.price}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          p.inStock
                            ? "bg-green-900/50 text-green-300 border border-green-700"
                            : "bg-red-900/50 text-red-300 border border-red-700"
                        }`}
                      >
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEdit(p)}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition duration-200"
                        >
                          <Edit3 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition duration-200"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredProducts && filteredProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <div className="text-gray-400 text-sm">
              Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition duration-200 ${
                  currentPage === 1
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                <ChevronLeftIcon className="h-6 w-5" />
                
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNumber, index) => (
                  <button
                    key={index}
                    onClick={() => typeof pageNumber === 'number' && goToPage(pageNumber)}
                    disabled={pageNumber === '...'}
                    className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg transition duration-200 ${
                      pageNumber === currentPage
                        ? "bg-red-600 text-white"
                        : pageNumber === '...'
                        ? "text-gray-500 cursor-default"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition duration-200 ${
                  currentPage === totalPages
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
               <ChevronRightIcon className="h-6 w-5" />
              </button>
            </div>

            {/* Items Per Page Selector */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Show:</span>
              <select 
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span>per page</span>
            </div>
          </div>
        )}
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