import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import  useAuth  from "../../hooks/useAuth";
import useCoupon from "../../hooks/useCoupon";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/OfferDetail.css";

const OffersDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    getCouponById,
    fetchMyRedeemedCoupons,
    redeemedCoupons,
    redeemCoupon,
  } = useCoupon();

  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [alreadyRedeemed, setAlreadyRedeemed] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "No expiry date";
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) {
        setError("Invalid coupon ID");
        setLoading(false);
        return;
      }

      try {
        const data = await getCouponById(id);
        setCoupon(data);
        setIsExpired(new Date(data.expiryDate) < new Date());

        if (user?.id) {
          await fetchMyRedeemedCoupons(user.id);

          // Check if already redeemed
          const found = redeemedCoupons.some((item) => item.coupon?._id === id);
          setAlreadyRedeemed(found);
          if (found) setShowCode(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, user?.id]);

  const handleRedeem = async () => {
    if (!user) {
      toast.error("Login to redeem the coupon.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      await redeemCoupon({
        userId: user.id,
        couponId: coupon._id,
        storeId: coupon.store?._id,
        redemptionCode: coupon.redemptionCode,
        expiryDate: coupon.expiryDate,
        title: coupon.title,
        storeName: coupon.store?.storeName,
      });

      setShowCode(true);
      setAlreadyRedeemed(true);
      toast.success("Coupon redeemed successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const copyToClipboard = () => {
    if (coupon?.redemptionCode) {
      navigator.clipboard.writeText(coupon.redemptionCode);
      toast.success("Code copied to clipboard!");
    }
  };

  if (loading) return <div className="details-loading">Loading...</div>;
  if (error) return <div className="details-error">Error: {error}</div>;

  return (
    <>
      <Helmet>
        <title>
          {coupon?.title
            ? `${coupon.title} | ${coupon.store?.storeName} - Namma Ooru Offers`
            : "Offer Details | Namma Ooru Offers"}
        </title>
        <meta
          name="description"
          content={
            coupon?.description ||
            "View this exclusive offer and redeem it before it expires!"
          }
        />
        <meta
          property="og:title"
          content={`${coupon?.title} | ${coupon?.store?.storeName}`}
        />
        <meta
          property="og:description"
          content={
            coupon?.description ||
            "Get exclusive local deals from your favorite store."
          }
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://yourdomain.com/offersdetails/${id}`}
        />
        <meta
          property="og:image"
          content="https://yourdomain.com/assets/og-image.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="details-container">
        <h2 className="details-title">{coupon?.title}</h2>

        <div className="details-description-box">
          <p className="details-description">{coupon?.description}</p>
          <p className={`details-expiry ${isExpired ? "expired" : ""}`}>
            Expiry Date: {formatDate(coupon?.expiryDate)}
            {isExpired && <span className="details-expired-tag">Expired</span>}
          </p>
        </div>

        <div className="details-store-info">
          <h3>Store Details</h3>
          <p>
            <strong>Store Name:</strong> {coupon?.store?.storeName}
          </p>
          <p>
            <strong>City:</strong> {coupon?.store?.storeCity}
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a
              href={coupon?.store?.storeWebsite || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="details-store-link"
            >
              {coupon?.store?.storeName || "N/A"}
            </a>
          </p>
        </div>

        <div className={`details-code-box ${isExpired ? "expired" : ""}`}>
          {showCode ? (
            <div className="details-code-reveal">
              <p className="details-code-text">{coupon?.redemptionCode}</p>
              <button onClick={copyToClipboard} className="details-copy-button">
                Copy Code
              </button>
              {alreadyRedeemed && (
                <p className="details-redeemed-message">
                  You already redeemed this offer.
                </p>
              )}
            </div>
          ) : (
            <div className="details-code-hidden">
              <p className="details-code-placeholder">•••• •••• ••••</p>
              <button
                className={`details-redeem-button ${
                  isExpired ? "disabled" : ""
                }`}
                onClick={handleRedeem}
                disabled={isExpired}
              >
                {isExpired ? "Offer Expired" : "Redeem Code"}
              </button>
            </div>
          )}
        </div>

        <div className="details-terms-box">
          <h3>Terms & Conditions</h3>
          <ul className="details-terms-list">
            {Array.isArray(coupon?.terms) && coupon.terms.length > 0 ? (
              coupon.terms.map((term, i) => (
                <li key={i} className="details-term-item">
                  {term}
                </li>
              ))
            ) : (
              <li className="details-term-item">No terms provided.</li>
            )}
          </ul>
        </div>

        <Link to="/offers" className="details-back-link">
          <button className="details-back-button">← Back to All Offers</button>
        </Link>
      </div>
    </>
  );
};

export default OffersDetails;
