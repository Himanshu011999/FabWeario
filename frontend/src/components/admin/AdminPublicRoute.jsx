// components/AdminPublicRoute.js
import { Navigate } from "react-router-dom";

const AdminPublicRoute = ({ children }) => {
    const admin = localStorage.getItem("adminInfo");

    return admin ? <Navigate to="/admin/dashboard" /> : children;
};

export default AdminPublicRoute;
