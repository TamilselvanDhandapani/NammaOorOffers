import React, { useState } from "react";
import "../../styles/StoreInformation.css";
import useStore  from "../../hooks/useStore";
const StoreInformation = () => {
  const { createStore } = useStore();

  const [storeName, setStoreName] = useState("");
  const [storeLogo, setStoreLogo] = useState(null);
  const [storeWebsite, setStoreWebsite] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeCity, setStoreCity] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [xLink, setXLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("storeName", storeName);
    formData.append("storeWebsite", storeWebsite);
    formData.append("storeAddress", storeAddress);
    formData.append("storeCity", storeCity);
    formData.append("storeDescription", storeDescription);
    formData.append(
      "socialMedia",
      JSON.stringify({
        instagram: instagramLink,
        youtube: youtubeLink,
        twitter: xLink,
        facebook: facebookLink,
      })
    );

    if (storeLogo) {
      formData.append("storeLogo", storeLogo);
    }

    try {
      const response = await createStore(formData);
      setMessage("✅ Store information submitted successfully!");

      // Reset form
      setStoreName("");
      setStoreLogo(null);
      setStoreWebsite("");
      setStoreAddress("");
      setStoreCity("");
      setStoreDescription("");
      setInstagramLink("");
      setYoutubeLink("");
      setXLink("");
      setFacebookLink("");
    } catch (err) {
      console.error("Error submitting store:", err);
      setMessage(err.message || "❌ Failed to submit store information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="store-info-container">
      <h2 className="store-info-heading">Add Store Information</h2>

      {message && (
        <div
          className={`store-info-message ${
            message.includes("success") ? "store-info-success" : "store-info-error"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="store-info-form">
        <div className="store-info-group">
          <label className="store-info-label">Store Name *</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="store-info-input"
            required
          />
        </div>

        <div className="store-info-group">
          <label className="store-info-label">Store Logo</label>
          <input
            type="file"
            onChange={(e) => setStoreLogo(e.target.files[0])}
            className="store-info-file"
            accept="image/*"
          />
        </div>

        <div className="store-info-group">
          <label className="store-info-label">Website</label>
          <input
            type="url"
            value={storeWebsite}
            onChange={(e) => setStoreWebsite(e.target.value)}
            className="store-info-input"
          />
        </div>

        <div className="store-info-group">
          <label className="store-info-label">Address</label>
          <input
            type="text"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            className="store-info-input"
          />
        </div>

        <div className="store-info-group">
          <label className="store-info-label">City</label>
          <input
            type="text"
            value={storeCity}
            onChange={(e) => setStoreCity(e.target.value)}
            className="store-info-input"
          />
        </div>

        <div className="store-info-group">
          <label className="store-info-label">Description</label>
          <textarea
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            className="store-info-textarea"
            rows="4"
          />
        </div>

        <div className="social-media-section">
          <h3 className="social-media-heading">Social Media Links</h3>

          <div className="store-info-group">
            <label className="store-info-label">Instagram</label>
            <input
              type="url"
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
              className="store-info-input"
            />
          </div>

          <div className="store-info-group">
            <label className="store-info-label">YouTube</label>
            <input
              type="url"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="store-info-input"
            />
          </div>

          <div className="store-info-group">
            <label className="store-info-label">X (Twitter)</label>
            <input
              type="url"
              value={xLink}
              onChange={(e) => setXLink(e.target.value)}
              className="store-info-input"
            />
          </div>

          <div className="store-info-group">
            <label className="store-info-label">Facebook</label>
            <input
              type="url"
              value={facebookLink}
              onChange={(e) => setFacebookLink(e.target.value)}
              className="store-info-input"
            />
          </div>
        </div>

        <button type="submit" className="store-info-submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Store Information"}
        </button>
      </form>
    </div>
  );
};

export default StoreInformation;
