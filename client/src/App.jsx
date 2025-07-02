import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Public Pages
import Home from "./pages/Page/Home";
import About from "./pages/Page/About";
import Contact from "./pages/Page/Contact";
import Whyus from "./pages/Page/Whyus";
import Stores from "./pages/Page/Stores";
import StoresDetails from "./pages/Page/StoresDetail";
import Offers from "./Componets/Offers/Offers";

import OffersDetails from "./Componets/Offers/OffersDetails";

// Auth Pages
import Login from "./pages/AuthPages/Login";
import Register from "./pages/AuthPages/Register";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import Verification from "./pages/AuthPages/Verification";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import Unauthorized from "./pages/AuthPages/Unauthorized";
import GenericError from "./pages/AuthPages/GenericError";

// Components
import Navbar from "./Componets/Navbar/Navbar";
import Footer from "./Componets/Footer/Footer";
import PrivateRoute from "./Routes/PrivateRoutes";

// Redirect Pages
import Redirect from "./pages/Page/Redirect";
import StoreHome from "./pages/Page/StoreHome";

// Dashboards
import AdminDashboard from "./Componets/Dashboard/AdminDashboard";
import UserDashboard from "./Componets/Dashboard/UserDashboard";
import StoreDashboard from "./Componets/Dashboard/StoreDashboard";

// Admin Pages
import InfoForm from "./Componets/Admin/InfoForm";
import Analytics from "./Componets/Admin/Analytics";
import UserList from "./Componets/Admin/UserList";
import AllStore from "./Componets/Admin/AllStore";
import StoreDetail from "./Componets/Admin/StoreDetail";

// Store Pages
import CouponList from "./Componets/Store/CouponList";
import CouponForm from "./Componets/Store/CouponForm";
import CouponDetail from "./Componets/Store/CouponDetail";
import RedeemedList from "./Componets/Store/RedeemedList";
import StoreInformation from "./Componets/Store/StoreInformation";
import MyStore from "./Componets/Store/MyStore";
import MyProducts from "./Componets/Store/MyProducts";
import MyProductDetail from "./Componets/Store/MyProductDetail";
import StoreAnalytics from "./Componets/Store/StoreAnalytics";
import CreateProduct from "./Componets/Store/CreateProduct";

// User Pages
import UserCoupons from "./Componets/User/UserCoupons";

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        pauseOnHover={false}
        theme="dark"
      />

      <Router>
        {/* Full page layout with sticky footer */}
        <div className="min-h-screen flex flex-col">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/redirect" element={<Redirect />} />
              <Route path="/store-home" element={<StoreHome />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/whyus" element={<Whyus />} />
              <Route path="/stores" element={<Stores/>} />
              <Route path="/store/:id" element={<StoresDetails />} />

              <Route path="/offers" element={<Offers />} />
              <Route path="/offersdetails/:id" element={<OffersDetails />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register-store" element={<InfoForm />} />
              <Route path="/verify-otp" element={<Verification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/error" element={<GenericError />} />

              {/* Admin Routes */}
              <Route
                path="/admin-dashboard"
                element={
                  <PrivateRoute role="admin">
                    <AdminDashboard>
                      <Navigate to="/analytics" replace />
                    </AdminDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/infoform"
                element={
                  <PrivateRoute role="admin">
                    <AdminDashboard>
                      <InfoForm />
                    </AdminDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <PrivateRoute role="admin">
                    <AdminDashboard>
                      <Analytics />
                    </AdminDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/userlist"
                element={
                  <PrivateRoute role="admin">
                    <AdminDashboard>
                      <UserList />
                    </AdminDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/allstore"
                element={
                  <PrivateRoute role="admin">
                    <AdminDashboard>
                      <AllStore />
                    </AdminDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/storedetail/:id"
                element={
                  <PrivateRoute role="admin">
                    <AdminDashboard>
                      <StoreDetail />
                    </AdminDashboard>
                  </PrivateRoute>
                }
              />

              {/* User Routes */}
              <Route
                path="/user-dashboard"
                element={
                  <PrivateRoute role="user">
                    <UserDashboard>
                      <Navigate to="/redeemed-coupons" replace />
                    </UserDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/redeemed-coupons"
                element={
                  <PrivateRoute role="user">
                    <UserDashboard>
                      <UserCoupons />
                    </UserDashboard>
                  </PrivateRoute>
                }
              />

              {/* Store Routes */}
              <Route
                path="/store-dashboard"
                element={
                  <PrivateRoute role="store">
                    <StoreDashboard>
                      <Navigate to="/couponlist" replace />
                    </StoreDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/storeinformation"
                element={
                  <PrivateRoute role="store">
                    <StoreDashboard>
                      <StoreInformation />
                    </StoreDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/couponform"
                element={
                  <PrivateRoute role="store">
                    <StoreDashboard>
                      <CouponForm />
                    </StoreDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/createproduct"
                element={
                  <PrivateRoute role="store">
                    <StoreDashboard>
                      <CreateProduct />
                    </StoreDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/couponlist"
                element={
                  <PrivateRoute role="store">
                    <StoreDashboard>
                      <CouponList />
                    </StoreDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/mystore"
                element={
                  <PrivateRoute role="store">
                    <StoreDashboard>
                      <MyStore />
                    </StoreDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/myproducts"
                element={
                  <PrivateRoute role="store">
                    <StoreDashboard>
                      <MyProducts />
                    </StoreDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/myproducts/:id"
                element={
                  <PrivateRoute role="store">
                    <StoreDashboard>
                      <MyProductDetail />
                    </StoreDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/storeanalytics"
                element={
                  <PrivateRoute role="store">
                    <StoreDashboard>
                      <StoreAnalytics />
                    </StoreDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/coupondetails/:id"
                element={
                  <PrivateRoute role="store">
                    <StoreDashboard>
                      <CouponDetail />
                    </StoreDashboard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/redeemedlist"
                element={
                  <PrivateRoute role="store">
                    <StoreDashboard>
                      <RedeemedList />
                    </StoreDashboard>
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </>
  );
};

export default App;
