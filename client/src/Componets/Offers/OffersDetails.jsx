import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import useAuth from "../../hooks/useAuth";
import useCoupon from "../../hooks/useCoupon";
import "react-toastify/dist/ReactToastify.css";

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
  const [alreadyRedeemed, setAlreadyRedeemed] = useState(false);
  const [daysInfo, setDaysInfo] = useState({ text: "", color: "" });

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
        const expiry = new Date(data.expiryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (diff <= 0) {
          setDaysInfo({ text: "Expired", color: "bg-red-100 text-red-600" });
        } else if (diff === 1) {
          setDaysInfo({ text: "Last Day", color: "bg-orange-100 text-orange-600" });
        } else if (diff <= 7) {
          setDaysInfo({ text: `${diff} days left`, color: "bg-yellow-100 text-yellow-800" });
        } else {
          setDaysInfo({
            text: format(expiry, "MMMM dd, yyyy"),
            color: "bg-green-100 text-green-700",
          });
        }

        if (user?.id) {
          await fetchMyRedeemedCoupons(user.id);
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

  const isExpired = daysInfo.text === "Expired";

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-5 w-40 bg-gray-200 rounded-full mb-4 mx-auto" />
        <div className="h-6 w-3/4 bg-gray-300 rounded-full mb-6 mx-auto" />
        <div className="bg-gray-100 p-6 rounded-xl mb-6">
          <div className="h-10 w-48 bg-gray-200 rounded mb-3 mx-auto" />
          <div className="h-8 w-32 bg-gray-300 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 h-32 rounded-lg" />
          <div className="bg-gray-100 h-32 rounded-lg" />
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded-full mx-auto mt-10" />
      </div>
    );
  }

  if (error)
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <>
      <Helmet>
        <title>
          {coupon?.title} | {coupon?.store?.storeName} - Namma Ooru Offers
        </title>
      </Helmet>

      <div className="relative max-w-6xl mx-auto px-6 py-10 mt-8 bg-white shadow-[0_0_1px_1px_#00000024] rounded-xl">
        <div className={`absolute top-6 right-6 text-sm px-3 py-1 rounded-full ${daysInfo.color}`}>
          {daysInfo.text}
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mt-8 mb-4">
          {coupon?.title}
        </h2>
        <p className="text-center text-gray-600 text-base mb-6">
          {coupon?.description}
        </p>

        <div
          className={`p-6 rounded-lg text-center mb-6 ${
            isExpired ? "bg-red-50" : "bg-blue-50"
          }`}
        >
          {showCode ? (
            <div className="space-y-3 flex flex-col justify-center items-center">
              <p className="text-2xl font-mono font-bold text-green-600 bg-green-100 px-4 py-2 rounded inline-block tracking-widest">
                {coupon?.redemptionCode}
              </p>
              <button
                onClick={copyToClipboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium"
              >
                Copy Code
              </button>
              {alreadyRedeemed && (
                <p className="text-sm text-gray-600">
                  You already redeemed this offer.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-2xl tracking-widest text-gray-400">
                •••• •••• ••••
              </p>
              <button
                onClick={handleRedeem}
                disabled={isExpired}
                className={`px-6 py-2 text-white font-semibold rounded-full ${
                  isExpired
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isExpired ? "Offer Expired" : "Redeem Code"}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Store Info
            </h3>
            <p className="text-gray-700 text-sm mb-1">
              <strong>Name:</strong> {coupon?.store?.storeName}
            </p>
            <p className="text-gray-700 text-sm mb-1">
              <strong>City:</strong> {coupon?.store?.storeCity}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Website:</strong>{" "}
              <a
                href={coupon?.store?.storeWebsite || "#"}
                className="text-black-600 "
              >
                {coupon.store?.storeName || "No Website"}
              </a>
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Terms & Conditions
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {Array.isArray(coupon?.terms) && coupon.terms.length > 0 ? (
                coupon.terms.map((term, i) => <li key={i}>{term}</li>)
              ) : (
                <li>No terms provided.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/offers">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-full text-sm font-medium">
              ← Back to All Offers
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default OffersDetails;
