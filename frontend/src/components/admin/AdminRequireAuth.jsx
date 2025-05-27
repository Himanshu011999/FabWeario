import { useContext } from "react";
import { AdminAuthContext } from "../context/AdminAuth";
import { Navigate } from "react-router-dom";

export const AdminRequireAuth = ({ children }) => {
    const context = useContext(AdminAuthContext);

    // Fallback if context is not defined
    if (!context) {
        // console.warn("AdminAuthContext is not available. Did you wrap your app with AdminAuthProvider?");
        return <Navigate to="/admin/login" />;
    }

    const { user } = context;

    if (!user) {
        return <Navigate to="/admin/login" />;
    }

    return children;
};
