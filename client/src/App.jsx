import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Navigate } from "react-router-dom";

// Public Pages
import Home from "./pages/Page/Home";
import About from "./pages/Page/About";
import Contact from "./pages/Page/Contact";
import Whyus from "./pages/Page/Whyus";
import Offers from "./Componets/Offers/Offers"
import OffersDetails from "./Componets/Offers/OffersDetails"

// Auth Pages
import Login from "./pages/AuthPages/Login";
import Register from "./pages/AuthPages/Register";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";

import Verification from "./pages/AuthPages/Verification";

// Components
import Navbar from "./Componets/Navbar/Navbar";
import PrivateRoute from "./Routes/PrivateRoutes";

// Dashboard
import AdminDashboard from "./Componets/Dashboard/AdminDashboard";
import UserDashboard from "./Componets/Dashboard/UserDashboard";
import StoreDashboard from "./Componets/Dashboard/StoreDashboard";
import Footer from "./Componets/Footer/Footer";

// Admin Pages
import InfoForm from "./Componets/Admin/InfoForm";
import Analytics from "./Componets/Admin/Analytics";
import UserList from "./Componets/Admin/UserList";
import AllStore from "./Componets/Admin/AllStore";
import StoreDetail from "./Componets/Admin/StoreDetail";

// Store Pages 
import CouponList from "./Componets/Store/CouponList"
import CouponForm from "./Componets/Store/CouponForm"
import CouponDetail from "./Componets/Store/CouponDetail"
import RedeemedList from "./Componets/Store/RedeemedList"
import StoreInformation from "./Componets/Store/StoreInformation"

// User Pages
import UserCoupons from "./Componets/User/UserCoupons";
import MyStore from "./Componets/Store/MyStore";
import StoreAnalytics from "./Componets/Store/StoreAnalytics";
import ResetPassword from "./pages/AuthPages/ResetPassword";


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
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/whyus" element={<Whyus />} />
           <Route path="/offers" element={<Offers />} />
            <Route path="/offersdetails/:id" element={<OffersDetails />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<Verification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

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

        <Footer />
      </Router>
    </>
  );
};

export default App;
