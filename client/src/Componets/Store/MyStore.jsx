import React, { useEffect, useState } from "react";
import useStore from "../../hooks/useStore";

const MyStore = () => {
  const { fetchMyStore, updateStore, myStore, loading } = useStore();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    storeWebsite: "",
    storeAddress: "",
    storeCity: "",
    storeDescription: "",
    storeLogo: null,
  });

  useEffect(() => {
    fetchMyStore();
  }, []);

  useEffect(() => {
    if (myStore) {
      setFormData({
        storeName: myStore.storeName || "",
        storeWebsite: myStore.storeWebsite || "",
        storeAddress: myStore.storeAddress || "",
        storeCity: myStore.storeCity || "",
        storeDescription: myStore.storeDescription || "",
        storeLogo: null,
      });
    }
  }, [myStore]);

  const handleChange = (e) => {
    if (e.target.name === "storeLogo") {
      setFormData({ ...formData, storeLogo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value);
    });

    try {
      await updateStore(form);
      setEditMode(false);
      await fetchMyStore();
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  if (loading) return <p className="text-center py-10">Loading store info...</p>;
  if (!myStore) return <p className="text-center py-10">You have not created a store yet.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#0077B6]">{myStore.storeName}'s Profile</h1>

      {!editMode ? (
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
          <img
            src={myStore?.storeLogo?.startsWith("http") ? myStore.storeLogo : "/placeholder.png"}
            alt="Store Logo"
            className="w-32 h-32  object-cover  mb-4"
          />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">{myStore.storeName}</h3>
          <p className="text-sm text-gray-600 mb-2"><strong>Website:</strong> <a href={myStore.storeWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 ">{myStore.storeName}</a></p>
          <p className="text-sm text-gray-600 mb-1"><strong>Address:</strong> {myStore.storeAddress}, {myStore.storeCity}</p>
          <p className="text-sm text-gray-600 mb-4"><strong>Description:</strong> {myStore.storeDescription}</p>
          <button onClick={() => setEditMode(true)} className="px-6 py-2 bg-[#0077B6] text-white rounded hover:bg-[#005f8a] transition">Edit Store</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-5">
          <div>
            <label className="block font-medium mb-1">Store Name</label>
            <input name="storeName" value={formData.storeName} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block font-medium mb-1">Store Website</label>
            <input name="storeWebsite" value={formData.storeWebsite} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block font-medium mb-1">Store Address</label>
            <input name="storeAddress" value={formData.storeAddress} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block font-medium mb-1">Store City</label>
            <input name="storeCity" value={formData.storeCity} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block font-medium mb-1">Store Description</label>
            <textarea name="storeDescription" value={formData.storeDescription} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded resize-none" rows={4} />
          </div>

          <div>
            <label className="block font-medium mb-1">Store Logo</label>
            <input type="file" name="storeLogo" onChange={handleChange} accept="image/*" className="w-half  border border-gray-300" />
          </div>

          <div className="flex items-center justify-between gap-4">
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Save Changes</button>
            <button type="button" onClick={() => setEditMode(false)} className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MyStore;
