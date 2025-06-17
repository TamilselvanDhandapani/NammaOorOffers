import { createContext, useReducer, useEffect } from "react";
import api from "../Services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  message: "",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, message: "" };
    case "AUTH_SUCCESS":
      return { ...state, loading: false, isAuthenticated: true, user: action.payload };
    case "AUTH_FAIL":
      return { ...state, loading: false, isAuthenticated: false, user: null, message: action.payload };
    case "LOGOUT":
      return { ...initialState, loading: false };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "STOP_LOADING":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 🔄 Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch({ type: "LOGOUT" });
        return;
      }

      try {
        dispatch({ type: "AUTH_START" });
        const res = await api.get("/auth/me");
        const user = res.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: "AUTH_SUCCESS", payload: user });
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
        toast.error("Session expired. Please log in again.");
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get("token");
    if (oauthToken) {
      localStorage.setItem("token", oauthToken);
      window.history.replaceState({}, "", window.location.pathname);
    }

    loadUser();
  }, []);

  // 📝 Register
  const register = async (username, email, password, phone, DOB, referalCode) => {
    dispatch({ type: "AUTH_START" });
    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
        phone,
        DOB,
        referalCode,
      });

      localStorage.setItem("pendingUserId", res.data.userId);
      localStorage.setItem("pendingEmail", email);
      dispatch({ type: "SET_MESSAGE", payload: res.data.msg || "OTP sent" });
      toast.success("OTP sent to your email.");
      return true;
    } catch (err) {
      const msg = err.response?.data?.msg || "Register failed!";
      dispatch({ type: "AUTH_FAIL", payload: msg });
      toast.error(msg);
      return false;
    }
  };

  // 🔐 Verify OTP
  const verifyOtp = async (otp) => {
    dispatch({ type: "AUTH_START" });
    try {
      const userId = localStorage.getItem("pendingUserId");
      const res = await api.post("/auth/verify-otp", { userId, otp });
      const { token, user } = res.data;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: "AUTH_SUCCESS", payload: user });
      }

      localStorage.removeItem("pendingUserId");
      localStorage.removeItem("pendingEmail");

      dispatch({ type: "SET_MESSAGE", payload: res.data.msg });
      toast.success(res.data.msg || "OTP verified successfully!");
      return true;
    } catch (err) {
      const msg = err.response?.data?.msg || "OTP verification failed!";
      dispatch({ type: "AUTH_FAIL", payload: msg });
      toast.error(msg);
      return false;
    }
  };

  // 🔐 Login
  const login = async (email, password) => {
    dispatch({ type: "AUTH_START" });
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "AUTH_SUCCESS", payload: user });
      toast.success("Login successful!");
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.msg || "Login failed!";
      dispatch({ type: "AUTH_FAIL", payload: msg });
      toast.error(msg);
      return { success: false };
    }
  };

  // 🔐 Google Login
  const googleLogin = async (tokenId) => {
    dispatch({ type: "AUTH_START" });
    try {
      const res = await api.post("/auth/google-login", { tokenId });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "AUTH_SUCCESS", payload: user });
      toast.success("Google login successful!");
      return true;
    } catch (err) {
      const msg = err.response?.data?.msg || "Google login failed";
      dispatch({ type: "AUTH_FAIL", payload: msg });
      toast.error(msg);
      return false;
    }
  };

  // 🔁 Resend OTP
  const resendOtp = async () => {
    try {
      const email = localStorage.getItem("pendingEmail");
      const res = await api.post("/auth/resend-otp", { email });
      dispatch({ type: "SET_MESSAGE", payload: res.data.msg });
      toast.success("OTP resent successfully!");
    } catch (err) {
      const msg = err.response?.data?.msg || "Resend OTP failed";
      dispatch({ type: "AUTH_FAIL", payload: msg });
      toast.error(msg);
    }
  };

  // 🔐 Forgot Password
  const forgotPassword = async (email) => {
    try {
      const res = await api.post("/auth/forgot-password", { email });
      dispatch({ type: "SET_MESSAGE", payload: res.data.msg });
      toast.success("Password reset link sent to your email!");
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to send reset link!";
      dispatch({ type: "AUTH_FAIL", payload: msg });
      toast.error(msg);
    }
  };

  // 🔐 Reset Password
  const resetPassword = async ({ token, newPassword }) => {
    try {
      const res = await api.post("/auth/reset-password", { token, newPassword });
      dispatch({ type: "SET_MESSAGE", payload: res.data.msg });
      toast.success("Password reset successful!");
      return true;
    } catch (err) {
      const msg = err.response?.data?.msg || "Reset failed!";
      dispatch({ type: "AUTH_FAIL", payload: msg });
      toast.error(msg);
      return false;
    }
  };

  // 🧑‍💼 Create Store User (by Super Admin)
  const createStoreUser = async (username, email, password, role) => {
    dispatch({ type: "AUTH_START" });
    try {
      const res = await api.post("/store/create", { username, email, password, role });
      toast.success("Store user created successfully");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to create user";
      dispatch({ type: "AUTH_FAIL", payload: msg });
      toast.error(msg);
      throw new Error(msg);
    } finally {
      dispatch({ type: "STOP_LOADING" });
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("pendingUserId");
    localStorage.removeItem("pendingEmail");
    dispatch({ type: "LOGOUT" });
    toast.info("Logged out successfully.");
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        googleLogin,
        createStoreUser,
      }}
    >
      {!state.loading ? children : <div className="min-h-screen flex justify-center items-center">Loading auth...</div>}
    </AuthContext.Provider>
  );
};

export default AuthContext;
