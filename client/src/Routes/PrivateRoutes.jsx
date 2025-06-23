import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";


const PrivateRoute = ({ role, requiredPermissions = [], children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    if (loading) return;

    // 1. Not authenticated
    if (!isAuthenticated) {
      setRedirectPath("/login");
    }
    // 2. Authenticated but no user data
    else if (!user) {
      setRedirectPath("/error");
    }
    // 3. Role mismatch
    else if (role && user.role !== role) {
      setRedirectPath("/unauthorized");
    }
    // 4. Permission check failed
    else if (
      requiredPermissions.length > 0 &&
      !requiredPermissions.every((perm) => user.permissions?.includes(perm))
    ) {
      setRedirectPath("/unauthorized");
    } else {
      setRedirectPath(null); // ✅ Access granted
    }
  }, [isAuthenticated, user, loading, role, requiredPermissions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
      </div>
    );
  }

  if (redirectPath) {
    return (
      <Navigate
        to={redirectPath}
        state={{
          from: location,
          error:
            redirectPath === "/error"
              ? "User data not available"
              : redirectPath === "/unauthorized"
              ? "Unauthorized access"
              : undefined,
        }}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoute;
