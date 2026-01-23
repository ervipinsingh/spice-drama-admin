import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

export default function AddItems({ url }) {
  const { id } = useParams(); // edit mode check
  const navigate = useNavigate();

  // image upload
  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");

  // form data
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  });

  // FETCH DATA IN EDIT MODE
  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const res = await axios.get(`${url}/api/food/single/${id}`);
          if (res.data.success) {
            setData({
              name: res.data.data.name,
              description: res.data.data.description,
              category: res.data.data.category,
              price: res.data.data.price,
            });
            setOldImage(res.data.data.image);
          }
        } catch (error) {
          toast.error("Failed to load item");
        }
      };
      fetchItem();
    }
  }, [id, url]);

  // INPUT CHANGE HANDLER
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // SUBMIT HANDLER (ADD / UPDATE)
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);

      // append image ONLY ONCE
      if (image) {
        formData.append("image", image);
      }

      let response;

      if (id) {
        // UPDATE MODE
        response = await axios.put(`${url}/api/food/update/${id}`, formData);
      } else {
        // ADD MODE
        response = await axios.post(`${url}/api/food/add`, formData);
      }

      if (response.data.success) {
        toast.success(
          id ? "Item updated successfully" : "Item added successfully",
        );
        navigate("/");
      } else {
        toast.error("Operation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <form onSubmit={onSubmitHandler}>
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {id ? "Edit Item" : "Add New Item"}
            </h1>
            <p className="text-gray-600">
              {id
                ? "Update your menu item"
                : "Add a new menu item to your restaurant"}
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 space-y-6">
              {/* IMAGE UPLOAD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Product Image
                </label>

                <label className="w-full h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition relative overflow-hidden">
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : oldImage ? (
                    <img
                      src={`${url}/images/${oldImage}`}
                      alt="Old"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <Upload className="w-10 h-10 mb-2" />
                      <span className="text-sm">Click to upload image</span>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              {/* PRODUCT NAME */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  name="name"
                  value={data.name}
                  onChange={onChangeHandler}
                  type="text"
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Description
                </label>
                <textarea
                  name="description"
                  value={data.description}
                  onChange={onChangeHandler}
                  rows="4"
                  placeholder="Write product description"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
                  required
                />
              </div>

              {/* CATEGORY & PRICE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={data.category}
                    onChange={onChangeHandler}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option>Pizza</option>
                    <option>Burger</option>
                    <option>Roll</option>
                    <option>Chicken</option>
                    <option>Egg</option>
                    <option>Fish</option>
                    <option>Paneer</option>
                    <option>Curries</option>
                    <option>Rice</option>
                    <option>Roti</option>
                    <option>Noodles</option>
                    <option>Maggi</option>
                    <option>Snacks</option>
                    <option>Desserts</option>
                    <option>Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    name="price"
                    value={data.price}
                    onChange={onChangeHandler}
                    type="number"
                    placeholder="Enter price"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                {id ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
