import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import useStore from "../../hooks/useStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Solid icons
import {
  faGlobe,
  faStore,
  faMapMarkerAlt,
  faInfoCircle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

// Brand icons
import {
  faInstagram,
  faYoutube,
  faTwitter,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";

import "../../styles/StoreDetail.css";

const StoreDetails = () => {
  const { id } = useParams();
  const { storeDetails, loading, error, fetchStoreById } = useStore();

  useEffect(() => {
    if (id) fetchStoreById(id);
  }, [id]);

  if (loading)
    return <p className="loading-text">Loading store information...</p>;

  if (error)
    return (
      <div className="error-box">
        <p className="error-text">{error}</p>
        <button onClick={() => fetchStoreById(id)} className="retry-btn">
          Retry
        </button>
      </div>
    );

  if (!storeDetails) return <p className="error-text">Store not found.</p>;

  const shop = storeDetails;


  return (
    <>
      <Helmet>
        <title>{shop.storeName} | Namma Ooru Offers</title>
        <meta
          name="description"
          content={
            shop.storeDescription?.slice(0, 150) ||
            `Explore ${shop.storeName}'s store details and latest offers on Namma Ooru Offers.`
          }
        />
        <meta
          property="og:title"
          content={`${shop.storeName} | Namma Ooru Offers`}
        />
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
      <div className="store-detail-container">
        <h2 className="shop-heading">
          <FontAwesomeIcon icon={faStore} /> Shop Profile
        </h2>

        <div className="shop-profile-wrapper">
          <div className="shop-image-section">
            <img
              src={
                shop.storeLogo?.startsWith("http")
                  ? shop.storeLogo
                  : "/placeholder.png"
              }
              onError={(e) => (e.target.src = "/placeholder.png")}
              alt={shop.storeName || "Store Logo"}
              className="shop-image"
            />

            <div className="social-links-wrapper">
              {shop.socialMedia?.instagram && (
                <a
                  href={shop.socialMedia.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link insta"
                >
                  <FontAwesomeIcon icon={faInstagram} size="2x" />
                </a>
              )}
              {shop.socialMedia?.youtube && (
                <a
                  href={shop.socialMedia.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link yt"
                >
                  <FontAwesomeIcon icon={faYoutube} size="2x" />
                </a>
              )}
              {shop.socialMedia?.twitter && (
                <a
                  href={shop.socialMedia.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link tw"
                >
                  <FontAwesomeIcon icon={faTwitter} size="2x" />
                </a>
              )}
              {shop.socialMedia?.facebook && (
                <a
                  href={shop.socialMedia.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link fb"
                >
                  <FontAwesomeIcon icon={faFacebook} size="2x" />
                </a>
              )}
            </div>
          </div>

          <div className="shop-details-section">
            <p className="shop-detail">
              <strong>Name:</strong> {shop.storeName || "N/A"}
            </p>

            {shop.storeWebsite && (
              <p className="shop-detail">
                <strong>
                  <FontAwesomeIcon icon={faGlobe} /> Website:
                </strong>{" "}
                <a
                  href={shop.storeWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="website-url"
                >
                  {shop.storeWebsite.replace(/^https?:\/\//, "")}
                </a>
              </p>
            )}

            <p className="shop-detail">
              <strong>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Address:
              </strong>{" "}
              {shop.storeAddress || "N/A"}
            </p>

            {shop.storeDescription && (
              <p className="shop-detail">
                <strong>
                  <FontAwesomeIcon icon={faInfoCircle} /> Description:
                </strong>{" "}
                {shop.storeDescription}
              </p>
            )}
          </div>
        </div>

        <Link to="/allstore" className="return-link">
          <FontAwesomeIcon icon={faArrowLeft} /> Return to Shops
        </Link>
      </div>
    </>
  );
};

export default StoreDetails;
