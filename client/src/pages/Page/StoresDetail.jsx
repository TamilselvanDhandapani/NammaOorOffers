import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import useStore from "../../hooks/useStore";


const StoresDetails = () => {
  const { id } = useParams();
 const { storeDetails, fetchStoreById, loading, error } = useStore();


  useEffect(() => {
    if (id) fetchStoreById(id);
  }, [id, fetchStoreById]);

  if (loading) return <div className="text-center py-10">Loading store details...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!storeDetails) return <div className="text-center py-10">Store not found.</div>;

  const {
    storeName,
    storeLogo,
    storeCity,
    storeDescription,
    storeWebsite,
    storeAddress,
    socialMedia,
    owner,
  } = storeDetails;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center">
        <img
          src={storeLogo || "https://via.placeholder.com/150"}
          alt={storeName}
          className="w-32 h-32 object-cover rounded-full mb-4 border"
        />
        <h1 className="text-3xl font-bold mb-2">{storeName}</h1>
        <p className="text-gray-500 mb-1">{storeCity}</p>
        <p className="text-sm text-gray-400 mb-4">{storeAddress}</p>
        {storeWebsite && (
          <a
            href={storeWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mb-4"
          >
            Visit Website
          </a>
        )}
        <p className="text-gray-700 leading-relaxed mb-6">{storeDescription}</p>

        <div className="flex gap-4 justify-center mt-4">
          {socialMedia?.instagram && (
            <a href={socialMedia.instagram} target="_blank" rel="noreferrer" className="text-pink-500">
              Instagram
            </a>
          )}
          {socialMedia?.facebook && (
            <a href={socialMedia.facebook} target="_blank" rel="noreferrer" className="text-blue-700">
              Facebook
            </a>
          )}
          {socialMedia?.twitter && (
            <a href={socialMedia.twitter} target="_blank" rel="noreferrer" className="text-sky-400">
              Twitter
            </a>
          )}
          {socialMedia?.youtube && (
            <a href={socialMedia.youtube} target="_blank" rel="noreferrer" className="text-red-600">
              YouTube
            </a>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Owner: <span className="font-medium">{owner?.username}</span></p>
          <p>Email: {owner?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default StoresDetails;
