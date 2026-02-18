import axios from "axios";
import { useState } from "react";

const CreatePromo = ({ url }) => {
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    expiryDate: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(url + "/api/promo/create", form);

    alert(response.data.message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        placeholder="Promo Code"
        onChange={(e) => setForm({ ...form, code: e.target.value })}
      />

      <select
        onChange={(e) => setForm({ ...form, discountType: e.target.value })}
      >
        <option value="percentage">Percentage</option>
        <option value="flat">Flat</option>
      </select>

      <input
        type="number"
        placeholder="Discount Value"
        onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
      />

      <input
        type="number"
        placeholder="Minimum Order Amount"
        onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
      />

      <input
        type="date"
        onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
      />

      <button type="submit">Create Promo</button>
    </form>
  );
};

export default CreatePromo;
