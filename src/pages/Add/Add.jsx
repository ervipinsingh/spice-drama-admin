import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import adminApi from "../../services/adminApi";

export default function AddItems() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  });

  useEffect(() => {
    if (id) {
      adminApi.get(`/food/single/${id}`).then((res) => {
        if (res.data.success) {
          setData(res.data.data);
          setOldImage(res.data.data.image);
        }
      });
    }
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(data).forEach((k) => formData.append(k, data[k]));
    if (image) formData.append("image", image);

    try {
      if (id) {
        await adminApi.put(`/food/update/${id}`, formData);
      } else {
        await adminApi.post("/food/add", formData);
      }
      toast.success("Saved successfully");
      navigate("/list");
    } catch {
      toast.error("Save failed");
    }
  };

  return (
    <form onSubmit={submitHandler} className="p-6 max-w-3xl mx-auto space-y-4">
      <label className="block font-semibold">Product Image</label>

      <label className="h-40 border-2 border-dashed flex items-center justify-center cursor-pointer">
        {image ? (
          <img src={URL.createObjectURL(image)} className="h-full" />
        ) : oldImage ? (
          <img src={oldImage} className="h-full" />
        ) : (
          <Upload />
        )}
        <input
          type="file"
          hidden
          onChange={(e) => setImage(e.target.files[0])}
        />
      </label>

      <input
        className="w-full border p-2 rounded"
        placeholder="Name"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Description"
        value={data.description}
        onChange={(e) => setData({ ...data, description: e.target.value })}
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Category"
        value={data.category}
        onChange={(e) => setData({ ...data, category: e.target.value })}
      />

      <input
        type="number"
        className="w-full border p-2 rounded"
        placeholder="Price"
        value={data.price}
        onChange={(e) => setData({ ...data, price: e.target.value })}
      />

      <button className="bg-orange-500 text-white px-6 py-2 rounded">
        {id ? "Update Item" : "Add Item"}
      </button>
    </form>
  );
}
