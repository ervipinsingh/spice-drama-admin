import axios from "axios";
import { useState } from "react";

const CreatePromo = () => {
  // ✅ Get API URL from .env
  const url = import.meta.env.VITE_USER_API;

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    expiryDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      alert("API URL is not configured");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${url}/api/promo/create`, form);

      alert(response.data.message);

      if (response.data.success) {
        // Reset form after success
        setForm({
          code: "",
          discountType: "percentage",
          discountValue: "",
          minOrderAmount: "",
          expiryDate: "",
        });
      }
    } catch (error) {
      console.error(error);
      alert("Error creating promo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🎟 Create Promo Code
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Promo Code */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Promo Code
            </label>
            <input
              type="text"
              placeholder="e.g. SAVE20"
              value={form.code}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              onChange={(e) =>
                setForm({
                  ...form,
                  code: e.target.value.toUpperCase(),
                })
              }
              required
            />
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Discount Type
            </label>
            <select
              value={form.discountType}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              onChange={(e) =>
                setForm({
                  ...form,
                  discountType: e.target.value,
                })
              }
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Discount Value
            </label>
            <input
              type="number"
              placeholder="Enter value"
              value={form.discountValue}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              onChange={(e) =>
                setForm({
                  ...form,
                  discountValue: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Minimum Order Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Minimum Order Amount
            </label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={form.minOrderAmount}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              onChange={(e) =>
                setForm({
                  ...form,
                  minOrderAmount: e.target.value,
                })
              }
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              value={form.expiryDate}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              onChange={(e) =>
                setForm({
                  ...form,
                  expiryDate: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2.5 rounded-lg transition duration-300 shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Creating..." : "Create Promo"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePromo;
