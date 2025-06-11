import React, { useEffect, useState } from "react";
import useStore from "../../hooks/useStore";
import "../../styles/Store.css"

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
  }, [fetchMyStore]);

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
      await fetchMyStore(); // Refresh store info after update
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  if (loading) return <p>Loading store info...</p>;
  if (!myStore) return <p>You have not created a store yet.</p>;

  return (
    <div className="mystore-container">
      <h1>{myStore.storeName}'s Information</h1>
      {!editMode ? (
        <div className="mystore-card">
          <img
            alt="Logo"
            className="store-logo"
            src={
              myStore?.storeLogo
                ? `http://localhost:5000${myStore.storeLogo}`
                : "/placeholder.png"
            }
          />
          <h3>{myStore.storeName}</h3>
          <p>
            <strong>Website:</strong>{" "}
            <a
              href={myStore.storeWebsite}
              target="_blank"
              rel="noopener noreferrer"
            >
              {myStore.storeWebsite}
            </a>
          </p>
          <p>
            <strong>Address:</strong> {myStore.storeAddress},{" "}
            {myStore.storeCity}
          </p>
          <p>
            <strong>Description:</strong> {myStore.storeDescription}
          </p>
          <button onClick={() => setEditMode(true)} className="edit-btn">
            Edit Store
          </button>
        </div>
      ) : (
        <form className="store-form" onSubmit={handleSubmit}>
          <label>Store Name :</label>
          <input
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            placeholder="Store Name"
            required
          />

          <label>Store Website</label>
          <input
            name="storeWebsite"
            value={formData.storeWebsite}
            onChange={handleChange}
            placeholder="Website"
          />

          <label>Store Address</label>
          <input
            name="storeAddress"
            value={formData.storeAddress}
            onChange={handleChange}
            placeholder="Address"
            required
          />

          <label>Store City</label>
          <input
            name="storeCity"
            value={formData.storeCity}
            onChange={handleChange}
            placeholder="City"
            required
          />

          <label>Store Description</label>
          <textarea
            name="storeDescription"
            value={formData.storeDescription}
            onChange={handleChange}
            placeholder="Description"
          />
          <input
            type="file"
            name="storeLogo"
            onChange={handleChange}
            accept="image/*"
          />
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default MyStore;
