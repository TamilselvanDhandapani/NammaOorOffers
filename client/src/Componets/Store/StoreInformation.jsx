import React, { useState } from "react";
import useStore from "../../hooks/useStore";

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
      await createStore(formData);
      setMessage("✅ Store information submitted successfully!");

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
    <div className="max-w-3xl mx-auto px-4 py-10 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Add Store Information
      </h2>

      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded ${
            message.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div>
          <label className="block mb-1 font-medium">Store Name *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Store Logo</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border border-gray-300"
            onChange={(e) => setStoreLogo(e.target.files[0])}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Website</label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={storeWebsite}
            onChange={(e) => setStoreWebsite(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Address</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">City</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={storeCity}
            onChange={(e) => setStoreCity(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full resize-none border border-gray-300 rounded px-4 py-2"
            rows={4}
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
          />
        </div>

        <div className="pt-6 border-t border-gray-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Social Media Links
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Instagram</label>
              <input
                type="url"
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">YouTube</label>
              <input
                type="url"
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">X (Twitter)</label>
              <input
                type="url"
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={xLink}
                onChange={(e) => setXLink(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Facebook</label>
              <input
                type="url"
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={facebookLink}
                onChange={(e) => setFacebookLink(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Submitting..." : "Submit Store Information"}
        </button>
      </form>
    </div>
  );
};

export default StoreInformation;
