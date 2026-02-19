import axios from "axios";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

const CreatePromo = () => {
  const url = import.meta.env.VITE_USER_API;

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    expiryDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [promoList, setPromoList] = useState([]);

  /* ================= FETCH PROMOS ================= */
  const fetchPromos = async () => {
    try {
      const res = await axios.get(`${url}/api/promo/list`);
      if (res.data.success) {
        setPromoList(res.data.promos);
      }
    } catch (err) {
      console.error("Error fetching promos:", err);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  /* ================= CREATE PROMO ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(`${url}/api/promo/create`, form);

      if (response.data.success) {
        alert("Promo Created Successfully");

        setForm({
          code: "",
          discountType: "percentage",
          discountValue: "",
          minOrderAmount: "",
          expiryDate: "",
        });

        fetchPromos();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error creating promo");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE PROMO ================= */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this promo?",
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${url}/api/promo/delete/${id}`);

      if (response.data.success) {
        alert("Promo Deleted Successfully");
        fetchPromos(); // refresh list
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting promo");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ================= CREATE FORM ================= */}
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🎟 Create Promo Code
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Promo Code"
              value={form.code}
              className="w-full px-4 py-2 border rounded-lg"
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
              required
            />

            <select
              value={form.discountType}
              className="w-full px-4 py-2 border rounded-lg"
              onChange={(e) =>
                setForm({ ...form, discountType: e.target.value })
              }
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>

            <input
              type="number"
              placeholder="Discount Value"
              value={form.discountValue}
              className="w-full px-4 py-2 border rounded-lg"
              onChange={(e) =>
                setForm({ ...form, discountValue: e.target.value })
              }
              required
            />

            <input
              type="number"
              placeholder="Minimum Order Amount"
              value={form.minOrderAmount}
              className="w-full px-4 py-2 border rounded-lg"
              onChange={(e) =>
                setForm({ ...form, minOrderAmount: e.target.value })
              }
            />

            <input
              type="date"
              value={form.expiryDate}
              className="w-full px-4 py-2 border rounded-lg"
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg"
            >
              {loading ? "Creating..." : "Create Promo"}
            </button>
          </form>
        </div>

        {/* ================= PROMO LIST ================= */}
        <h2 className="text-2xl font-bold mb-6">🎁 Available Coupons</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoList.map((promo) => {
            const isExpired = new Date(promo.expiryDate) < new Date();

            return (
              <div
                key={promo._id}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-orange-500 relative"
              >
                <h3 className="text-xl font-bold text-orange-600">
                  {promo.code}
                </h3>

                <p className="text-gray-700 mt-2">
                  {promo.discountType === "percentage"
                    ? `${promo.discountValue}% OFF`
                    : `₹${promo.discountValue} OFF`}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Min Order: ₹{promo.minOrderAmount}
                </p>

                <p className="text-sm text-gray-500">
                  Expires: {new Date(promo.expiryDate).toLocaleDateString()}
                </p>

                {/* STATUS BADGE */}
                <span
                  className={`absolute top-4 right-12 px-3 py-1 text-xs rounded-full ${
                    isExpired
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {isExpired ? "Expired" : "Active"}
                </span>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => handleDelete(promo._id)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CreatePromo;
