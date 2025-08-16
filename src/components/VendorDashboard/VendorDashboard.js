import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const VendorDashboard = () => {
  const [vendor, setVendor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    businessName: "",
    address: "",
  });

  useEffect(() => {
    const vendorData = localStorage.getItem("vendor");
    if (vendorData) {
      const parsed = JSON.parse(vendorData);
      setVendor(parsed);
      setFormData(parsed);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("vendorToken");

      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/vendors/${vendor._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setVendor(res.data);
      localStorage.setItem("vendor", JSON.stringify(res.data));
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };

  if (!vendor) {  
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Business Profile</h1>

        <div className="space-y-4">
          {["name", "mobile", "email", "businessName", "address"].map((field) => (
            <div key={field}>
              <p className="text-sm text-gray-500 capitalize">{field}</p>
              {editMode ? (
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border rounded p-2 mt-1"
                />
              ) : (
                <p className="text-lg font-medium">{vendor[field]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex justify-between">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData(vendor); // reset
                }}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}

          {/* Go to main Dashboard page */}
          <Link
            to="/dashboard"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
