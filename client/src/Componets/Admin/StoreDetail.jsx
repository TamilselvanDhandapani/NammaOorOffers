import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import useStore from "../../hooks/useStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faStore,
  faMapMarkerAlt,
  faInfoCircle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faYoutube,
  faTwitter,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";

const StoreDetails = () => {
  const { id } = useParams();
  const { storeDetails, loading, error, fetchStoreById } = useStore();

  useEffect(() => {
    if (id) fetchStoreById(id);
  }, [id]);

  if (loading)
    return <p className="text-center text-gray-600 mt-10 animate-pulse">Loading store information...</p>;

  if (error)
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => fetchStoreById(id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Retry
        </button>
      </div>
    );

  if (!storeDetails)
    return <p className="text-center text-gray-500 mt-10">Store not found.</p>;

  const shop = storeDetails;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Helmet>
        <title>{shop.storeName} | Namma Ooru Offers</title>
        <meta
          name="description"
          content={
            shop.storeDescription?.slice(0, 150) ||
            `Explore ${shop.storeName}'s store details and latest offers on Namma Ooru Offers.`
          }
        />
        <meta property="og:title" content={`${shop.storeName} | Namma Ooru Offers`} />
        <meta
          property="og:description"
          content={
            shop.storeDescription?.slice(0, 150) ||
            `Find deals from ${shop.storeName} in ${shop.storeCity}.`
          }
        />
        {shop.storeLogo?.startsWith("http") && (
          <meta property="og:image" content={shop.storeLogo} />
        )}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://nammaooroffers-1-ouei.onrender.com/store/${id}`}
        />
      </Helmet>

      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        <FontAwesomeIcon icon={faStore} className="mr-2" />
        Shop Profile
      </h2>

      <div className="flex flex-col lg:flex-row items-start gap-8 bg-white shadow-md rounded-xl p-6">
        {/* Logo + Social */}
        <div className="flex flex-col items-center w-full lg:w-1/3 text-center">
          <img
            src={
              shop.storeLogo?.startsWith("http")
                ? shop.storeLogo
                : "/placeholder.png"
            }
            onError={(e) => (e.target.src = "/placeholder.png")}
            alt={shop.storeName || "Store Logo"}
            className="w-40 h-40 object-cover rounded-lg border border-gray-300 mb-4"
          />

          <div className="flex gap-4 justify-center mt-2">
            {shop.socialMedia?.instagram && (
              <a
                href={shop.socialMedia.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-pink-600 hover:text-pink-700"
              >
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
            )}
            {shop.socialMedia?.youtube && (
              <a
                href={shop.socialMedia.youtube}
                target="_blank"
                rel="noreferrer"
                className="text-red-600 hover:text-red-700"
              >
                <FontAwesomeIcon icon={faYoutube} size="lg" />
              </a>
            )}
            {shop.socialMedia?.twitter && (
              <a
                href={shop.socialMedia.twitter}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-500"
              >
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
            )}
            {shop.socialMedia?.facebook && (
              <a
                href={shop.socialMedia.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="w-full lg:w-2/3 space-y-4">
          <p className="text-lg text-gray-700">
            <strong>Name:</strong> {shop.storeName || "N/A"}
          </p>

          {shop.storeWebsite && (
            <p className="text-lg text-gray-700">
              <strong>
                <FontAwesomeIcon icon={faGlobe} className="mr-1" />
                Website:
              </strong>{" "}
              <a
                href={shop.storeWebsite}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {shop.storeWebsite.replace(/^https?:\/\//, "")}
              </a>
            </p>
          )}

          <p className="text-lg text-gray-700">
            <strong>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
              Address:
            </strong>{" "}
            {shop.storeAddress || "N/A"}
          </p>

          {shop.storeDescription && (
            <p className="text-lg text-gray-700">
              <strong>
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                Description:
              </strong>{" "}
              {shop.storeDescription}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/allstore"
          className="inline-flex items-center text-blue-600 hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Return to Shops
        </Link>
      </div>
    </div>
  );
};

export default StoreDetails;
