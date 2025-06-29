import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useStore from "../../hooks/useStore";
import useCoupon from "../../hooks/useCoupon";

const StoresDetails = () => {
  const { id } = useParams();                               // storeId
  const { storeDetails, fetchStoreById, loading, error } = useStore();
  const {
    storeCoupons,
    fetchCouponsByStore,
    loading: couponLoading,
    error: couponError,
  } = useCoupon();

  /* ───────────────────────── Fetch data on mount / id change ───────────────────────── */
  useEffect(() => {
    if (id) {
      fetchStoreById(id);
      fetchCouponsByStore(id);
    }
  }, [id]);

  /* ───────────────────────── Loading & error guards ───────────────────────── */
  if (loading)
    return <div className="text-center py-10">Loading store details…</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!storeDetails)
    return <div className="text-center py-10">Store not found.</div>;

  /* ───────────────────────── Destructure store data ───────────────────────── */
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

  /* ───────────────────────── JSX ───────────────────────── */
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* ============ STORE HEADER ============ */}
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

        {/* Social links */}
        <div className="flex gap-4 justify-center mt-4">
          {socialMedia?.instagram && (
            <a
              href={socialMedia.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-pink-500"
            >
              Instagram
            </a>
          )}
          {socialMedia?.facebook && (
            <a
              href={socialMedia.facebook}
              target="_blank"
              rel="noreferrer"
              className="text-blue-700"
            >
              Facebook
            </a>
          )}
          {socialMedia?.twitter && (
            <a
              href={socialMedia.twitter}
              target="_blank"
              rel="noreferrer"
              className="text-sky-400"
            >
              Twitter
            </a>
          )}
          {socialMedia?.youtube && (
            <a
              href={socialMedia.youtube}
              target="_blank"
              rel="noreferrer"
              className="text-red-600"
            >
              YouTube
            </a>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            Owner: <span className="font-medium">{owner?.username}</span>
          </p>
          <p>Email: {owner?.email}</p>
        </div>
      </div>

      {/* ============ COUPONS SECTION ============ */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Available Coupons</h2>

        {couponLoading ? (
          <div className="text-center text-gray-400">Loading coupons…</div>
        ) : couponError ? (
          <div className="text-center text-red-500">{couponError}</div>
        ) : storeCoupons.length === 0 ? (
          <p className="text-gray-500">No coupons available for this store.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            {storeCoupons.map((coupon) => (
              <div
                key={coupon._id}
                className="relative h-64 rounded-lg overflow-hidden shadow-lg group"
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition duration-300"
                  style={{
                    backgroundImage: `url(${
                      coupon.backgroundImage ||
                      "https://via.placeholder.com/400x250"
                    })`,
                  }}
                />

                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />

                {/* Store logo badge */}
                {coupon.store?.storeLogo && (
                  <img
                    src={coupon.store.storeLogo}
                    alt="store logo"
                    className="absolute top-4 left-4 w-10 h-10 rounded-full border-2 border-white z-30 bg-white object-cover"
                  />
                )}

                {/* Content */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                  <div className="text-white">
                    <h3 className="text-lg font-bold">{coupon.title}</h3>
                    <p className="text-sm text-gray-200">
                      {coupon.store?.storeCity}
                    </p>
                  </div>

                  <Link
                    to={`/coupon/${coupon._id}`}
                    className="inline-block bg-white text-black text-sm px-4 py-1.5 rounded-full font-medium hover:bg-black hover:text-white transition"
                  >
                    View Coupon
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoresDetails;
