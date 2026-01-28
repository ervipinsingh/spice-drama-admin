import React, { useEffect, useState } from "react";
import { Edit, Trash2, Eye, PlusCircle, Search, X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import adminApi from "../../services/adminApi"; // ✅ Changed from userApi

export default function List() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ---------------- FETCH LIST ---------------- */
  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await adminApi.get("/food/list"); // ✅ Using adminApi
      if (response.data.success) {
        setList(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REMOVE ITEM ---------------- */
  const remove = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const response = await adminApi.post("/food/remove", {
        // ✅ Using adminApi
        id: foodId,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Error occurred");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to remove item");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredItems = list.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5 px-3 sm:px-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-xl sm:text-2xl font-bold">Menu Items</h1>
        <button
          onClick={() => navigate("/add")}
          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto transition"
        >
          <PlusCircle size={18} /> Add New Item
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-3 text-gray-400" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
          className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading items...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {search
              ? "No items found matching your search"
              : "No items added yet"}
          </p>
        </div>
      )}

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-sm border p-4 flex gap-4"
          >
            <img
              src={`${import.meta.env.VITE_ADMIN_API}/images/${item.image}`} // ✅ Changed to VITE_ADMIN_API
              alt={item.name}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />

            <div className="flex-1 space-y-1">
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p className="text-sm text-gray-500">Category: {item.category}</p>
              <p className="text-sm font-semibold">₹{item.price}</p>

              <div className="flex gap-4 pt-2">
                <Eye
                  size={18}
                  className="text-blue-500 cursor-pointer hover:text-blue-600"
                  onClick={() => setViewItem(item)}
                />
                <Edit
                  size={18}
                  className="text-orange-500 cursor-pointer hover:text-orange-600"
                  onClick={() => navigate(`/add/${item._id}`)}
                />
                <Trash2
                  size={18}
                  className="text-red-500 cursor-pointer hover:text-red-600"
                  onClick={() => remove(item._id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Item</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 flex items-center gap-3">
                  <img
                    src={`${import.meta.env.VITE_ADMIN_API}/images/${item.image}`} // ✅ Changed to VITE_ADMIN_API
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  {item.name}
                </td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3 text-right">₹{item.price}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-4">
                    <Eye
                      size={18}
                      className="text-blue-500 cursor-pointer hover:text-blue-600 transition"
                      onClick={() => setViewItem(item)}
                    />
                    <Edit
                      size={18}
                      className="text-orange-500 cursor-pointer hover:text-orange-600 transition"
                      onClick={() => navigate(`/add/${item._id}`)}
                    />
                    <Trash2
                      size={18}
                      className="text-red-500 cursor-pointer hover:text-red-600 transition"
                      onClick={() => remove(item._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup View */}
      <AnimatePresence>
        {viewItem && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewItem(null)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg w-full max-w-md relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setViewItem(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
              >
                <X />
              </button>

              <img
                src={`${import.meta.env.VITE_ADMIN_API}/images/${viewItem.image}`} // ✅ Changed to VITE_ADMIN_API
                alt={viewItem.name}
                className="w-full h-52 object-cover rounded-t-lg"
              />

              <div className="p-5 space-y-3">
                <h2 className="text-xl font-bold">{viewItem.name}</h2>
                <p className="text-gray-600">{viewItem.description}</p>
                <div className="flex justify-between text-sm">
                  <span>
                    <b>Category:</b> {viewItem.category}
                  </span>
                  <span>
                    <b>Price:</b> ₹{viewItem.price}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
