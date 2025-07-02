import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Context providers
import { AuthProvider } from "./context/AuthContext.jsx";
import { CouponProvider } from "./context/CouponContext.jsx";
import { StoreProvider } from "./context/StoreContext.jsx";
import { AnalyticsProvider } from "./context/AnalyticsContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";

// Google OAuth
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = document.getElementById("root");

createRoot(root).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="505721256343-7sjaar69gigpujablaocuqe5c0vlb3hh.apps.googleusercontent.com">
      <AuthProvider>
        <CouponProvider>
          <StoreProvider>
           <AnalyticsProvider>
            <ProductProvider>
             <App />  
            </ProductProvider>
           </AnalyticsProvider>
          </StoreProvider>
        </CouponProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
