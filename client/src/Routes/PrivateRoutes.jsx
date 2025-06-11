import  useAuth  from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const PrivateRoute = ({ role, requiredPermissions = [], children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        setRedirectPath("/login");
      } else if (!user) {
        setRedirectPath("/error");
      } else if (role && user.role !== role) {
        setRedirectPath("/unauthorized");
      } else if (
        requiredPermissions.length > 0 &&
        !requiredPermissions.every((perm) => user.permissions?.includes(perm))
      ) {
        setRedirectPath("/unauthorized");
      }
    }
  }, [isAuthenticated, user, loading, role, requiredPermissions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (redirectPath) {
    return (
      <Navigate
        to={redirectPath}
        state={{ from: location, error: redirectPath === "/error" ? "User data not available" : undefined }}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoute;
